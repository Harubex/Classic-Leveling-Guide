import React from "react";

import useJson from "./jsonRefs";
import StepList from "./StepList";
import SidebarPane from "./components/SidebarPane";
import { ViewportListRef } from "react-viewport-list";
import useStepSelected from "./useStepSelected";

interface StepPaneProps {
    viewportRef: React.RefObject<ViewportListRef>;
}

export const StepPane: React.FC<StepPaneProps> = ({ viewportRef }) => {
    const json = useJson();
    const [selectedStep, setSelectedStep] = useStepSelected();

    const onWheel = (ev: React.WheelEvent<HTMLElement>) => {
        // scroll up/down should move guide pane 1 step up and down
        if (!viewportRef.current) {
            return;
        }
        let nextStep = selectedStep;
        if (ev.deltaY > 0) {
            nextStep++;
        } else if (ev.deltaY < 0) {
            nextStep--;
        }
        setSelectedStep(nextStep);
        viewportRef.current.scrollToIndex({
            index: nextStep - 1,
            alignToTop: true,
            prerender: 10,
            delay: 200 // this can be messed with, 0 causes no snapping to occur
        });
    };
    return (
        <SidebarPane type="step" onWheel={onWheel}>
            <StepList viewportRef={viewportRef} steps={json} />
        </SidebarPane>
    );
};

export default StepPane;