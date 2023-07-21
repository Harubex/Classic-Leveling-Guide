/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useContext, useEffect } from "react";
import { Icon, DivIcon, LatLngExpression, LeafletMouseEventHandlerFn } from "leaflet";
import { Marker, useMap } from "react-leaflet";
import icons from "./icons";
import { SelectedStepContext } from "./context";

interface MapMarkerCommon {
    position: LatLngExpression;
    hearth: boolean;
}
interface WithStep extends MapMarkerCommon {
    step?: number; 
}
interface WithIcon extends MapMarkerCommon {
    icon?: Icon | DivIcon;
}

type MapMarkerProps = WithStep & WithIcon; // ?????????????? who cares


export const MapMarker: React.FC<MapMarkerProps> = (props: MapMarkerProps) => {
    const [selectedStep, setSelectedStep] = useContext(SelectedStepContext);
    const map = useMap();

    useEffect(() => {
        if (selectedStep === props.step) {
            map.flyTo(props.position);
        }
    }, [selectedStep]);

    const click: LeafletMouseEventHandlerFn = (ev) => {
        map.flyTo(props.position);
        setSelectedStep(props.step);
    };

    const icon = typeof props.step === "number" ? icons.number(props.step) : props.icon;

    if (props.hearth) {
        icon!.options.className = (icon?.options.className || "") + " hearth-icon"
    }

    return (
        <div>
            <Marker icon={icon} position={props.position} riseOnHover eventHandlers={{ click }} />
        </div>
    );
};

export default MapMarker;