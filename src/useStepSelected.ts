import { useState } from "react";

export const useStepSelected = (stepNumber?: number): [number, React.Dispatch<React.SetStateAction<number>>] => {
    const [selectedStep, setSelectedStep] = useState<number>(1);
    if (stepNumber) {
        setSelectedStep(stepNumber);
    }
    return [selectedStep, setSelectedStep];
};

export default useStepSelected;
