declare type ClassName = "warrior" | string;

declare interface StepData {
    step: number;
    text: string;
    macros?: Array<{
        title: string;
        text: string;
        class?: ClassName;
    }>,
    special?: ClassName | "hearth";
    note?: string;
    coords: number[] | number[][];
    metadata?: {[type: string]: {[id: number]: string}};
}

declare interface QuestInfo {
    id: number;
    name: string;
    accepted?: boolean;
    completed?: boolean;
    index?: number;
    zone?: string;
    level?: string;
}

declare type StepQuestInfo = {[stepNum: number]: QuestInfo[]};
