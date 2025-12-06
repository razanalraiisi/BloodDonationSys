import { Container, Row, Col, UncontrolledAccordion, AccordionItem, AccordionHeader, AccordionBody, Card, CardBody, Button } from "reactstrap";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import CountUp from "react-countup"; // For smooth number animation
import BloodDonate from "../assets/BloodDonate.png";
import BloodBag from "../assets/BloodBag.png";
import HeartPulse from "../assets/HeartPulse.png";
import bloodDonorCartoon from "../assets/bloodDonorCartoon.jpg";

const Home = () => {
  const [dashboard, setDashboard] = useState({ activeDonors: 0, livesSaved: 0 });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/dashboard");
        setDashboard(data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    fetchDashboard(); // fetch immediately
    const interval = setInterval(fetchDashboard, 10000); // fetch every 10 seconds

    return () => clearInterval(interval); // clean up on unmount
  }, []);

  const navigate = useNavigate();

  return (
    <Container fluid>
      <Row style={{ backgroundColor: '#ffff' }}>
        <Col className="text-center justify-content-center">
          <img alt="Blood Donation" style={{ width: '80%' }} src={bloodDonorCartoon} />
        </Col>
        <Col className="mt-5 gx-4 gy-4 stats-row text-center justify-content-center">
          <h3 style={{ color: '#B3261E' }}>Blood donation is a simple act of kindness that can save countless lives.</h3><br />
          <Button style={{ backgroundColor: '#f7c7c7', color: '#B3261E', borderRadius: '15px' }} onClick={() => navigate('/request')}>Request Blood</Button> {" "}
          <Button style={{ backgroundColor: '#f7c7c7', color: '#B3261E', borderRadius: '15px' }} onClick={() => navigate('/compatibleRequests')}>Donate Blood</Button>
        </Col>
      </Row>

      <Row className="mt-5 gx-4 gy-4 info-row justify-content-center">
        <Col md="3">
          <Card className="info-card">
            <CardBody>
              <h6 style={{ color: '#B3261E' }}><img alt="BloodBag" width={"30px"} src={BloodBag} />  Who Can Donate?</h6>
              <p>
                Healthy individuals aged 18–65, weighing at least 110 lbs, can donate every 56 days.
              </p>
            </CardBody>
          </Card>
        </Col>

        <Col md="3">
          <Card className="info-card">
            <CardBody>
              <h6 style={{ color: '#B3261E' }}><img alt="Donate Blood" width={"30px"} src={BloodDonate} /> Donation Process</h6>
              <p>
                The process takes about an hour; the actual donation is only 8–10 minutes.
              </p>
            </CardBody>
          </Card>
        </Col>

        <Col md="3">
          <Card className="info-card">
            <CardBody>
              <h6 style={{ color: '#B3261E' }}><img alt="HeartPulse" width={"30px"} src={HeartPulse} /> Benefits of Donating</h6>
              <p>
                Free health screening, reduced risk of heart disease, and saving lives.
              </p>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row className="mt-5 gx-4 gy-4 stats-row text-center justify-content-center">
        <Col md="2">
          <Card style={{ backgroundColor: '#f7c7c7', borderRadius: '15px' }}>
            <CardBody>
              <h3 style={{ color: '#B3261E' }}>
                <CountUp end={dashboard.activeDonors} duration={1.5} />
              </h3>
              <p style={{ color: '#E19E9C' }}>Active Donors</p>
            </CardBody>
          </Card>
        </Col>

        <Col md="2">
          <Card style={{ backgroundColor: '#f7c7c7', borderRadius: '15px' }}>
            <CardBody>
              <h3 style={{ color: '#B3261E' }}>
                <CountUp end={dashboard.livesSaved} duration={1.5} />
              </h3>
              <p style={{ color: '#E19E9C' }}>Lives Saved</p>
            </CardBody>
          </Card>
        </Col>

        <Col md="2">
          <Card style={{ backgroundColor: '#f7c7c7', borderRadius: '15px' }}>
            <CardBody>
              <h3 style={{ color: '#B3261E' }}>24/7</h3>
              <p style={{ color: '#E19E9C' }}>Service</p>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <br />
      <br />
      <Row>
        <Col style={{ textAlign: "center" }}>
          <h3>Frequently Asked Questions (FAQs)</h3>
          <UncontrolledAccordion className="accordion-body">
            <AccordionItem>
              <AccordionHeader targetId="1">
                How often can I donate blood?
              </AccordionHeader>
              <AccordionBody accordionId="1">
                You can safely donate whole blood every 3 months (12 weeks) for men and every 4 months for women.
                This allows your body enough time to replenish the donated blood.
              </AccordionBody>
            </AccordionItem>
            <AccordionItem>
              <AccordionHeader targetId="2">
                Is blood donation safe?
              </AccordionHeader>
              <AccordionBody accordionId="2">
                Yes, blood donation is completely safe. All equipment used including needles and bags is new, sterile, and used only once, ensuring the highest level of safety for every donor.
                A trained medical team oversees the entire process to make it comfortable and risk-free.
              </AccordionBody>
            </AccordionItem>
            <AccordionItem>
              <AccordionHeader targetId="3">
                Why should I donate blood through this platform?
              </AccordionHeader>
              <AccordionBody accordionId="3">
                Our digital system makes it easier to connect donors with nearby hospitals and blood banks, track donation history,
                and receive alerts.
              </AccordionBody>
            </AccordionItem>
          </UncontrolledAccordion>
        </Col>
      </Row>
      <br />
      <br />
    </Container>
  );
};

export default Home;
