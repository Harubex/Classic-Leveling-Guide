import { CRS, LatLng, LatLngExpression } from "leaflet";
import { MapContainer, Polyline, TileLayer, useMap } from "react-leaflet";
import MapMarker from "./MapMarker";
import useLocalStorage from "use-local-storage";
import json from "./steps/1-10.json";
import { CSSProperties, useContext, useState } from "react";
import { SelectedStepContext } from "./context";

export const Map = () => {
    //extend(CRS.Simple, )
    const [center] = useLocalStorage<number[]>("currentMapCenter", [-485.125, 563.03125]);
    const [showLines] = useLocalStorage<boolean>("showLines", true);
    const [selectedStep] = useContext(SelectedStepContext);



    return (
        <MapContainer id="main-map" crs={CRS.Simple} center={center as LatLngExpression} zoom={5} scrollWheelZoom={true} zoomSnap={0} zoomDelta={0.25} minZoom={2} maxZoom={5}>
                <Debug />
                <TileLayer
                    url="https://minecraft-map69.s3.us-east-2.amazonaws.com/tiles/azeroth_{z}_{y}_{x}.png"
                    tileSize={500}
                />
                {json.map((ele, i) => {
                    const coord = ele.coords as LatLngExpression;
                    const hearth = ele.special === "hearth"; 
                    const prevHearth = json[i - 1] ? json[i - 1].special === "hearth" : false;
                    
                    return ele.step >= selectedStep && (
                        <div key={`marker-${i}`}>
                            <MapMarker hearth={prevHearth || hearth} step={ele.step} position={coord} />
                            {(json[i + 1] && showLines && !hearth) && (
                                <Polyline lineCap="round" positions={[coord, json[i + 1].coords as LatLngExpression]} />
                            )}
                        </div>
                    );
                })}
            </MapContainer>
    );
};

let lastCoords: LatLng = new LatLng(0, 0);

const Debug = () => {
    const map = useMap();
    
    map.addEventListener("click", (ev) => {
        if (!ev.latlng.equals(lastCoords)) {
            const coordString = `${ev.latlng.lat.toPrecision(4)}, ${ev.latlng.lng.toPrecision(4)}`;
            console.info(coordString);
            void navigator.clipboard.writeText(coordString);
            lastCoords = ev.latlng;
        }
    });
    return (<></>);
};

export default Map;