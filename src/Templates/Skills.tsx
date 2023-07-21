import { Link } from "@mui/material";
import { TemplateProps } from ".";
import useWowheadSearch from "./useWowheadSearch";
import { useState } from "react";

export const Skills: React.FC<TemplateProps> = (props) => {
    const [skillId, setSkillId] = useState(0);
    const spellResult = useWowheadSearch(props.children, "skill");
    if (spellResult && skillId !== spellResult.id) {
        setSkillId(spellResult.id);
    }
    return (
        <Link color="#9de3a6" underline="hover" key={skillId} href={`https://www.wowhead.com/classic/skill=${skillId}`} target="_blank">
            {props.children}
        </Link>
    );
}

export default Skills;