import type { LatLngExpression } from "leaflet";
import { Polyline } from "react-leaflet";
interface MapLinesProps {
    special?: string;
    coords: LatLngExpression[];
    nextCoords: LatLngExpression[];
}

const lineColors: { [type: string]: Color } = {
    default: "#000000",
    flight: "#ee5522"
};

export const MapLines: React.FC<MapLinesProps> = ({ special, coords, nextCoords }) => {
    const merged = coords.concat(nextCoords);

    return (
        <Polyline color={lineColors[special!]} opacity={0.4} lineCap="round" positions={merged} />
    );
};

MapLines.defaultProps = {
    special: "default"
};

export default MapLines;