import { Fab, Fade, Menu, MenuItem, Typography, Switch, ToggleButtonGroup, ToggleButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import { useState, useEffect, CSSProperties } from "react";
import useLocalStorage from "use-local-storage";

const useMousePosition = () => {
    const [mousePos, setMousePos] = useState<number[]>([0, 0]);
    document.onmousemove = (ev) => {
        setMousePos([ev.pageX, ev.pageY]);
    }
    return mousePos;
}

let lastMousePos = [0, 0];
let lastTimeoutId = 0;

export const OptionMenu = () => {
    const [shown, setShown] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [showLines, setShowLines] = useLocalStorage<boolean>("showLines", true);
    const [hideQuestLog, setHideQuestLog] = useLocalStorage("hideQuestLog", false);
    const [sidebarPosition, setSidebarPosition] = useLocalStorage<string>("sidebarPosition", "right");
    const mousePos = useMousePosition();
    useEffect(() => {
        if (lastMousePos[0] !== mousePos[0] && lastMousePos[1] !== mousePos[1]) {
            lastMousePos = mousePos;
            lastTimeoutId = window.setTimeout(() => {
                setShown(false);
                setMenuOpen(false);
            }, 2000);
            setShown(true);
            return () => clearTimeout(lastTimeoutId);
        }
    }, [mousePos]);
    const menuOpened = (ev: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(ev.currentTarget);
        setMenuOpen(true);
    };

    const menuClosed = () => setMenuOpen(false);

    const showLinesChanged = (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        setShowLines(checked);
    }

    const toggleQuestLog = (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        setHideQuestLog(!checked);
    }

    const sidebarPositionChanged = (_: React.MouseEvent<HTMLElement, MouseEvent>, value: "left" | "right") => {
        setSidebarPosition(value);
    };

    const positionStyle = (sidebarPosition === "left" ? { right: "1em" } : { left: "1em" }) as CSSProperties;

    return (
        <>
            <Fade in={shown} timeout={500}> 
                <Fab id="option-menu-button" color="primary" size="small" onClick={menuOpened} style={positionStyle}>
                    <MenuIcon />
                </Fab>
            </Fade>
            <Menu id="option-menu" anchorEl={anchorEl} open={menuOpen} onClose={menuClosed}>
                <MenuItem>
                    <Typography>Show Quest Log</Typography>
                    <Switch color="secondary" checked={!hideQuestLog} onChange={toggleQuestLog} />
                </MenuItem>
                <MenuItem>
                    <Typography>Show Lines</Typography>
                    <Switch color="secondary" checked={showLines} onChange={showLinesChanged} />
                </MenuItem>
                <MenuItem>
                    <Typography>Sidebar Position</Typography>
                    <ToggleButtonGroup color="secondary" size="small" exclusive onChange={sidebarPositionChanged} value={sidebarPosition}>
                        <ToggleButton key={"left"} value={"left"}>
                            <FormatAlignLeftIcon />
                        </ToggleButton>
                        <ToggleButton key={"right"} value={"right"}>
                            <FormatAlignRightIcon />
                        </ToggleButton>
                    </ToggleButtonGroup>
                </MenuItem>
            </Menu>
        </>
    );
};

export default OptionMenu;
