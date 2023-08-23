import ReactDOM from "react-dom/server";
import { divIcon } from "leaflet";

export const icons = {
    number: (num: number) => {
        const right = (num.toString().length - 1) * 5;
        return divIcon({
            html: ReactDOM.renderToString(<div className="number-icon" style={{right}}>{num}</div>)
        });
    }
};

export default icons;