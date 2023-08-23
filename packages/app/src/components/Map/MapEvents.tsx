import type { LatLngExpression } from "leaflet";
import React, { useEffect } from "react";
import { useMap } from "react-leaflet";

interface Props {
    center: LatLngExpression
}

export const MapEvents: React.FC<Props> = (props) => {
    const map = useMap();

    useEffect(() => {
        map.flyTo(props.center);
    }, [props.center]);
    return null;
};

export default MapEvents;