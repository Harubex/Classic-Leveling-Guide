import React, { useRef } from "react";

import { Paper } from "@mui/material";
import useLocalStorage from "use-local-storage";
import clsx from "clsx";


interface SidebarPaneProps {
    type: "step" | "quest";
    children: React.ReactNode;
}

export const SidebarPane: React.FC<SidebarPaneProps> = (props) => {
    const [sidebarPosition] = useLocalStorage<string>("sidebarPosition", "right");
    const ref = useRef(null);
    const classes = clsx("step-pane", {"left": props.type === "step" && sidebarPosition === "left"});

    return (
        <Paper className={classes}>
            <div className="step-pane-inner" ref={ref}>
                {props.children}
            </div>
        </Paper>
    );
};

export default SidebarPane;