import useLocalStorage from "use-local-storage";
import { ViewportListRef } from "react-viewport-list";
import { CRS, LatLng, LatLngExpression } from "leaflet";
import { MapContainer, TileLayer, useMap } from "react-leaflet";

import useJson from "../../jsonRefs";
import { MapEvents, MapLines, MapMarker } from ".";
import useStepSelected from "../../useStepSelected";
import DangerZone from "../DangerZone";
import { convertCoords, isDevelopment } from "../../textUtils";

interface MapProps {
    stepListRef: React.RefObject<ViewportListRef>;
}

export const Map: React.FC<MapProps> = (props) => {
    const stepJson = useJson("step");
    const dangerJson = useJson("danger");
    const [center] = useLocalStorage<LatLngExpression>("currentMapCenter", [-485.125, 563.03125]);
    const [displayAllSteps] = useLocalStorage<boolean>("displayAllSteps", false);
    const [selectedStep] = useStepSelected();
    const [showLines] = useLocalStorage<boolean>("showLines", true);

    const onMarkerClick = (stepNum: number) => {
        props.stepListRef.current?.scrollToIndex({
            index: stepNum - 1
        });
    };
    
    // Container props are immutable (except children), pass shit to MapEvents for eventing.
    return (
        <MapContainer id="main-map" crs={CRS.Simple} center={center} zoom={5} scrollWheelZoom={true} zoomSnap={0} zoomDelta={0.25} minZoom={2} maxZoom={5}>
            {isDevelopment() && <Debug />}
            <MapEvents center={center} />
            <TileLayer
                url="https://minecraft-map69.s3.us-east-2.amazonaws.com/tiles/azeroth_{z}_{y}_{x}.png"
                tileSize={500}
            />
            {stepJson.map((ele, i) => {
                const coords = convertCoords(ele.coords);
                const nextCoords = stepJson.length - i > 1 ? convertCoords(stepJson[i + 1].coords) : coords.slice(coords.length - 2);
                const hearth = ele.special === "hearth";
                const flight = ele.special === "flight";
                const prevHearth = stepJson[i - 1] ? stepJson[i - 1].special === "hearth" : false;
                const prevFlight = stepJson[i - 1] ? stepJson[i - 1].special === "flight" : false;
                const renderStep = displayAllSteps ? true : ele.step - selectedStep <= 10;
                    
                return renderStep && ele.step >= selectedStep && (
                    <div key={`marker-${i}`}>
                        <MapMarker onClick={onMarkerClick} hearth={prevHearth || hearth} flight={prevFlight || flight} step={ele.step} position={coords[0]} />
                        {(stepJson[i + 1] && showLines && !hearth) && (
                            <MapLines special={ele.special} coords={coords} nextCoords={nextCoords} />
                        )}
                        {!displayAllSteps && ele.step - selectedStep === 10 && (
                            <MapMarker onClick={onMarkerClick} hearth={prevHearth || hearth} flight={prevFlight || flight} step={ele.step + 1} position={nextCoords[0]} />
                        )}
                    </div>
                );
            })}
            {dangerJson.map((ele, i) => (
                <DangerZone key={i} coords={convertCoords(ele.coords)} tooltip={ele.tooltip} />
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