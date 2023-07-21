import { Link } from "@mui/material";
import { TemplateProps } from ".";
import useWowheadSearch from "./useWowheadSearch";
import { useState } from "react";

export const Moves: React.FC<TemplateProps> = (props) => {
    const [spellId, setSpellId] = useState(0);
    const spellResult = useWowheadSearch(props.children, "spell");
    if (spellResult && spellId !== spellResult.id) {
        setSpellId(spellResult.id);
    }
    return (
        <Link color="#fcd362" underline="hover" key={spellId} href={`https://www.wowhead.com/classic/spell=${spellId}`} target="_blank">
            {props.children}
        </Link>
    );
}

export default Moves;