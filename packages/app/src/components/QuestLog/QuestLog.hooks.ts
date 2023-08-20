import { minBy } from "lodash";
import regex from "@shared/regex";
import debug from "../../debugLog";

const stepQuestInfo: StepQuestInfo = {};

export const parseQuestSteps = (steps: StepData | StepData[]): StepQuestInfo => {
    const stepArray = Array.isArray(steps) ? steps : [steps];
    for (const { step, text } of stepArray) {
        if (!stepQuestInfo[step]) {
            const stateIndices = [...text.matchAll(regex.questState)];
            const stepQuests: {[name: string]: QuestInfo} = {};
            for (const match of text.matchAll(regex.questName)) {
                const questInfo: QuestInfo = {
                    id: Number(match[2]),
                    name: match[1],
                    index: match.index,
                    accepted: false,
                    completed: false,
                    zone: match[3],
                    level: match[4]
                };
                const keyName = questInfo.name + questInfo.id;
                if (!stepQuests[keyName]) {
                    stepQuests[keyName] = questInfo;
                } else {
                    console.info(keyName)
                }
                const closestState = minBy(stateIndices, (stateIndex) => {
                    const delta = questInfo.index! - stateIndex.index!;
                    if (delta < 0) {
                        return 10000; // some random large
                    }
                    return delta;
                });
                if (closestState) {
                    const stateText = closestState[0].toLowerCase();
                    if (stateText === "accept") {
                        stepQuests[keyName].accepted = true;
                    } else if (stateText === "turn in") {
                        stepQuests[keyName].completed = true;
                    }
                }
            }
            stepQuestInfo[step] = Object.values(stepQuests);
            
            debug(step, stepQuestInfo[step]);
        }
    }
    return stepQuestInfo;
};