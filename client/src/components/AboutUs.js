import { Col, Row } from "reactstrap";
import bloodDonorCartoon from "../assets/bloodDonorCartoon.jpg";

const AboutUs = () => {
    return (
        <div className="justify-content-center text-center p-4">
            <Row><h1 style={{ color:'#B3261E'}}>About Us</h1></Row><br/><br/>
            <Row>
                <Col><img alt="Blood Donation" style={{width:'80%'}} src={bloodDonorCartoon} /></Col>
                <Col>
            <p>BloodLink is a dedicated blood donation platform based in Oman, designed to seamlessly connect donors with recipients in need. Our mission is to save lives by making blood donation and requests simple, 
                efficient, and accessible to everyone across the country. Through BloodLink, users can easily register to donate, request blood, and locate donation centers, all in one place. We prioritize transparency, 
                safety, and timely communication, ensuring that every donation reaches those who need it most. By fostering a strong community of volunteers and leveraging modern technology, 
                BloodLink strives to enhance the culture of blood donation in Oman and make a meaningful impact on public health.</p></Col></Row> 
            
            <Row className="mt-5">
                <h2 className="mb-3" style={{ color:'#B3261E'}}>Our Team Contributions</h2>
                <Row className="g-3">
                    <Col xs="12" md="4">
                        <div className="card h-100 shadow-sm" style={{ borderColor:'#B3261E' }}>
                            <div className="card-header py-2" style={{ background:'#B3261E', color:'#fff', fontSize:'1rem' }}>RAZAN</div>
                            <div className="card-body py-2 small">
                                <ul className="text-start mb-0 ps-3">
                                    <li>Home page (Frontend and backend)</li>
                                    <li>Landing page</li>
                                    <li>Find donation center (frontend and database)</li>
                                    <li>About us</li>
                                    <li>Updated navbar</li>
                                    <li>Updated admin (add center form, requests table + info cards) — frontend & database</li>
                                    <li>Compatible requests page (frontend and database)</li>
                                </ul>
                            </div>
                        </div>
                    </Col>
                    <Col xs="12" md="4">
                        <div className="card h-100 shadow-sm" style={{ borderColor:'#B3261E' }}>
                            <div className="card-header py-2" style={{ background:'#B3261E', color:'#fff', fontSize:'1rem' }}>LAMYA</div>
                            <div className="card-body py-2 small">
                                <ul className="text-start mb-0 ps-3">
                                    <li>Donate Blood Form (frontend, backend and database)</li>
                                    <li>Eligible Terms Page (frontend, backend and database)</li>
                                    <li>Admin Eligible Terms Edit Page (frontend and backend)</li>
                                    <li>User Profile (frontend and backend)</li>
                                    <li>Signup and Login Forms (frontend)</li>
                                    <li>Request Blood Form (frontend)</li>
                                    <li>Test cases</li>
                                    <li>Added Animation</li>
                                </ul>
                            </div>
                        </div>
                    </Col>
                    <Col xs="12" md="4">
                        <div className="card h-100 shadow-sm" style={{ borderColor:'#B3261E' }}>
                            <div className="card-header py-2" style={{ background:'#B3261E', color:'#fff', fontSize:'1rem' }}>MARYAM</div>
                            <div className="card-body py-2 small">
                                <ul className="text-start mb-0 ps-3">
                                    <li>Initial backend code</li>
                                    <li>Database integration</li>
                                    <li>Footer & building models</li>
                                    <li>Sign up + sign in database and backend Authentication</li>
                                    <li>Admin page displays (frontend and backend)</li>
                                    <li>Request blood form (backend and database)</li>
                                    <li>Admin page protection</li>
                                </ul>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Row>
        </div>
    );
}
export default AboutUs;