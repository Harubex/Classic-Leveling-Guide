declare type ClassName = "warrior" | string;

declare interface StepJson {
    step: number;
    text: string;
    macros?: Array<{
        title: string;
        text: string;
        class: ClassName;
    }>,
    special?: ClassName | "hearth";
    note?: string;
    coords: number[];
}

declare interface QuestInfo {
    name: string;
    accepted?: boolean;
    completed?: boolean;
    index?: number;
}

declare type StepQuestInfo = {[stepNum: number]: QuestInfo[]};