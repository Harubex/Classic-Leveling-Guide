import { ListItem, ListItemText } from "@mui/material";
import QuestIcon from "./QuestIcon";
import { Quests } from "../links";
import clsx from "clsx";
import { isDevelopment } from "../../textUtils";

interface QuestEntryProps {
    step: number;
    quest: SteppedQuestInfo;
    color: Color;
}

export type SteppedQuestInfo = QuestInfo & { step: number };

export const QuestEntry: React.FC<QuestEntryProps> = ({ quest, step, color }) => {

    const getQuestClasses = (quest: SteppedQuestInfo) => {
        return clsx({"quest-no-icon": !quest.completed && !(quest.accepted && quest.step === step)});
    };

    const onQuestClick: React.MouseEventHandler<HTMLDivElement> = (ev) => {
        if (isDevelopment() && ev.getModifierState("Control")) {
            void navigator.clipboard.writeText(`${quest.name}#${quest.id}`);
            ev.preventDefault();
        }
    };

    return (
        <ListItem key={quest.id} className="quest-entry step-pane-list" disablePadding>
            {(quest.accepted && quest.step === step) && (<QuestIcon type="accept" />)}
            {quest.completed && <QuestIcon type="turnin" />}
            <div className={getQuestClasses(quest)}>
                <ListItemText onClick={onQuestClick} primary={
                    <Quests id={quest.id} color={color}>{
                        (quest.level ? `[${quest.level}] ` : "") + quest.name
                    }</Quests>
                } />
            </div>
        </ListItem>
    );
};

export default QuestEntry;