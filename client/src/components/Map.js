import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});


const hospitals = [
  {
  id: 1,
  name: "Royal Hospital",
  lat: 23.5773,
  lng: 58.3995,
  openingHours: "24/7",
  contact: "24441999",
  address: "Bausher",
  city: "Muscat",
},
{
  id: 2,
  name: "Sultan Qaboos University Hospital",
  lat: 23.5859,
  lng: 58.2073,
  openingHours: "24/7",
  contact: "24141111",
  address: "Al Khoudh",
  city: "Muscat",
},
{
  id: 3,
  name: "Khoula Hospital",
  lat: 23.5981,
  lng: 58.5525,
  openingHours: "24/7",
  contact: "24569999",
  address: "Darsait",
  city: "Muscat",
},
{
  id: 4,
  name: "Armed Forces Hospital",
  lat: 23.6029,
  lng: 58.2848,
  openingHours: "24/7",
  contact: "24315777",
  address: "Al Matar Street",
  city: "Muscat",
},
{
  id: 5,
  name: "Nizwa Hospital",
  lat: 22.9333,
  lng: 57.5333,
  openingHours: "24/7",
  contact: "25400000",
  address: "Nizwa",
  city: "Ad Dakhiliyah",
},
{
  id: 6,
  name: "Ibri Hospital",
  lat: 23.2257,
  lng: 56.5157,
  openingHours: "24/7",
  contact: "25690000",
  address: "Ibri",
  city: "Al Dhahirah",
},
{
  id: 7,
  name: "Sohar Hospital",
  lat: 24.3541,
  lng: 56.7074,
  openingHours: "24/7",
  contact: "26841000",
  address: "Sohar",
  city: "North Al Batinah",
},
{
  id: 8,
  name: "Sur Hospital",
  lat: 22.5667,
  lng: 59.5289,
  openingHours: "24/7",
  contact: "25540000",
  address: "Sur",
  city: "Ash Sharqiyah South",
},
{
  id: 9,
  name: "Al Rustaq Hospital",
  lat: 23.3909,
  lng: 57.4246,
  openingHours: "24/7",
  contact: "26870000",
  address: "Rustaq",
  city: "South Al Batinah",
},
{
  id: 10,
  name: "Salalah Hospital",
  lat: 17.0151,
  lng: 54.0924,
  openingHours: "24/7",
  contact: "23212345",
  address: "Salalah",
  city: "Dhofar",
},
{
  id: 11,
  name: "Buraimi Hospital",
  lat: 24.2510,
  lng: 55.7930,
  openingHours: "24/7",
  contact: "25640000",
  address: "Al Buraimi",
  city: "Al Buraimi",
},
{
  id: 12,
  name: "Quriyat Hospital",
  lat: 23.2633,
  lng: 58.9231,
  openingHours: "8 AM – 10 PM",
  contact: "24840222",
  address: "Quriyat",
  city: "Muscat Governorate",
},

];

const Map = ({ onSelectHospital }) => {
  return (
    <MapContainer
      center={[23.588, 58.4]}
      zoom={8}
      style={{ height: "450px", width: "100%", borderRadius: "15px" }}
    >
      
      <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {hospitals.map((h) => (
        <Marker
          key={h.id}
          position={[h.lat, h.lng]}
          eventHandlers={{
            click: () => onSelectHospital(h),
          }}
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
