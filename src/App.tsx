import { createTheme, ThemeProvider } from "@mui/material/styles";
import Map from "./Map";
import StepPane from "./StepPane";
import CssBaseline from "@mui/material/CssBaseline";
import OptionMenu from "./OptionMenu";
import { SelectedStepContext } from "./context";
import useLocalStorage from "use-local-storage";
import QuestLog from "./components/QuestLog/QuestLog";


const theme = createTheme({
    palette: {
        mode: "dark"
    }
});

type ContextType = [number, React.Dispatch<React.SetStateAction<number | undefined>>];

function App() {
    const [selectedStep, setSelectedStep] = useLocalStorage("selectedStep", 1);
    const [hideQuestLog, setHideQuestLog] = useLocalStorage("hideQuestLog", false);
    const [sidebarPosition, setSidebarPosition] = useLocalStorage("sidebarPosition", "right");
    const ctx = [...[selectedStep, setSelectedStep, 
        hideQuestLog, setHideQuestLog, 
        sidebarPosition, setSidebarPosition]] as ContextType;
    return (
        <ThemeProvider theme={theme}>
            <SelectedStepContext.Provider value={ctx}>
                <OptionMenu />
                {sidebarPosition === "left" ? <StepPane /> : (
                    <>            
                        {!hideQuestLog && <QuestLog step={selectedStep} />}
                    </>
                )}
                <Map />
                {sidebarPosition === "right" ? <StepPane /> : (
                    <>            
                        {!hideQuestLog && <QuestLog step={selectedStep} />}
                    </>
                )}
            </SelectedStepContext.Provider>
            <CssBaseline enableColorScheme />
        </ThemeProvider>
    );
}

export default App;
