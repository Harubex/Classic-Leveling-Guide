import { Link, TemplateProps } from "../Link";

interface QuestProps extends TemplateProps {
    color?: Color;
}

export const Quests: React.FC<QuestProps> = ({ id, children, color }) => {
    return (
        <Link id={id} color={color ? color : "#d8eb17"} type="quest">
            {children}
        </Link>
    );
};

export default Quests;