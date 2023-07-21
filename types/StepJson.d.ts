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