import { CRS, LatLng, LatLngExpression } from "leaflet";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import MapMarker from "./MapMarker";
import useLocalStorage from "use-local-storage";
import useJson from "./jsonRefs";
import MapLines from "./MapLines";
import { convertCoords } from "./textUtils";
import DangerZone from "./components/DangerZone";
import { ViewportListRef } from "react-viewport-list";
import useStepSelected from "./useStepSelected";

interface MapProps {
    stepListRef: React.RefObject<ViewportListRef>;
}

export const Map: React.FC<MapProps> = (props) => {
    const stepJson = useJson("step");
    const dangerJson = useJson("danger");
    const [center] = useLocalStorage<number[]>("currentMapCenter", [-485.125, 563.03125]);
    const [selectedStep] = useStepSelected();
    const [showLines] = useLocalStorage<boolean>("showLines", true);

    const onMarkerClick = (stepNum: number) => {
        props.stepListRef.current?.scrollToIndex({
            index: stepNum - 1
        });
    };

    return (
        <MapContainer id="main-map" crs={CRS.Simple} center={center as LatLngExpression} zoom={5} scrollWheelZoom={true} zoomSnap={0} zoomDelta={0.25} minZoom={2} maxZoom={5}>
                {import.meta.env.MODE === "development" && <Debug />}
                <TileLayer
                    url="https://minecraft-map69.s3.us-east-2.amazonaws.com/tiles/azeroth_{z}_{y}_{x}.png"
                    tileSize={500}
                />
                {stepJson.map((ele, i) => {
                    const coords = convertCoords(ele.coords);
                    const hearth = ele.special === "hearth";
                    const prevHearth = stepJson[i - 1] ? stepJson[i - 1].special === "hearth" : false;
                    
                    return ele.step >= selectedStep && (
                        <div key={`marker-${i}`}>
                            <MapMarker onClick={onMarkerClick} hearth={prevHearth || hearth} step={ele.step} position={coords[0]} />
                            {(stepJson[i + 1] && showLines && !hearth) && (
                                <MapLines special={ele.special} coords={coords} nextCoords={convertCoords(stepJson[i + 1].coords)} />
                            )}
                        </div>
                    );
                })}
                {dangerJson.map((ele, i) => (
                    <DangerZone key={i} coords={convertCoords(ele.coords)} tooltip={(ele as any).tooltip} />
                ))}
            </MapContainer>
    );
};

let lastCoords: LatLng = new LatLng(0, 0);

const Debug = () => {
    const map = useMap();
    
    map.addEventListener("click", (ev) => {
        if (!ev.latlng.equals(lastCoords)) {
            const coordString = `${ev.latlng.lat.toPrecision(5)}, ${ev.latlng.lng.toPrecision(5)}`;
            console.info(coordString);
            void navigator.clipboard.writeText(coordString);
            lastCoords = ev.latlng;
        }
    });
    return (<></>);
};

export default Map;