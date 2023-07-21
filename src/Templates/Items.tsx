import { Link } from "@mui/material";
import { TemplateProps } from ".";
import useWowheadSearch from "./useWowheadSearch";
import { useState } from "react";
import { singular } from "pluralize";

const exclusionList = ["Beer Basted Boar Ribs"];

export const Items: React.FC<TemplateProps> = (props) => {
    const [itemId, setItemId] = useState(0);
    const singularName = !exclusionList.find((name) => name === props.children) ? singular(props.children) : props.children;
    const itemResult = useWowheadSearch(singularName, "item");
    if (itemResult && itemId !== itemResult.id) {
        setItemId(itemResult.id);
    }
    return (
        <Link color="#c38dd9" underline="hover" key={itemId} href={`https://www.wowhead.com/classic/item=${itemId}`} target="_blank">
            {props.children}
        </Link>
    );
}

export default Items;