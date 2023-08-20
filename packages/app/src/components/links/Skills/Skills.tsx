import { Link, TemplateProps } from "../Link";

export const Skills: React.FC<TemplateProps> = ({ id, children }) => {
    return (
        <Link id={id} color="#9de3a6" type="skill">
            {children}
        </Link>
    );
};

export default Skills;