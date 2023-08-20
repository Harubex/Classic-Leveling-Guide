import { getFileJson, getPageHtml } from "./util";
import fs from "fs/promises";

let questZones: {[id: string]: {zone: string, level: string}} = {};

export async function getQuestZone(questId: number) {
    const cacheFile = "./crawlcache.json";
    if (Object.keys(questZones).length === 0) {
        questZones = await getFileJson(cacheFile);
    }
    if (!questZones[questId]) {
        const $ = await getPageHtml(`https://www.wowhead.com/classic/quest=${questId}`);
        console.log(questId)
        const questZoneSelector = ".breadcrumb > span:last-child > a";
        const questZone = $(questZoneSelector).text();

        const questLevelSelector = "#infobox-contents-0 > ul > li:first-child > div";
        const questTypeSelector = "#infobox-contents-0 > ul > li:nth-child(3) > div";
        const questLevel = $(questLevelSelector).text().replace("Level: ", "");
        let questType = $(questTypeSelector).text();
        if (questType.indexOf("Elite") < 0 && questType.indexOf("Dungeon") < 0 && questType.indexOf("Raid") < 0) {
            questType = "";
        } else {
            questType = questType.replace("Type: ", "").substring(0, 1);
        }

        if (questZone) {
            questZones[questId] = {zone: questZone, level: questLevel + questType};
            await fs.writeFile(cacheFile, JSON.stringify(questZones));
        } else {
            console.error("Can't find zone for quest with id " + questId);
        }
    }
    return questZones[questId];
}
