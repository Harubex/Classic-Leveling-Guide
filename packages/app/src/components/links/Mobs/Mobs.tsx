import { Link, TemplateProps } from "../Link";

export const Mobs: React.FC<TemplateProps> = ({ id, children }) => {
    return (
        <Link id={id} color="#ADD8E6" type="npc">
            {children}
        </Link>
    );
};

export default Mobs;