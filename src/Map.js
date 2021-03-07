// import React from "react";

// import "./Map.css";
// import { MapContainer as LeafletMap, TileLayer } from "react-leaflet";
// import { showDataOnMap } from "./util";
// // import { LatLng } from "leaflet";
// function Map({ countries, casesType, center, zoom }) {
//   return (
//     <div className="map">
//       <LeafletMap center={center} zoom={zoom}>
//         <TileLayer
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           attribution='&copy; <a href="https://osm.org/copyright">
//         OpenStreetMap</a> contributors'
//         />
//         {showDataOnMap(countries, casesType)}
//       </LeafletMap>
//     </div>
//   );
// }

// export default Map;

import React from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "./Map.css";
import { showDataOnMap } from "./util";

function Map({ countries, casesType, center, zoom }) {
  function ChangeView({ center, zoom }) {
    const map = useMap();
    map.setView(center, zoom);
    return null;
  }

  return (
    <MapContainer
      casesType={casesType}
      className="map"
      center={center}
      zoom={zoom}
      scrollWheelZoom={false}
    >
      <ChangeView center={center} zoom={zoom} />
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {showDataOnMap(countries, casesType)}
    </MapContainer>
  );
}

export default Map;
