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
            
        </div>
    );
}
export default AboutUs;