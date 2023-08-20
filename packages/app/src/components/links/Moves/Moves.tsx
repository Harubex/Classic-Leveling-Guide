import { Link, TemplateProps } from "../Link";

export const Moves: React.FC<TemplateProps> = ({ id, children }) => {
    return (
        <Link id={id} color="#fcd362" type="spell">
            {children}
        </Link>
    );
};

export default Moves;