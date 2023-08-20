import React, { useRef } from "react";

import Paper from "@mui/material/Paper";
import useLocalStorage from "use-local-storage";
import clsx from "clsx";


interface SidebarPaneProps {
    type: "step" | "quest";
    onWheel?: React.WheelEventHandler<HTMLElement>
    children: React.ReactNode;
}

export const SidebarPane: React.FC<SidebarPaneProps> = (props) => {
    const [sidebarPosition] = useLocalStorage<string>("sidebarPosition", "right");
   
    const ref = useRef(null);
    const classes = clsx("step-pane", {
        "left": (
            props.type === "step" && sidebarPosition === "left"
        ) || (
            props.type === "quest" && sidebarPosition === "right"
        ),
        [props.type]: true
    });

    const onScroll: React.UIEventHandler<HTMLElement> = (_) => {
        
        return !props.onWheel;
    };

    return (
        <Paper className={classes} component="section" onWheel={onScroll} onWheelCapture={props.onWheel} onScroll={onScroll} onScrollCapture={onScroll}>
            <div className="step-pane-inner" ref={ref as any}>
                {props.children}
            </div>
        </Paper>
    );
};

export default SidebarPane;