import { minBy } from "lodash";

const questNameRegex = /(?<!complete|take|drop|abandon)\s\[@quest=([\w\s'!\-,":]+)\]/gi;
const questStateRegex = /(accept|turn in)/gi;

const stepQuestInfo: StepQuestInfo = {};

export const parseQuestSteps = (steps: StepJson | StepJson[]): StepQuestInfo => {
    const stepArray = Array.isArray(steps) ? steps : [steps];
    for (const { step, text } of stepArray) {
        if (!stepQuestInfo[step]) {
            const stateIndices = [...text.matchAll(questStateRegex)];
            const stepQuests: {[name: string]: QuestInfo} = {};
            for (const match of text.matchAll(questNameRegex)) {
                const questInfo: QuestInfo = { name: match[1], index: match.index, accepted: false, completed: false };
                if (!stepQuests[questInfo.name]) {
                    stepQuests[questInfo.name] = questInfo;
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
                        stepQuests[questInfo.name].accepted = true;
                    } else if (stateText === "turn in") {
                        stepQuests[questInfo.name].completed = true;
                    }
                }
            }
            stepQuestInfo[step] = Object.values(stepQuests);
            
            console.log(step, stepQuestInfo[step]);
        }
    }
    return stepQuestInfo;
};