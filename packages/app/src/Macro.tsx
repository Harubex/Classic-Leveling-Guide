import { useState } from "react";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Tooltip from "@mui/material/Tooltip";


export interface Props {
    name: string;
    children: string;
}

export const Macro: React.FC<Props> = (props) => {
    const [open, setOpen] = useState(false);
    const [toastOpen, setToastOpen] = useState(false);

    const highlightLine = (line: string) => {
        const command = /\/[a-z]+\s?/gi;
        //const worn = /worn\:/gi;
        const chunks: React.ReactNode[] = [];
        const showTooltipIndex = line.indexOf("#showtooltip");
        if (showTooltipIndex == 0) {
            chunks.push((<div key={1} style={{ color: "#e0fc56" }}>{line.substring(showTooltipIndex, 12)}</div>));
        }
        const cmdMatches = line.match(command);
        if (cmdMatches && cmdMatches.length > 0) {
            chunks.push((<div key={1} style={{ color: "#86f0f0" }}>{cmdMatches[0]}</div>));
            chunks.push(line.substring(cmdMatches[0].length));
            // come back to this maybe
            /*const wornMatches = line.matchAll(worn);
            if (wornMatches) {
                const = lastIndex
                for (const match of wornMatches) {
                    
                }
                chunks.push([
                    line.substring(cmdMatches[0].length, wornIndex),
                    (<div style={{ color: "#e0fc56" }}>{line.substring(wornIndex, 5)}</div>),
                    line.substring(cmdMatches[0].length + wornIndex + 5)
                ]);
            } else {   
                chunks.push(line.substring(cmdMatches[0].length));
            }*/
        }
        return chunks.length > 0 ? chunks : line;
    }

    const opened = () => setOpen(true);
    const closed = () => setOpen(false);
    const closeToast = () => setToastOpen(false);
    const lines = <ul>{props.children.split("\n").map((line) => <li key={line}>{highlightLine(line)}</li>)}</ul>

    const copyText = () => {
        setToastOpen(true);
        void navigator.clipboard.writeText(props.children);
    };

    return (
        <>
            <Snackbar
                className="copy-toast"
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                open={toastOpen}
                autoHideDuration={1000}
                onClose={closeToast}
                message={"Copied macro to clipboard!"}
                key={props.name}
            />
            <Tooltip open={open} onOpen={opened} onClose={closed} leaveDelay={200} title={lines} 
                    sx={{ fontSize: "1em", fontFamily: "monospace"}} placement="left"
                >
                <Button style={{textTransform: "none"}} color="secondary" variant="outlined" onClick={copyText}>
                    {props.name}
                </Button>
            </Tooltip>
        </>
        
    );
}

export default Macro;
