import { useState } from "react";
import { Row, Col, Card, CardBody } from "reactstrap";
import Map from "./Map";
import BloodBag from "../assets/BloodBag.png";
import Hospital from "../assets/Hospital.png";

const DonationCenter = () => {
  const [selectedHospital, setSelectedHospital] = useState(null);

  return (
    <>

      <Row className="text-center justify-content-center mb-4">
        <h3 style={{ color: "#B3261E" }}>Find a Donation Center Near You</h3>
        <h6 style={{ color: "#9a9a9aff" }}>
          Locate the nearest blood donation centers across Oman and schedule your
          next visit easily.
        </h6>
      </Row>


      <Row className="gx-3 gy-3 justify-content-center">


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
                <img alt="Hospital" width={"30px"} src={Hospital} /> Hospital /
                Center Details
              </h5>

              {selectedHospital ? (
                <>
                  <p>
                    <strong>Hospital Name:</strong> {selectedHospital.name}
                  </p>
                  <p>
                    <strong>Opening Hours:</strong>{" "}
                    {selectedHospital.openingHours}
                  </p>
                  <p>
                    <strong>Contact:</strong> {selectedHospital.contact}
                  </p>
                  <p>
                    <strong>Address:</strong> {selectedHospital.address} /
                    {selectedHospital.city}
                  </p>
                </>
              ) : (
                <p style={{ color: "#555" }}>
                  Select a hospital on the map to see details.
                </p>
              )}
            </CardBody>
          </Card>

          <br />


          <Card style={{ borderRadius: "20px", backgroundColor: "#bcd9db" }}>
            <CardBody>
              <h5 className="fw-bold mb-3">
                <img alt="Blood Bag" width={"30px"} src={BloodBag} /> Hospitals
                Currently Requesting Blood
              </h5>

              <p>
                <strong>Hospital Name:</strong> Sultan Qaboos Hospital
              </p>
              <p>
                <strong>Requested Blood Type:</strong> O-, AB
              </p>
              <p>
                <strong>Urgency Level:</strong> Urgent
              </p>
            </CardBody>
          </Card>
        </Col>
      </Row>
      
    </>
  );
};

export default DonationCenter;
