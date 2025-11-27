import { Container, Row,Col, Card, CardBody } from 'reactstrap';
import BloodBag from "../assets/BloodBag.png";
import Hospital from "../assets/Hospital.png";

const DonationCenter=()=>{
    
    return(
        <>
            <Row className="text-center justify-content-center"><h3 style={{color:'#B3261E'}}>Find a Donation Center Near You</h3><br/><br/>
            <h6 style={{color:'#9a9a9aff'}}> Locate the nearest blood donation centers across Oman and schedule your next visit easily.</h6></Row>
            <Row>
                
                    <Row className="gx-5 gy-5">

                        
                        <Col md="6" className="text-center justify-content-center">
                            <Card>
                                <h3>HOSPITAL / DONATION CENTER MAP</h3>
                            </Card>
                        </Col>

                        
                        <Col md="5">

                            
                            <Card style={{ borderRadius: "20px", backgroundColor: "#bcd9db" }}>
                                <CardBody>
                                    <h5 className="fw-bold mb-2"><img alt="Hospital" width={"30px"} src={Hospital} />  Hospital / Center Details
                                    </h5>

                                    <p>
                                        <strong>Hospital / Center Name:</strong> Sultan Qaboos Hospital
                                    </p>
                                    <p>
                                        <strong>Opening Hours:</strong> 24/7
                                    </p>
                                    <p>
                                        <strong>Contact Number:</strong> 22222222
                                    </p>
                                    <p>
                                        <strong>Address & City:</strong> Seeb/Muscat
                                    </p>
                                </CardBody>
                            </Card>
                            <br/>


                            
                            <Card style={{ borderRadius: "20px", backgroundColor: "#bcd9db" }}>
                                <CardBody>
                                    <h5 className="fw-bold mb-2">
                                        <img alt="Blood Bag" width={"30px"} src={BloodBag} /> Hospitals Currently Requesting Blood
                                    </h5>

                                    <p>
                                        <strong>Hospital / Center Name:</strong> Sultan Qaboos Hospital
                                    </p>
                                    <p>
                                        <strong>Opening Hours:</strong> 24/7
                                    </p>
                                    <p>
                                        <strong>Contact Number:</strong> 22222222
                                    </p>
                                    <p>
                                        <strong>Address & City:</strong> Seeb/Muscat
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
                
            </Row>
        </>
    )
}
export default DonationCenter;