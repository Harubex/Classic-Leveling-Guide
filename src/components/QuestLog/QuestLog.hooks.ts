import { useEffect, useState } from "react";
import useLocalStorage from "use-local-storage";
import { minBy } from "lodash";


interface QuestInfo {
    name: string;
    accepted?: boolean;
    completed?: boolean;
    index?: number;
}

type StepQuestInfo = {[stepNum: number]: QuestInfo[]};

const questNameRegex = /(?<!complete)\s\[@quest=([\w\s'!\-,":]+)\]/gi;
const questStateRegex = /(accept|turn in)/gi;

export const useQuestSteps = (steps: StepJson[]) => {
    const [stepQuestInfo, setStepQuestInfo] = useState<StepQuestInfo>({});
    const [selectedStep] = useLocalStorage<number>("selectedStep", 1);
    useEffect(() => {
        const newInfo = parseQuestSteps(steps, stepQuestInfo);
        setStepQuestInfo(newInfo);
    }, [steps, selectedStep, stepQuestInfo]);
    return stepQuestInfo;
};

export const parseQuestSteps = (steps: StepJson | StepJson[], stepQuestInfo: StepQuestInfo): StepQuestInfo => {
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

                const closestState = minBy(stateIndices, (stateIndex) => Math.abs(stateIndex.index! - questInfo.index!));
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
        }
    }
    return stepQuestInfo;
};