import { LatLngExpression } from "leaflet";
import { Polyline } from "react-leaflet";
interface MapLinesProps {
    special?: string;
    coords: LatLngExpression[];
    nextCoords: LatLngExpression[];
}

export const MapLines: React.FC<MapLinesProps> = (props) => {

    
    const flight = props.special === "flight";

    return (
        <Polyline color={flight ? "#ee552244" : "#00000044"} lineCap="round" positions={props.coords.concat(props.nextCoords)} />
    );
}

export default MapLines;