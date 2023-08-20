import { useContext } from "react";
import useJson from "./jsonRefs";
import { SelectedStepContext } from "./context";

export const useStepSelected = (): [number, React.Dispatch<React.SetStateAction<number>>] => {
    const [selectedStep, setSelectedStep] = useContext(SelectedStepContext);
    const json = useJson();
    const setFn = (value: React.SetStateAction<number>) => {
        let step = Number(value.valueOf());
        if (step < 1) {
            step = 1;
        } else if (step >= json.length) {
            step = json.length;
        }
        setSelectedStep(step);
    }
    return [selectedStep, setFn];
};

export default useStepSelected;
