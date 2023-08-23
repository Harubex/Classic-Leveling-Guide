import { lazy, useRef } from "react";
import createTheme from "@mui/material/styles/createTheme";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import StepPane from "./StepPane";
import CssBaseline from "@mui/material/CssBaseline";
import OptionMenu from "./OptionMenu";
import { SelectedStepContext } from "./context";
import useLocalStorage from "use-local-storage";
import QuestLog from "./components/QuestLog/QuestLog";
import { ViewportListRef } from "react-viewport-list";

const Map = lazy(() => import("./components/Map"));

const theme = createTheme({
    palette: {
        mode: "dark"
    }
});

type ContextType = [number, React.Dispatch<React.SetStateAction<number | undefined>>];

export const App: React.FC = () => {
    const [selectedStep, setSelectedStep] = useLocalStorage("selectedStep", 1);
    const [hideQuestLog, setHideQuestLog] = useLocalStorage("hideQuestLog", false);
    const [sidebarPosition, setSidebarPosition] = useLocalStorage("sidebarPosition", "right");
    const stepListRef = useRef<ViewportListRef>(null);
    const ctx = [
        ...[selectedStep, setSelectedStep, hideQuestLog, setHideQuestLog, sidebarPosition, setSidebarPosition]
    ] as ContextType;
    return (
        <ThemeProvider theme={theme}>
            <SelectedStepContext.Provider value={ctx}>
                <OptionMenu />
                {sidebarPosition === "left" ? <StepPane viewportRef={stepListRef} /> : (
                    <>            
                        {!hideQuestLog && <QuestLog step={selectedStep} />}
                    </>
                )}
                <Map stepListRef={stepListRef} />
                {sidebarPosition === "right" ? <StepPane viewportRef={stepListRef} /> : (
                    <>            
                        {!hideQuestLog && <QuestLog step={selectedStep} />}
                    </>
                )}
            </SelectedStepContext.Provider>
            <CssBaseline enableColorScheme />
        </ThemeProvider>
    );
};

export default App;
