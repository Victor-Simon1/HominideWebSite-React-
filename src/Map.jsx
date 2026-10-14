import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";

export const Legende = ({ especes = [], couleurs = {}, masquees = [], onToggle }) => (
  <ul style={{ listStyle: "none", padding: 0, display: "flex", flexWrap: "wrap", gap: "12px" }}>
    {especes.map((e) => {
      const masquee = masquees.includes(e.oid);
      return (
        <li key={e.oid}>
          <button
            onClick={() => onToggle(e.oid)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
              opacity: masquee ? 0.4 : 1,
              textDecoration: masquee ? "line-through" : "none",
            }}
          >
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: couleurs[e.oid],
                display: "inline-block",
              }}
            />
            {e.nam}
          </button>
        </li>
      );
    })}
  </ul>
);
export const CarteFossiles = ({fossiles,couleurs}) => {
  // ne garder que les fossiles qui ont des coordonnées
  const points = fossiles.filter((f) => f.lat != null && f.lng != null);

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      preferCanvas={true}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {points.map((f) => (
        <CircleMarker
          
          key={f.oid}
          center={[Number(f.lat), Number(f.lng)]}
          radius={4}
          pathOptions={{
            color: couleurs[f.tid] ?? "#888",       // couleur du contour
            fillColor: couleurs[f.tid] ?? "#888",   // couleur du remplissage
            fillOpacity: 0.8,       // 1 = totalement plein
            weight: 1,              // épaisseur du contour
          }}
        >
          <Popup>
            <strong>{f.tna}</strong>
            <br />
            {f.eag} à {f.lag} Ma
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
