import { useState, useEffect } from "react";
import { Row, Col, Card, CardBody, Button } from "reactstrap";
import { FaHospital, FaFileAlt, FaTint, FaExclamationTriangle, FaHeart, FaClock, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import Map from "./Map";
import BloodBag from "../assets/BloodBag.png";
import Hospital from "../assets/Hospital.png";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const DonationCenter = () => {
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [compatibleRequests, setCompatibleRequests] = useState([]);
  const user = useSelector(state => state.users.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.email && user?.bloodType) {
      axios.post("http://localhost:5000/request/compatible", { email: user.email, bloodType: user.bloodType })
        .then(res => {
          const requests = res.data;
          
          // Sort by urgency: Critical > Urgent > Normal
          const urgencyOrder = { "Critical": 0, "Urgent": 1, "Normal": 2 };
          requests.sort((a, b) => 
            (urgencyOrder[a.urgency?.trim()] || 3) - (urgencyOrder[b.urgency?.trim()] || 3)
          );
          
          // Keep only the first (highest priority) request
          setCompatibleRequests(requests.length > 0 ? [requests[0]] : []);
        })
        .catch(err => console.error(err));
    }
  }, [user?.email, user?.bloodType]);

  return (
    <>
      <Row className="text-center justify-content-center mb-4" style={{ padding: '10px 0' }}>
        <Col md="8">
          <h3 style={{ color: "#B3261E", marginBottom: "5px" }}>Find a Donation Center Near You</h3>
          <h6 style={{ color: "#9a9a9aff", marginBottom: "0" }}>
            Locate the nearest blood donation centers across Oman and schedule your
            next visit easily.
          </h6>
        </Col>
      </Row>

      <Row className="gx-3 gy-3 justify-content-center mt-1">
        <Col md="6">
          <Card style={{ borderRadius: "20px", padding: "10px" }}>
            <h4 className="text-center mb-3" style={{ color: "#B3261E" }}>
              Hospital / Donation Center Map
            </h4>
            <Map onSelectHospital={setSelectedHospital} />
          </Card>
        </Col>

        <Col md="5">
          <Card style={{ borderRadius: "20px", backgroundColor: "#bcd9db" }}>
            <CardBody>
              <h5 className="fw-bold mb-3">
                <img alt="Hospital" width={"30px"} src={Hospital} /> Hospital / Center Details
              </h5>

              {selectedHospital ? (
                <>
                  <p style={{ marginBottom: "10px" }}><strong><FaHospital style={{ marginRight: "8px", color: "#B3261E" }} /> Name:</strong> {selectedHospital.name}</p>
                  <p style={{ marginBottom: "10px" }}><strong><FaClock style={{ marginRight: "8px", color: "#B3261E" }} /> Opening Hours:</strong> {selectedHospital.openingHours}</p>
                  <p style={{ marginBottom: "10px" }}><strong><FaPhone style={{ marginRight: "8px", color: "#B3261E" }} /> Contact:</strong> {selectedHospital.contact}</p>
                  <p style={{ marginBottom: "10px" }}><strong><FaMapMarkerAlt style={{ marginRight: "8px", color: "#B3261E" }} /> Address:</strong> {selectedHospital.address} / {selectedHospital.city}</p>
                </>
              ) : (
                <p style={{ color: "#555" }}>Select a hospital on the map to see details.</p>
              )}
            </CardBody>
          </Card>

          <br />

          <Card style={{ borderRadius: "20px", backgroundColor: "#bcd9db" }}>
            <CardBody>
              <h5 className="fw-bold mb-3">
                <img alt="Blood Bag" width={"30px"} src={BloodBag} /> Hospitals Currently Requesting Blood
              </h5>

              {compatibleRequests.length === 0 ? (
                <p style={{ textAlign: "center", color: "#555", fontSize: "16px" }}>No compatible blood requests at the moment.</p>
              ) : (
                compatibleRequests.map((request) => {
                  const urgencyColors = {
                    "Critical": "#FF6B6B",
                    "Urgent": "#a8d0d5",
                    "Normal": "#51CF66"
                  };
                  const bgColor = urgencyColors[request.urgency?.trim()] || "#f0f0f0";
                  
                  return (
                    <Card 
                      key={request._id} 
                      style={{ 
                        marginBottom: "15px", 
                        padding: "15px",
                        background: bgColor,
                        borderRadius: "15px",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                        border: "none"
                      }}
                    >
                      <p style={{ marginBottom: "8px" }}><strong><FaHospital style={{ marginRight: "8px", color: "#B3261E" }} /> Hospital:</strong> {request.hospital}</p>
                      <p style={{ marginBottom: "8px" }}><strong><FaFileAlt style={{ marginRight: "8px", color: "#B3261E" }} /> File #:</strong> {request.hospitalFileNumber}</p>
                      <p style={{ marginBottom: "8px" }}><strong><FaTint style={{ marginRight: "8px", color: "#B3261E" }} /> Blood Type:</strong> {request.bloodType}</p>
                      <p style={{ marginBottom: "8px" }}><strong><FaFileAlt style={{ marginRight: "8px", color: "#B3261E" }} /> Units:</strong> {request.bloodUnits}</p>
                      <p style={{ marginBottom: "12px" }}><strong><FaExclamationTriangle style={{ marginRight: "8px", color: "#B3261E" }} /> Urgency:</strong> <span style={{ fontWeight: "bold", color: "#333" }}>{request.urgency}</span></p>
                      <Button
                        size="sm"
                        style={{ width: "100%", backgroundColor:'#B3261E', color:'#fff', borderRadius: '10px', border: 'none', fontWeight: 'bold' }}
                        onClick={() => navigate(`/donate`, { state: { hospitalName: request.hospital, hospitalFileNumber: request.hospitalFileNumber } })}
                      >
                        <FaHeart style={{ marginRight: "8px" }} /> Donate Now
                      </Button>
                    </Card>
                  );
                })
              )}
              {compatibleRequests.length > 0 && (
                <Button
                  style={{ marginTop: "15px", backgroundColor:'#B3261E', color:'#fff', borderRadius: '15px', width: '100%', fontWeight: 'bold' }}
                  onClick={() => navigate('/compatibleRequests')}
                >
                  View All Requests
                </Button>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default DonationCenter;
