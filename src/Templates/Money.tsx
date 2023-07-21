import replace from "react-string-replace";
import { TemplateProps } from ".";

export const Money: React.FC<TemplateProps> = (props) => {
    const coins: Record<string, string> = {
        "c": "https://minecraft-map69.s3.us-east-2.amazonaws.com/ui-coppericon.png",
        "s": "https://minecraft-map69.s3.us-east-2.amazonaws.com/ui-silvericon.png",
        "g": "https://minecraft-map69.s3.us-east-2.amazonaws.com/ui-goldicon.png",
    }
    const coinReplace = (match: string) => (
        <img key={match} src={coins[match]} style={{display: "inline", position: "relative", top: 2, left: 1}} />
    );
    return (
        <div key={props.children} style={{display: "inline"}}>
            {replace(props.children, /([c|s|g]+)/gi, coinReplace)}
        </div>
    );
}

export default Money;