/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useState } from "react";
import List from "@mui/material/List";
import Stack from "@mui/material/Stack";
import ListItem from "@mui/material/ListItem";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import ListItemText from "@mui/material/ListItemText";
import { ViewportList } from "react-viewport-list";

import Macro from "./Macro";
import Quests from "./Templates/Quests";
import Mobs from "./Templates/Mobs";
import Moves from "./Templates/Moves";
import Money from "./Templates/Money";
import Step from "./Templates/Step";
import Items from "./Templates/Items";
import { useContext } from "react";
import { SelectedStepContext } from "./context";
import useLocalStorage from "use-local-storage";
import Skills from "./Templates/Skills";

interface StepData {
    step: number;
    text: string;
    note?: string;
    macros?: Array<{
        title: string;
        text: string;
    }>,
    coords?: number[]
}

interface StepListProps {
    steps: StepData[];
    viewportRef: React.MutableRefObject<null>
}

const buildStep = ({step, text}: StepData, includeNumber = true): React.ReactNode[] => {
    let chunks: React.ReactNode[] = [];
    let lastMatchIndex = 0;
    for (const match of text.matchAll(/\[@(quest|mob|money|move|skill|item)=([\w\s'!\-,":]+)\]/gi)) {
        const [matchedText, templateType, templateText] = match;
        const matchIndex = match.index!;
        chunks.push(text.substring(lastMatchIndex, matchIndex));
        switch (templateType) {
            case "quest":
                chunks.push(<Quests name={templateText} />);
                break;
            case "mob":
                chunks.push(<Mobs>{templateText}</Mobs>);
                break;
            case "move":
                chunks.push(<Moves>{templateText}</Moves>);
                break;
            case "money":
                chunks.push(<Money>{templateText}</Money>);
                break;
            case "skill":
                chunks.push(<Skills>{templateText}</Skills>);
                break;
            case "item":
                chunks.push(<Items>{templateText}</Items>);
                break;
        }
        lastMatchIndex = matchIndex + matchedText.length;
    }
    chunks.push(text.substring(lastMatchIndex));
    if (chunks.length === 0) {
        return [text];
    }
    if (includeNumber) {
        chunks = [<Step number={step} />, ...chunks];
    }
    return chunks;
};

const isElementInViewport = (el: HTMLElement) => {
    const rect = el.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
};

export const StepList: React.FC<StepListProps> = (props: StepListProps) => {
    const [selectedStep, setSelectedStep] = useContext(SelectedStepContext);
    const [center, setCenter] = useLocalStorage<number[]>("currentMapCenter", [-485.125, 563.03125]);
    const onStepSelected = (stepNum: number) => {
        return () => {
            setSelectedStep(stepNum);
            setCenter(props.steps[stepNum - 1].coords);
        };
    };

    const viewportChanged = ([firstIndex, lastIndex]: [number, number]) => {
        setSelectedStep(firstIndex + 2);
    };

    const renderRow = (step: StepData) => {
        return (
            <ListItem key={`${step.step}-item`} disableGutters>
                <Stack justifyContent="center">
                    <Button className="step-button" onClick={onStepSelected(step.step)}>
                        <ListItemText primary={buildStep(step).map((stepChunks, i) => (
                            <React.Fragment key={`chunk-${step.step}-${i}`}>
                                {stepChunks}
                            </React.Fragment>
                        ))} />
                    </Button>
                    {step.macros && (
                        <ButtonGroup style={{justifyContent: "center", marginTop: "0.5em"}}>
                            {step.macros.map((macro) => (
                                <Macro key={macro.title} name={macro.title}>{macro.text}</Macro>
                            ))}
                        </ButtonGroup>
                    )}
                </Stack>
            </ListItem>    
        );
    };


    return (
        <List>
            <ViewportList
                ref={props.viewportRef}
                items={props.steps}
                initialIndex={selectedStep}
                onViewportIndexesChange={viewportChanged}
            >
                {renderRow}
            </ViewportList>
        </List>
    );
};

export default StepList;