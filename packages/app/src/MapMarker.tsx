/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useEffect } from "react";
import { Icon, DivIcon, LatLngExpression, LeafletMouseEventHandlerFn } from "leaflet";
import { Marker, useMap } from "react-leaflet";
import icons from "./icons";
import useLocalStorage from "use-local-storage";
import useStepSelected from "./useStepSelected";

interface MapMarkerCommon {
    position: LatLngExpression;
    hearth: boolean;
    onClick: (step: number) => void;
}
interface WithStep extends MapMarkerCommon {
    step?: number; 
}
interface WithIcon extends MapMarkerCommon {
    icon?: Icon | DivIcon;
}

type MapMarkerProps = WithStep & WithIcon; // ?????????????? who cares


export const MapMarker: React.FC<MapMarkerProps> = (props: MapMarkerProps) => {
    const [selectedStep, setSelectedStep] = useStepSelected();
    const [autoFlyTo] = useLocalStorage<boolean>("autoFlyTo", true);
    const map = useMap();

    useEffect(() => {
        if (selectedStep === props.step && autoFlyTo) {
            map.flyTo(props.position);
        }
    }, [selectedStep]);

    const click: LeafletMouseEventHandlerFn = (_) => {
        props.onClick(props.step!);
        if (autoFlyTo) {
            map.flyTo(props.position);
        }
        setSelectedStep(props.step!);
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