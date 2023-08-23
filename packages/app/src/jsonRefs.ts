import { useEffect, useState } from "react";

type JsonDataType = "danger" | "step";


export function useJson(): StepData[];
export function useJson(type: "step"): StepData[];
export function useJson(type: "danger"): DangerData[];
export function useJson (type: JsonDataType = "step") {
    const [jsonData, setJsonData] = useState<object[]>([]);
    useEffect(() => {
        // this needs to be done without a map bc of vite's code-splitting requiring static analysis of imports
        switch (type) {
            case "step":
                void import("@shared/steps-cmp.json").then((data) => {
                    setJsonData(data.default as StepData[]);
                });
                break;
            case "danger":
                void import("@shared/dangerzone.json").then((data) => {
                    setJsonData(data.default as DangerData[]); // fix type here i guess
                });
                break;
        }
    }, [type]);
    return jsonData;
}

export default useJson;
