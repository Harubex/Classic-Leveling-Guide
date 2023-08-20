import { useEffect, useState } from "react";

type JsonDataType = "danger" | "step";

export const useJson = (type: JsonDataType = "step") => {
    const [jsonData, setJsonData] = useState<StepData[]>([]);
    useEffect(() => {
        // this needs to be done without a map bc of vite's code-splitting requiring static analysis of imports
        switch (type) {
            case "step":
                import("@shared/steps-cmp.json").then((data) => {
                    setJsonData(data.default as StepData[]);
                });
                break;
            case "danger":
                import("@shared/dangerzone.json").then((data) => {
                    setJsonData(data.default as any); // fix type here i guess
                });
                break;
        }
    }, [type]);
    return jsonData;
}

export default useJson;
