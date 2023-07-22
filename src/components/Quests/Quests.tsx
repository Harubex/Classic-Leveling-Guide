import { useState } from "react";
import useWowheadSearch from "../../Templates/useWowheadSearch";
import { Link } from "@mui/material";

export interface Props {
    name: string;
}

export const Quests: React.FC<Props> = (props) => {
    const [questId, setQuestId] = useState(0);
    const questResult = useWowheadSearch(props.name, "quest");
    if (questResult && questId !== questResult.id) {
        setQuestId(questResult.id);
    }
    return (
        <Link color="#d8eb17" underline="hover" key={questId} href={`https://www.wowhead.com/classic/quest=${questId}`} target="_blank">
            {props.name}
        </Link>
    );
}

export default Quests;