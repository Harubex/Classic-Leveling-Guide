import MuiLink from "@mui/material/Link";

export interface TemplateProps {
    id?: number;
    children: string;
}

export interface LinkProps extends TemplateProps {
    color: Color;
    type: string
}

export const Link: React.FC<LinkProps> = ({ id, children, color, type }) => {
    return (
        <MuiLink 
            key={id}
            underline="hover"
            href={`https://www.wowhead.com/classic/${type}=${id}`}
            target="_blank"
        >
            <div style={{ color, display: "inline" }}>
                {children}
            </div>
        </MuiLink>
    )
};

Link.defaultProps = {
    id: 0
};

export default Link;