import { Link, TemplateProps } from "../Link";

export const Items: React.FC<TemplateProps> = ({ id, children }) => {
    return (
        <Link id={id} color="#c38dd9" type="item">
            {children}
        </Link>
    );
};

export default Items;