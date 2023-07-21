import { useState } from "react";
import { Button, Snackbar, Tooltip } from "@mui/material";

export interface Props {
    name: string;
    children: string;
}

export const Macro: React.FC<Props> = (props) => {
    const [open, setOpen] = useState(false);
    const [toastOpen, setToastOpen] = useState(false);

    const opened = () => setOpen(true);
    const closed = () => setOpen(false);
    const closeToast = () => setToastOpen(false);
    const lines = <ul>{props.children.split("\n").map((line) => <li key={line}>{line}</li>)}</ul>

    const copyText = () => {
        setToastOpen(true);
        void navigator.clipboard.writeText(props.children);
    };

    return (
        <>
            <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                open={toastOpen}
                autoHideDuration={1000}
                onClose={closeToast}
                message={"Copied macro to clipboard!"}
                key={props.name}
            />
            <Tooltip open={open} onOpen={opened} onClose={closed} leaveDelay={200} title={lines}
                sx={{ fontSize: "1em", fontFamily: "monospace"}} placement="left">
                <Button style={{textTransform: "none"}} color="secondary" variant="outlined" onClick={copyText}>
                    {props.name}
                </Button>
            </Tooltip>
        </>
        
    );
}

export default Macro;
