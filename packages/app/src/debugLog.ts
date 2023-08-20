export const debug = (...data: any[]) => {
    if (import.meta.env.MODE === "development") {
        console.log(data);
    }
};

export default debug;