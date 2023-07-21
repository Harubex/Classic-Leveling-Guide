import json from "../../steps/1-10.json";
import { useQuestSteps } from "./QuestLog.hooks";

export const QuestLog: React.FC = () => {
    const questInfo = useQuestSteps(json as StepJson[]);
    return (
        <div>
            test
        </div>
    );
};

export default QuestLog;
