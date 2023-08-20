/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from "react";
import List from "@mui/material/List";
import Stack from "@mui/material/Stack";
import ListItem from "@mui/material/ListItem";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import ListItemText from "@mui/material/ListItemText";
import { ViewportList, ViewportListRef } from "react-viewport-list";
import useJson from "./jsonRefs";
import Macro from "./Macro";
import useLocalStorage from "use-local-storage";
import { convertCoords, transposeTextEntities } from "./textUtils";
import { Step } from "./components/links";
import { LatLngExpression } from "leaflet";
import useStepSelected from "./useStepSelected";

interface StepData {
    step: number;
    text: string;
    note?: string;
    macros?: Array<{
        title: string;
        text: string;
    }>,
    coords?: number[] | number[][];
}

interface StepListProps {
    steps: StepData[];
    viewportRef: React.RefObject<ViewportListRef>
}

const buildStep = ({step, text}: StepData, includeNumber = true): React.ReactNode[] => {
    let chunks = transposeTextEntities(text);
    if (includeNumber) {
        chunks = [<Step number={step} />, ...chunks];
    }
    return chunks;
};

export const StepList: React.FC<StepListProps> = (props: StepListProps) => {
    const json = useJson();
    const [selectedStep, setSelectedStep] = useStepSelected();
    
    
    const [_, setCenter] = useLocalStorage<LatLngExpression>("currentMapCenter", [-485.125, 563.03125]);

    const onStepSelected = (stepNum: number) => {
        return () => {
            props.viewportRef.current?.scrollToIndex({
                index: stepNum - 1
            });
            const currStep = props.steps[stepNum - 1];
            if (currStep.coords) {
                setCenter(convertCoords(currStep.coords)[0]);
            }
            setSelectedStep(stepNum);
        };
    };

    const renderListRow = (stepData: StepData) => {
        return (
            <StepListRow key={stepData.step} step={stepData} onStepSelected={onStepSelected} />
        );
    }
    
    return (
        <List>
            <ViewportList ref={props.viewportRef} items={json} initialIndex={selectedStep - 1}>
                {renderListRow}
            </ViewportList>
        </List>
    );
};

interface StepListRowProps {
    step: StepData;
    onStepSelected: (stepNum: number) => () => void;
}

const StepListRow: React.FC<StepListRowProps> = ({ step, onStepSelected }) => {
   /* const [{ data, loading, error }] = useAxios<StepData>(`http://127.0.0.1:6969/step/${stepNum-5}/${stepNum+5}`);
    if (error) {
        console.error(error);
        return <div>{JSON.stringify(error)}</div>;
    }
    if (loading) {
        return <div>loading</div>
    }
    if (!data) {
        return <div>no data</div>
    }*/
    return (
        <ListItem key={`${step.step}-item`} disableGutters>
            <Stack justifyContent="center" width="100%">
                <Button className="step-button" onClick={onStepSelected(step.step)}>
                    <ListItemText primary={buildStep(step).map((stepChunks, i) => (
                        <React.Fragment key={`chunk-${step.step}-${i}`}>
                            {stepChunks}
                        </React.Fragment>
                    ))} />
                </Button>
                {step!.macros && (
                    <ButtonGroup style={{justifyContent: "center", marginTop: "0.5em"}}>
                        {step!.macros.map((macro) => (
                            <Macro key={macro.title} name={macro.title}>{macro.text}</Macro>
                        ))}
                    </ButtonGroup>
                )}
            </Stack>
        </ListItem>
    );
};



export default StepList;