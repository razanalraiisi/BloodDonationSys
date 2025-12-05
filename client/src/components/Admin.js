import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Table,
  Input,
  Navbar,
  NavbarBrand
} from "reactstrap";
import Footer from "./Footer";
import axios from "axios";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/UserSlice';
import { useNavigate, Link } from 'react-router-dom';
import { FaSignOutAlt, FaSignInAlt } from "react-icons/fa";
import Logo from '../assets/logo.jpeg';
import bloodDonation from '../assets/bloodDonation.png';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.users.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };


  const [stats] = useState({
    activeDonors: 1000,
    livesSaved: 3700,
    unitsAvailable: 100,
    centers: 12,
  });


  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");

  const loadRequests = async () => {
    try {
      const res = await axios.get("http://localhost:5000/request/all");
      setRequests(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const filteredRequests = requests.filter((r) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return (
      r.patientName?.toLowerCase().includes(term) ||
      r.bloodType?.toLowerCase().includes(term) ||
      r.hospital?.toLowerCase().includes(term) ||
      r.urgency?.toLowerCase().includes(term) ||
      r.status?.toLowerCase().includes(term) ||
      r.userEmail?.toLowerCase().includes(term)
    );
  });

  return (
    <Container fluid>

      <Navbar className="navigation" light expand="md" style={styles.navbar}>

        <NavbarBrand style={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/">
            <img src={Logo} width="75px" height="75px" alt="logo" />
          </Link>
          <h6 style={{ marginLeft: '10px', fontWeight: '700', color: '#B3261E' }}>
            BloodLink
          </h6>
        </NavbarBrand>

 
        {user ? (
          <Button
            onClick={handleLogout}
            style={{
              backgroundColor: '#B3261E',
              borderColor: '#B3261E',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              marginRight: '20px'
            }}
          >
            <FaSignOutAlt /> Logout
          </Button>
        ) : (
          <Link to="/login" style={{ color: '#B3261E', fontSize: '20px', marginRight: '20px' }}>
            <FaSignInAlt />
          </Link>
        )}
      </Navbar>


      <Row className="mt-4">
        <Col>
          <h2 className="admin-title">Admin Dashboard</h2>
        </Col>
      </Row>

      <Row className="mt-4 justify-content-center">
        {[
          { label: "Active Donors", value: stats.activeDonors },
          { label: "Lives Saved", value: stats.livesSaved },
          { label: "Units Available", value: stats.unitsAvailable },
          { label: "Donation Centers", value: stats.centers }
        ].map((s, i) => (
          <Col md="2" key={i} className="text-center m-2">
            <Card className="admin-stats-card">
              <CardBody>
                <h3>{s.value}</h3>
                <p>{s.label}</p>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>


      <Row className="mt-4 justify-content-center">
        <Col md="3" className="d-flex flex-column align-items-center">
          <img
            src={bloodDonation}
            style={{ width: '500px', height: '300px', borderRadius: '15px', marginBottom: '20px' }}
            alt="Blood Donation"
          />
          <Button
            style={{ background: '#B3261E', width: '100%' }}
            onClick={() => navigate("/add-center")}
          >
            Add Donation Center
          </Button>
        </Col>
      </Row><br />



      <Row className="mt-4 justify-content-center">
        <Col md="4">
          <Input
            className="admin-search-input"
            placeholder="Search requests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
      </Row>


      <Row className="mt-4 justify-content-center">
        <Col md="11">
          <Card className="info-card">
            <CardBody>
              <h4 className="admin-section-title">Blood Requests</h4>
              <Table bordered responsive className="admin-table mt-3">
                <thead>
                  <tr>
                    <th>Patient Name</th>
                    <th>User Email</th>
                    <th>Blood Type</th>
                    <th>Hospital</th>
                    <th>Urgency</th>
                    <th>Needed Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((r) => (
                    <tr key={r._id}>
                      <td>{r.patientName}</td>
                      <td>{r.userEmail}</td>
                      <td>{r.bloodType}</td>
                      <td>{r.hospital}</td>
                      <td>{r.urgency}</td>
                      <td>{r.neededDate}</td>
                      <td>{r.status}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Footer />
    </Container>
  );
};

export default AdminDashboard;

const styles = {
  navbar: {
    backgroundColor: "#FDF4F4",
    borderBottom: "2px solid #E19E9C",
    padding: "10px 20px",
    justifyContent: "space-between"
  }
};
