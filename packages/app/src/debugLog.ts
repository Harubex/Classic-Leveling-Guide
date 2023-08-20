/**
 * Logs to the browser console when developing this app locally.
 * @param data The stuff to print out.
 */
export const debug = (...data: any[]) => {
    if (import.meta.env.MODE === "development") {
        console.log(data);
    }
};

export default debug;