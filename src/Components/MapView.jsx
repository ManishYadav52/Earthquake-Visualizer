import React from "react"; // Map + legend + focus controller
import { MapContainer, TileLayer, CircleMarker, Popup, ScaleControl, useMap } from "react-leaflet";
import L from "leaflet";

// Simple legend for magnitude colors
function Legend() {
  const map = useMap();
  React.useEffect(() => {
    const legend = L.control({ position: "bottomright" });
    legend.onAdd = function () {
      const div = L.DomUtil.create("div", "info legend bg-white/90 dark:bg-gray-900/80 text-gray-800 dark:text-gray-200 p-2 rounded shadow border border-black/5 dark:border-white/10");
      div.innerHTML = `
        <div class="text-xs font-semibold mb-1">Magnitude</div>
        <div class="flex items-center gap-2 text-xs">
          <span class="inline-block h-2 w-2 rounded-full" style="background:red"></span> ≥ 6
        </div>
        <div class="flex items-center gap-2 text-xs">
          <span class="inline-block h-2 w-2 rounded-full" style="background:orange"></span> 4–5.9
        </div>
        <div class="flex items-center gap-2 text-xs">
          <span class="inline-block h-2 w-2 rounded-full" style="background:yellow"></span> < 4
        </div>`;
      return div;
    };
    legend.addTo(map);
    return () => legend.remove();
  }, [map]);
  return null;
}

function FocusController({ focus }) {
  const map = useMap();
  React.useEffect(() => {
    if (!focus || !focus.geometry) return;
    const [lng, lat] = focus.geometry.coordinates;
    map.flyTo([lat, lng], 5, { duration: 1.0 });
  }, [focus, map]);
  return null;
}

// Recenter the map when resetKey changes
function ResetController({ resetKey, center = [20, 0], zoom = 2 }) {
  const map = useMap();
  React.useEffect(() => {
    if (resetKey === null || resetKey === undefined) return;
    map.setView(center, zoom);
  }, [resetKey, center, zoom, map]);
  return null;
}

// Leaflet map with markers; exposes map via ref
const MapView = React.forwardRef(function MapView({ earthquakes, darkMode, focus, resetKey }, mapRef) {

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      className="h-[85vh] w-full rounded-2xl shadow-lg"
      whenCreated={(map) => {
        if (mapRef) {
          mapRef.current = map;
        }
      }}
    >
      <TileLayer
        url={
          darkMode
            ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        }
        attribution="&copy; OpenStreetMap contributors"
      />

      <ScaleControl position="bottomleft" />
      <Legend />
      <FocusController focus={focus} />
      <ResetController resetKey={resetKey} />

      {earthquakes.map((eq) => {
        const [long, lat, depth] = eq.geometry.coordinates;
        const mag = eq.properties.mag;

        return (
          <CircleMarker
            key={eq.id}
            center={[lat, long]}
            radius={mag * 2}
            pathOptions={{
              color: mag >= 6 ? "red" : mag >= 4 ? "orange" : "yellow",
              fillOpacity: 0.6,
            }}
            className={mag >= 6 ? "pulse" : ""}
          >
            <Popup>
              <div className="text-sm">
                <h3 className="font-bold">{eq.properties.place}</h3>
                <p>Magnitude: {mag}</p>
                <p>Depth: {depth} km</p>
                <p>Time: {new Date(eq.properties.time).toLocaleString()}</p>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
});

export default MapView;
