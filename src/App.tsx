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
    const ctx = [...[selectedStep, setSelectedStep]] as ContextType;
    return (
        <ThemeProvider theme={theme}>
            <SelectedStepContext.Provider value={ctx}>
                <OptionMenu />
                <QuestLog />
                <Map />
                <StepPane />
            </SelectedStepContext.Provider>
            <CssBaseline enableColorScheme />
        </ThemeProvider>
    );
}

export default App;
