import React, { useRef } from "react";

import steps1to10 from "./steps/1-10.json";
import StepList from "./StepList";
import SidebarPane from "./components/SidebarPane";

export const StepPane: React.FC = () => {
    const ref = useRef(null);

    return (
        <SidebarPane type="step">
            <StepList viewportRef={ref} steps={steps1to10} />
        </SidebarPane>
    );
};

export default StepPane;