import json from "../../steps/1-10.json";
import { parseQuestSteps } from "./QuestLog.hooks";
import { List, ListItem, ListItemText } from "@mui/material";
import SidebarPane from "../SidebarPane/SidebarPane";
import Quests from "../Quests/Quests";

type SteppedQuestInfo = QuestInfo & { step: number };

let completed: {[name: string]: number} = {};
const stepLogs: SteppedQuestInfo[][] = [];

const buildQuestLog = (questData: StepQuestInfo, currentStep: number): SteppedQuestInfo[] => {
    if (!stepLogs[currentStep]) {
        const questLog: SteppedQuestInfo[] = [];
        for (let i = 1; i <= currentStep; i++) {
            const comp = Object.assign({}, completed);
            for (const quest in completed) {
                if (completed[quest] < currentStep) {
                    const questIndex = questLog.findIndex((q) => q.name === quest);
                    if (questIndex >= 0) {
                        questLog.splice(questIndex, 1);
                    }
                    delete comp[quest];
                }
                completed = comp;
            }
            for (let j = 0; j < questData[i].length; j++) {
                const quest = questData[i][j];
                if (quest.accepted) {
                    questLog.push(Object.assign({ step: i }, quest));
                }
                if (quest.completed) {
                    const questIndex = questLog.findIndex((q) => q.name === quest.name);
                    if (questIndex >= 0) {
                        questLog[questIndex].completed = true;
                        if (questLog[questIndex].step != currentStep) {
                            questLog[questIndex].accepted = false;
                        }
                    }
                    completed[quest.name] = i;
                }
            }
        }
        stepLogs[currentStep] = questLog;
        console.log("log", currentStep, stepLogs[currentStep]);
    }
    return stepLogs[currentStep];
};

interface QuestLogProps {
    step: number;
}

export const QuestLog: React.FC<QuestLogProps> = ({ step }) => {
    const questInfo = parseQuestSteps(json as StepJson[]);
    const stepLog = buildQuestLog(questInfo, step);

    //const questLog = stepLog[selectedStep] || (stepLog[selectedStep] = buildQuestLog(questInfo, selectedStep));

    return (
        <SidebarPane type="quest">
            <List disablePadding>
            {(stepLog || []).map((quest, i) => (
                <ListItem key={i} className="quest-entry step-pane-list">
                    {quest.accepted && (
                        <>
                            {quest.step === step && <img src="https://minecraft-map69.s3.us-east-2.amazonaws.com/quest_accept.png" />}
                        </>
                    )}
                    {quest.completed && <img src="https://minecraft-map69.s3.us-east-2.amazonaws.com/quest_turnin.png" />}
                    <ListItemText primary={<Quests name={quest.name} />} />
                </ListItem>
            ))}
        </List>
        </SidebarPane>
    );
};

export default QuestLog;
