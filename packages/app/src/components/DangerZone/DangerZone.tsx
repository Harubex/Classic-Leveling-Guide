import React, { useState } from "react";
import { Polygon, Popup } from "react-leaflet";
import { transposeTextEntities } from "../../textUtils";
import type { LatLngExpression, LeafletMouseEventHandlerFn } from "leaflet";

interface Props {
    tooltip?: string;
    coords: LatLngExpression[];
}


const DangerZone: React.FC<Props> = (props: Props) => {
    const [tooltipOpen, setTooltipOpen] = useState<boolean>(false);
    const [clickPosition, setClickPosition] = useState<LatLngExpression>([0, 0]);
    const chunks = props.tooltip ? transposeTextEntities(props.tooltip) : [];

    const onClick: LeafletMouseEventHandlerFn = (ev) => {
        setClickPosition(ev.latlng);
        setTooltipOpen(!tooltipOpen);
    };


    return (
        <>
            <Polygon eventHandlers={{ click: onClick }} positions={props.coords} pathOptions={{ color: "red" }} />
            {tooltipOpen && (
                <Popup position={clickPosition} closeButton={false}>
                    {chunks.concat()}
                </Popup>
            )}
        </>
    );
};

export default DangerZone;