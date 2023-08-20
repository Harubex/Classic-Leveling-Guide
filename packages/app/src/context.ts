import { Dispatch, SetStateAction, createContext } from "react";

// UHHHHH
// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
export const SelectedStepContext = createContext<[number, Dispatch<SetStateAction<number | undefined>>]>([] as any);
