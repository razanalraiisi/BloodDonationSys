import { Container, Row, Col, Card, CardBody } from 'reactstrap';
import BloodBag from "../assets/BloodBag.png";
import Hospital from "../assets/Hospital.png";
import axios from "axios";
import { useState, useEffect } from "react";

const DonationCenter = () => {

    
    const [centers, setCenters] = useState([]);

    useEffect(() => {
        const loadCenters = async () => {
            try {
                const res = await axios.get("http://localhost:5000/center/all");
                setCenters(res.data);
            } catch (err) {
                console.error("Error loading centers:", err);
            }
        };

        loadCenters();
    }, []);

    return (
        <>
            <Row className="text-center justify-content-center">
                <h3 style={{ color: '#B3261E' }}>Find a Donation Center Near You</h3><br /><br />
                <h6 style={{ color: '#9a9a9aff' }}> Locate the nearest blood donation centers across Oman and schedule your next visit easily.</h6>
            </Row>

            <Row>
                <Row className="gx-5 gy-5">

                    {/* MAP SECTION */}
                    <Col md="6" className="text-center justify-content-center">
                        <Card>
                            <h3>HOSPITAL / DONATION CENTER MAP</h3>
                        </Card>
                    </Col>

                    {/* RIGHT SIDE CARDS */}
                    <Col md="5">

                        {/* Donation Center Details */}
                        <Card style={{ borderRadius: "20px", backgroundColor: "#bcd9db" }}>
                            <CardBody>
                                <h5 className="fw-bold mb-2">
                                    <img alt="Hospital" width={"30px"} src={Hospital} /> Hospital / Center Details
                                </h5>

                                {centers.length === 0 ? (
                                    <p>Loading centers...</p>
                                ) : (
                                    centers.map((c) => (
                                        <div key={c._id}>
                                            <p><strong>Name:</strong> {c.name}</p>
                                            <p><strong>Opening Hours:</strong> {c.hours}</p>
                                            <p><strong>Contact Number:</strong> {c.phone}</p>
                                            <p><strong>Address & City:</strong> {c.city}</p>
                                            <hr />
                                        </div>
                                    ))
                                )}
                            </CardBody>
                        </Card>

                        <br />

                        {/* Hospitals Requesting Blood */}
                        <Card style={{ borderRadius: "20px", backgroundColor: "#bcd9db" }}>
                            <CardBody>
                                <h5 className="fw-bold mb-2">
                                    <img alt="Blood Bag" width={"30px"} src={BloodBag} /> Hospitals Currently Requesting Blood
                                </h5>

                                {/* For now still static — until backend route is ready */}
                                <p><strong>Hospital / Center Name:</strong> Sultan Qaboos Hospital</p>
                                <p><strong>Opening Hours:</strong> 24/7</p>
                                <p><strong>Contact Number:</strong> 22222222</p>
                                <p><strong>Address & City:</strong> Seeb/Muscat</p>
                                <p><strong>Requested Blood Type:</strong> O-, AB</p>
                                <p><strong>Urgency Level:</strong> Urgent</p>

                            </CardBody>
                        </Card>

                    </Col>
                </Row>
            </Row>
        </>
    );
}

export default DonationCenter;
