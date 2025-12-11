import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const Map = ({ onSelectHospital }) => {
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const res = await axios.get("https://blooddonationsys.onrender.com/api/donation-centers");
        setHospitals(res.data);
      } catch (error) {
        console.error("Error fetching hospitals:", error);
      }
    };
    fetchHospitals();
  }, []);

  return (
    <MapContainer
      center={[23.588, 58.4]}
      zoom={8}
      style={{ height: "450px", width: "100%", borderRadius: "15px" }}
    >
      <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {hospitals.map((h) => (
        <Marker
          key={h._id}
          position={[h.lat, h.lng]}
          eventHandlers={{ click: () => onSelectHospital(h) }}
        >
          <Tooltip direction="top" offset={[0, -10]} opacity={1}>
            {h.name}
          </Tooltip>
          <Popup>{h.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
