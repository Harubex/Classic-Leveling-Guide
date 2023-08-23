import "module-alias/register";
import os from "os";
import fs from "fs/promises";
import axios from "axios";
import cors from "cors";
import express, { Response } from "express";
import _ from "lodash";
import { singular } from "pluralize";
import stepData from "@shared/steps.json";
import regex from "@shared/regex";
import { getQuestZone as getQuestMetadata } from "./scraper/crawl";
const app = express();

let searchResults: {[key: TypeName]: Record<string, WowheadSearchResult>} = {
    quest: {}, spell: {}, npc: {}, skill: {}, item: {}
};

app.get("/search", async (req, res) => {
    try {
        const query = req.query.search as string;
        const typeName = req.query.type as string
        res.json(await search(query, typeName));
    } catch (err) {
        res.status(500).send(err);
    }
});

const search = async (query: string, typeName: TypeName) => {
    if (searchResults[typeName][query]) {
        return searchResults[typeName][query];
    }

    const { status, data, statusText } = await axios.get<WowheadSearchResults>(
        `https://www.wowhead.com/classic/search/suggestions-template?q='${query}'`
    );

    if (status !== 200) {
        throw new Error(`API returned status ${status}: ${statusText}`);
    }
    
    if (data) {
        let match: WowheadSearchResult | undefined = undefined;
        if (typeName === "quest" || typeName === "npc" || typeName === "skill" || typeName === "item") {
            match = data.results.find((res) => {
                return res.typeName!.toLowerCase() === typeName && res.name!.toLowerCase() === query.toLowerCase();
            });
        }
        if (typeName === "spell") {
            const filteredResults = _.filter(data.results, (res) => res.typeName === "Spell")
            const matches = _.sortBy(filteredResults, (res) => res.id);
            if (matches.length > 0) {
                if (matches[0].rank && matches[0].rank !== "Rank 1") {
                    match = _.find(matches, (match) => match.rank === "Rank 1");
                } else {
                    match = matches[0];
                }
            }
        }
        if (match) {
            searchResults[typeName][query] = match;
        }  
        return searchResults[typeName][query];
    }
    return {} as WowheadSearchResult;
}

const exclusionList = ["Guard Thomas", 
"Beer Basted Boar Ribs", "Princess", "Wendigo Hides", "Handful of Oats", "Super Reaper 6000 Blueprints",
"Boar Intestines", "Fine Crab Chunks", "Sea Creature Bones", "Sea Turtle Remains", "Xabraxxis", "Hops", "Stitches",
"Stormwind Seasoning Herbs"];

const exceptions: any = {
   /* "Princess": {
        "type": 1,
        "id": 330,
        "name": "Princess",
        "typeName": "NPC",
        "popularity": 0
    }*/
}

const rebuildTag = async (searchTerm: string, type: string, templateId: number) => {
    let searchName = searchTerm;
    if (type === "npc" || type === "item") {
        searchName = !exclusionList.find((name) => name === searchTerm) ? singular(searchTerm) : searchTerm;
    }
    let searchRes: WowheadSearchResult = { id: templateId, name: searchTerm };
    if (!templateId) {
        if (exceptions[searchName]) {
            searchRes = exceptions[searchName];
        } else {
            searchRes = await search(searchName, type);
        }
        if (!searchRes) {
            console.error(`Unable to find entry for ${searchTerm}`);
        }
    }
    templateId = searchRes.id;

   
    if (type === "quest") {
        const questMetadata = await getQuestMetadata(templateId);
        if (questMetadata) {
            return `[@${type}=${searchTerm}#${templateId}&${questMetadata.zone}&${questMetadata.level}]`;
        }
    }
    return `[@${type}=${searchTerm}#${templateId}]`;
}

const parseStep = async ({text}: StepData): Promise<string[]> => {
    let chunks: string[] = [];
    let lastMatchIndex = 0;
    for (const match of text.matchAll(regex.entityMatches)) {
        const [matchedText, templateType, templateText, templateId] = match;
        const matchIndex = match.index!;
        chunks.push(text.substring(lastMatchIndex, matchIndex));
        switch (templateType) {
            case "quest":
                chunks.push(await rebuildTag(templateText, "quest", Number(templateId)));
                break;
            case "mob":
                chunks.push(await rebuildTag(templateText, "npc", Number(templateId)));
                break;
            case "move":
                chunks.push(await rebuildTag(templateText, "spell", Number(templateId)));
                break;
            case "money":
                chunks.push(`[@money=${templateText}]`);
                break;
            case "skill":
                chunks.push(await rebuildTag(templateText, "skill", Number(templateId)));
                break;
            case "item":
                chunks.push(await rebuildTag(templateText, "item", Number(templateId)));
                break;
        }
        lastMatchIndex = matchIndex + matchedText.length;
    }
    chunks.push(text.substring(lastMatchIndex));
    if (chunks.length === 0) {
        return [text];
    }
    return chunks;
};

const getStep = async (givenStep: number) => {
    const stepNum = Number(givenStep);
    if (Number.isNaN(stepNum)) {
        return {error: `The step number (${givenStep}) is invalid.`};
    }
    const step = stepData.find(({step}) => step === stepNum);
    if (step) {
        const stepText = await parseStep(step as StepData);
        const ret = Object.assign({}, step);
        ret.text = stepText.join("");
        return ret;
    } else {
        return {error: `The step number (${givenStep}) doesn't exist.`};
    }
}

app.get("/step/:startStep/:endStep", cors({ origin: "*" }), async (req, res) => {
    const startStep = Number(req.params.startStep);
    const endStep = Number(req.params.endStep);
    const steps: any = {};
    for (let i = startStep; i <= endStep; i++) {
        steps[i] = await getStep(i);
        if (steps[i].error) {
            res.status(400).json(steps[i]);
        }
    }
    return res.json(steps);
});

app.get("/step/:step", cors({ origin: "*" }), async (req, res) => {
    return res.json(await getStep(Number(req.params.step)));
});

const compileSteps = async (req: any, res?: Response) => {
    console.log("Compile Steps")
    searchResults = JSON.parse((await fs.readFile("./cache.json", {encoding: "utf-8"})).toString());
    const steps: any = {};
    for (let i = 1; i <= stepData.length; i++) {
        if (!stepData[i - 1].step) {
            stepData[i - 1].step = i;
        }
        steps[i] = await getStep(i);
        if (steps[i].error && res) {
            res.status(400).json(steps[i]);
        }
        //console.log(`Processed step ${i}.`);
    }
    await fs.writeFile("./cache.json", JSON.stringify(searchResults));
    await fs.writeFile("../shared/steps-cmp.json", JSON.stringify(Object.values(steps), undefined, 4));
};


app.get("/compile", compileSteps);

app.get("/steps", cors({ origin: "*" }), async (req, res) => {
    res.json({
        total: stepData.length
    });
});

try {
    compileSteps(null);
} catch (err) {
    console.error(err);
}


app.listen(6969, () => console.log(`Started on ${os.hostname()}:${6969}`));
