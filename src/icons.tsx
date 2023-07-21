import ReactDOM from "react-dom/server";
import { icon, divIcon } from "leaflet";


export const icons = {
    number: (num: number) => {
        const right = (num.toString().length - 1) * 5;
        return divIcon({
            html: ReactDOM.renderToString(<div className="number-icon" style={{right}}>{num}</div>)
        });
    },
    accept: icon({
        iconUrl: "https://minecraft-map69.s3.us-east-2.amazonaws.com/quest_accept.png",
        iconSize: [10, 28],
        iconAnchor: [4.5, 14]
    }),
    turnin: icon({
        iconUrl: "https://minecraft-map69.s3.us-east-2.amazonaws.com/quest_turnin.png",
        iconSize: [15, 26],
        iconAnchor: [7, 13]
    }),
    hearth: icon({
        iconUrl: "https://minecraft-map69.s3.us-east-2.amazonaws.com/hearth.png",
        iconSize: [21, 24],
        iconAnchor: [11, 12]
    })
};

export default icons;