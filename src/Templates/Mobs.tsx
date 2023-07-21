import { TemplateProps } from ".";
import useWowheadSearch from "./useWowheadSearch";
import { useState } from "react";
import { Link } from "@mui/material";
import { singular } from "pluralize";


const exclusionList = ["Guard Thomas"];

export const Mobs: React.FC<TemplateProps> = (props) => {
    const [npcId, setNpcId] = useState(0);
    const singularName = !exclusionList.find((name) => name === props.children) ? singular(props.children) : props.children;
    const npcResult = useWowheadSearch(singularName, "npc");
    if (npcResult && npcId !== npcResult.id) {
        setNpcId(npcResult.id);
    }
    return (
        <Link color="lightblue" underline="hover" key={npcId} href={`https://www.wowhead.com/classic/npc=${npcId}`} target="_blank">
            {props.children}
        </Link>
    );
}

export default Mobs;