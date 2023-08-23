import React from "react";
import _ from "lodash";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListSubheader from "@mui/material/ListSubheader";
import ListItemText from "@mui/material/ListItemText";

import { parseQuestSteps } from "./QuestLog.hooks";
import { QuestEntry, SteppedQuestInfo } from "./QuestEntry";
import SidebarPane from "../SidebarPane/SidebarPane";
import debug from "../../debugLog";
import useJson from "../../jsonRefs";

let completed: {[name: string]: number} = {};
const stepLogs: SteppedQuestInfo[][] = [];

const questColors = {
    gray: "#a19f9f",
    green: "#0db80d",
    yellow: "#ebeb05",
    orange: "#de7102",
    red: "#e30707"
};

const buildQuestLog = (questData: StepQuestInfo, currentStep: number): SteppedQuestInfo[] => {
    if (!stepLogs[currentStep]) {
        const questLog: SteppedQuestInfo[] = [];
        for (let i = 1; i <= currentStep; i++) {
            const comp = Object.assign({}, completed);
            for (const quest in completed) {
                if (completed[quest] < currentStep) {
                    const questIndex = questLog.findIndex((q) => (q.name + q.id) === quest);
                    if (questIndex >= 0) {
                        questLog.splice(questIndex, 1);
                    }
                    delete comp[quest];
                }
                completed = comp;
            }
            if (questData[i]) {
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
                        completed[quest.name + quest.id] = i;
                    }
                }
            }
        }
        if (questLog.length > 0) {
            stepLogs[currentStep] = questLog;
        }
    }
    return stepLogs[currentStep];
};

interface QuestLogProps {
    step: number;
}

export const QuestLog: React.FC<QuestLogProps> = ({ step }) => {
    const json = useJson();
    const questInfo = parseQuestSteps(json);
    const stepLog = buildQuestLog(questInfo, step);
    const zonedStepLog: {[zoneName: string]: SteppedQuestInfo[]} = {};

    if (stepLog && stepLog.length > 0) {
        stepLog.sort((a, b) => {
            let cmpA = 0;
            let cmpB = 0;
            if (a.accepted && a.completed) {
                cmpA = -3;
            } else if (a.completed) {
                cmpA = -2;
            } else if (a.accepted) {
                cmpA = -1;
            }
            if (b.accepted && b.completed) {
                cmpB = 3;
            } else if (b.completed) {
                cmpB = 2;
            } else if (b.accepted) {
                cmpB = 1;
            }
            return cmpB + cmpA;
        });
        for (const questInfo of stepLog) {
            if (questInfo.zone) {
                if (!zonedStepLog[questInfo.zone]) {
                    zonedStepLog[questInfo.zone] = [];
                }
                zonedStepLog[questInfo.zone].push(questInfo);
            } else {
                debug("wtf");
            }
        }
    }

    const sortedZoneKeys = Object.keys(zonedStepLog);
    sortedZoneKeys.sort();
    

    const coerceLevel = (level: string) => {
        return Number(level.replace(/D|R|E/gi, ""));
    };

    const getQuestColor = (quest: SteppedQuestInfo): Color => {
        const questLevel = coerceLevel(quest.level!);
        const averageLevel = Math.round(_.sumBy(stepLog, (q) => coerceLevel(q.level!)) / stepLog.length);
        const charLevel = averageLevel + Math.round(averageLevel / 10); // assuming that character level is 2 higher than avg quest level
        if (questLevel >= charLevel + 5) {
            return questColors.red as Color;
        }
        if (questLevel >= charLevel + (charLevel < 30 ? 3 : 4)) {
            return questColors.orange as Color;
        }
        if (questLevel <= charLevel + 2 && questLevel >= charLevel - 2) {
            return questColors.yellow as Color;
        }
        const grayCutoff = (charLevel < 5 ? 0 : charLevel - Math.floor(charLevel / 10) - 5);
        if (questLevel <= charLevel - 3 && questLevel > grayCutoff) {
            return questColors.green as Color;
        }
        
        debug(quest.name, "Avg: " + averageLevel, "Quest: " + questLevel, "Char: " + charLevel, grayCutoff);
        return questColors.gray as Color;
    };

    return (
        <SidebarPane type="quest">
            <List disablePadding style={{width: "100%"}}>
                {stepLog && (
                    <ListItem>
                        <ListItemText 
                            className="questlog-header" 
                            primary="Current Quest Log" primaryTypographyProps={{variant: "h5"}}
                            secondary={`${stepLog.length} / 20 quests`} /> 
                    </ListItem>
                )}
                {(sortedZoneKeys).map((zoneName, i) => {
                    const questList = zonedStepLog[zoneName];
                    return (
                        <div className="quest-zone" key={"zone-" + i}>
                            <ListSubheader className="zone-subheader" disableGutters>{zoneName}</ListSubheader>
                            {questList.map((quest) => (
                                <QuestEntry quest={quest} step={step} color={getQuestColor(quest)}  />
                            ))}
                        </div>
                    );
                })}
            </List>
        </SidebarPane>
    );
};

export default QuestLog;
