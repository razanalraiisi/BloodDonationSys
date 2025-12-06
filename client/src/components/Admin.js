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
import { FaSignOutAlt, FaSignInAlt, FaHome, FaFileAlt, FaHospital } from "react-icons/fa";
import Logo from '../assets/logo.jpeg';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.users.user);
  const dispatch = useDispatch();

  const [activeSection, setActiveSection] = useState('dashboard');

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const [stats, setStats] = useState({
    activeDonors: 0,
    livesSaved: 0,
    requestsAvailable: 0,
    donationsAvailable: 0,
    donationCenters: 0
  });

  const loadDashboardStats = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/dashboard-stats");
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadDashboardStats();
    const interval = setInterval(loadDashboardStats, 10000);
    return () => clearInterval(interval);
  }, []);

  // ------------------ BLOOD REQUESTS ------------------
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

  useEffect(() => { loadRequests(); }, []);

  const filteredRequests = requests.filter((r) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return (
      r.patientName?.toLowerCase().includes(term) ||
      r.userEmail?.toLowerCase().includes(term) ||
      r.bloodType?.toLowerCase().includes(term) ||
      r.hospital?.toLowerCase().includes(term) ||
      r.urgency?.toLowerCase().includes(term) ||
      r.status?.toLowerCase().includes(term)
    );
  });

  // ------------------ DONATION REQUESTS ------------------
  const [donations, setDonations] = useState([]);
  const [donationSearch, setDonationSearch] = useState("");

  const loadDonations = async () => {
    try {
      const res = await axios.get("http://localhost:5000/donation/all");
      setDonations(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => { loadDonations(); }, []);

  const filteredDonations = donations.filter((d) => {
    if (!donationSearch.trim()) return true;
    const term = donationSearch.toLowerCase();
    return (
      d.donorName?.toLowerCase().includes(term) ||
      d.donorEmail?.toLowerCase().includes(term) ||
      d.bloodType?.toLowerCase().includes(term) ||
      d.donationType?.toLowerCase().includes(term) ||
      d.hospitalLocation?.toLowerCase().includes(term) ||
      d.status?.toLowerCase().includes(term)
    );
  });

  // ------------------ ELIGIBILITY TERMS ------------------
  const [eligibilityTerms, setEligibilityTerms] = useState([]);
  const [termForm, setTermForm] = useState({ title: '', description: '', category: 'General', order: 1, active: true });
  const [termMsg, setTermMsg] = useState('');
  const [editTermId, setEditTermId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', category: 'General', order: 1, active: true });

  const loadTerms = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/eligibility-terms');
      const items = Array.isArray(res.data) ? res.data : [];
      setEligibilityTerms(items);
    } catch { setEligibilityTerms([]); }
  };

  useEffect(() => { loadTerms(); }, []);

  const getMaxOrder = () => eligibilityTerms.length + 1;

  const createTerm = async () => {
    const maxOrder = getMaxOrder();
    if (termForm.order < 1 || termForm.order > maxOrder) {
      setTermMsg(`Order must be between 1 and ${maxOrder}`);
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/eligibility-terms', termForm);
      setTermMsg('Term created');
      setTermForm({ title: '', description: '', category: 'General', order: maxOrder, active: true });
      loadTerms();
    } catch { setTermMsg('Create failed'); }
  };

  const updateTerm = async (id, patch) => {
    const maxOrder = eligibilityTerms.length;
    if (patch.order < 1 || patch.order > maxOrder) {
      setTermMsg(`Order must be between 1 and ${maxOrder}`);
      return;
    }
    try {
      await axios.put(`http://localhost:5000/api/eligibility-terms/${id}`, patch);
      loadTerms();
    } catch { setTermMsg('Update failed'); }
  };

  const deleteTerm = async (id) => {
    try { await axios.delete(`http://localhost:5000/api/eligibility-terms/${id}`); loadTerms(); }
    catch { setTermMsg('Delete failed'); }
  };

  // ------------------ UI ------------------
  return (
    <Container fluid>
      <Navbar className="navigation" light expand="md" style={styles.navbar}>
        <NavbarBrand style={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/"><img src={Logo} width="75px" height="75px" alt="logo" /></Link>
          <h6 style={{ marginLeft: '10px', fontWeight: '700', color: '#B3261E' }}>BloodLink</h6>
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
            }}>
            <FaSignOutAlt /> Logout
          </Button>
        ) : (
          <Link to="/login" style={{ color: '#B3261E', fontSize: '20px', marginRight: '20px' }}>
            <FaSignInAlt />
          </Link>
        )}
      </Navbar>

      <Row className="mt-4"><Col><h2 className="admin-title">Admin Dashboard</h2></Col></Row>

      {/* Sidebar */}
      <div style={{ position: 'fixed', top: 110, left: 20, width: 64, zIndex: 10 }}>
        <div style={{
          background: '#FFFFFF',
          borderRadius: 16,
          boxShadow: '0 8px 24px rgba(179,38,30,0.12)',
          padding: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10
        }}>
          <div className="sidebar-icon"
               onClick={() => setActiveSection('dashboard')}
               style={getSidebarStyle(activeSection === 'dashboard')}
               title="Dashboard"><FaHome size={18} /></div>

          <div className="sidebar-icon"
               onClick={() => setActiveSection('eligibility')}
               style={getSidebarStyle(activeSection === 'eligibility')}
               title="Eligibility Terms"><FaFileAlt size={18} /></div>

          <div className="sidebar-icon"
               onClick={() => navigate("/add-center")}
               style={getSidebarStyle(false)}
               title="Add Donation Center"><FaHospital size={18} /></div>
        </div>
      </div>

      {/* ---------------- DASHBOARD SECTION ---------------- */}
      {activeSection === 'dashboard' && (
        <>
          {/* Stats Cards */}
          <Row className="mt-4 justify-content-center">
            {[
              { label: "Active Donors", value: stats.activeDonors },
              { label: "Lives Saved", value: stats.livesSaved },
              { label: "Requests Available", value: stats.requestsAvailable },
              { label: "Donations Requests", value: stats.donationsAvailable },
              { label: "Donation Centers", value: stats.donationCenters },
            ].map((s, i) => (
              <Col md="2" key={i} className="text-center m-2">
                <Card style={{
                  height: "140px",
                  borderRadius: "16px",
                  background: "linear-gradient(135deg, #B3261E 0%, #E95B54 100%)",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
                  color: "white",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  transition: "transform .2s"
                }}
                  className="admin-stats-card"
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                >
                  <CardBody>
                    <h2 style={{ fontWeight: "700" }}>{s.value}</h2>
                    <p style={{ marginTop: "-5px", opacity: 0.9 }}>{s.label}</p>
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Blood Request Search */}
          <Row className="mt-4 justify-content-center">
            <Col md="4">
              <Input
                className="pretty-search mb-3"
                placeholder="Search blood requests..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Col>
          </Row>

          {/* Blood Requests Table */}
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
                        <th>Blood</th>
                        <th>Hospital</th>
                        <th>Urgency</th>
                        <th>Date Needed</th>
                        <th>Units</th>
                        <th>Medical Report</th> {/* NEW COLUMN */}
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
                          <td>{r.bloodUnits}</td>

                          {/* ⭐ Medical Report Column */}
                          <td>
                            {r.medicalReportPath ? (
                              <a
                                href={`http://localhost:5000/${r.medicalReportPath}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  color: "#B3261E",
                                  fontWeight: "600",
                                  textDecoration: "underline",
                                  cursor: "pointer"
                                }}
                              >
                                View Report
                              </a>
                            ) : (
                              <span style={{ color: "gray" }}>No File</span>
                            )}
                          </td>

                          <td>
                            <span
                              className={`badge px-2 py-1 ${r.status === "Completed" ? "bg-success" : "bg-warning text-dark"}`}
                              style={{ fontSize: "0.85rem", borderRadius: "8px" }}
                            >
                              {r.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* Donation Search */}
          <Row className="mt-4 justify-content-center">
            <Col md="4">
              <Input
                className="pretty-search mb-3"
                placeholder="Search donation requests..."
                value={donationSearch}
                onChange={(e) => setDonationSearch(e.target.value)}
              />
            </Col>
          </Row>

          {/* Donation Requests Table */}
          <Row className="mt-4 justify-content-center">
            <Col md="11">
              <Card className="info-card">
                <CardBody>
                  <h4 className="admin-section-title">Donation Requests</h4>

                  <Table bordered responsive className="admin-table mt-3">
                    <thead>
                      <tr>
                        <th>Donor Name</th>
                        <th>Email</th>
                        <th>Blood Type</th>
                        <th>Donation Type</th>
                        <th>Hospital</th>
                        <th>Feeling Well</th>
                        <th>Health Changes</th>
                        <th>Medication</th>
                        <th>Chronic Illness</th>
                        <th>Traveled Recent</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredDonations.map((don) => (
                        <tr key={don._id}>
                          <td>{don.donorName}</td>
                          <td>{don.donorEmail}</td>
                          <td>{don.bloodType}</td>
                          <td>{don.donationType}</td>
                          <td>{don.hospitalLocation}</td>
                          <td>{don.feelingWell}</td>
                          <td>{don.healthChanges}</td>
                          <td>{don.medication}</td>
                          <td>{don.chronicIllness}</td>
                          <td>{don.traveledRecent}</td>
                          <td>{new Date(don.createdAt).toLocaleDateString()}</td>
                          <td>
                            <span
                              className={`badge px-2 py-1 ${don.status === "Completed" ? "bg-success" : "bg-warning text-dark"}`}
                              style={{ fontSize: "0.85rem", borderRadius: "8px" }}
                            >
                              {don.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>

                  </Table>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </>
      )}

      {/* ---------------- ELIGIBILITY TERMS SECTION ---------------- */}
      {activeSection === 'eligibility' && (
        <Card className="info-card">
          <CardBody>
            <h4 className="admin-section-title">Edit Eligibility Terms</h4>
            {termMsg && (
              <div className='auth-label' style={{ color: termMsg.includes('failed') ? '#B3261E' : '#065F46' }}>
                {termMsg}
              </div>
            )}

            <Row>
              <Col md="6">
                <h6 className="auth-title" style={{ marginBottom: 8 }}>Add New</h6>
                <div>
                  <label className='auth-label'>Title</label>
                  <Input value={termForm.title} onChange={(e) => setTermForm({ ...termForm, title: e.target.value })} />

                  <label className='auth-label' style={{ marginTop: 8 }}>Description</label>
                  <Input type="textarea" rows={4} value={termForm.description}
                         onChange={(e) => setTermForm({ ...termForm, description: e.target.value })} />

                  <Row className='mt-2'>
                    <Col>
                      <label className='auth-label'>Category</label>
                      <Input value={termForm.category}
                             onChange={(e) => setTermForm({ ...termForm, category: e.target.value })} />
                    </Col>

                    <Col>
                      <label className='auth-label'>Order</label>
                      <Input type='number' value={termForm.order} min={1} max={getMaxOrder()}
                             onChange={(e) => setTermForm({ ...termForm, order: Number(e.target.value) || 1 })} />
                    </Col>
                  </Row>

                  <div className='mt-2'>
                    <label className='auth-label' style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <input type='checkbox' checked={termForm.active}
                             onChange={(e) => setTermForm({ ...termForm, active: e.target.checked })} /> Active
                    </label>
                  </div>

                  <div className='mt-2'>
                    <Button style={{ background: '#B3261E' }} onClick={createTerm}>
                      Add Term
                    </Button>
                  </div>
                </div>
              </Col>

              <Col md="6">
                <h6 className="auth-title" style={{ marginBottom: 8 }}>Existing Terms</h6>

                {eligibilityTerms.length === 0 ? (
                  <p className='auth-label'>No terms yet.</p>
                ) : (
                  <div>
                    {eligibilityTerms.map(t => (
                      <div key={t._id}
                           style={{ border: '1px solid #E5E7EB', borderRadius: 8, padding: 12, marginBottom: 10 }}>
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr auto',
                          alignItems: 'center'
                        }}>
                          <strong>{t.title}</strong>

                          <div style={{ display: 'inline-flex', gap: 8 }}>
                            <Button size='sm' onClick={() => {
                              setEditTermId(t._id);
                              setEditForm({
                                title: t.title || '',
                                description: t.description || '',
                                category: t.category || 'General',
                                order: t.order || 1,
                                active: !!t.active
                              });
                            }}>Edit</Button>

                            <Button size='sm' color='danger' onClick={() => deleteTerm(t._id)}>
                              Delete
                            </Button>
                          </div>
                        </div>

                        <div className='auth-label' style={{ marginTop: 6 }}>{t.description}</div>
                      </div>
                    ))}
                  </div>
                )}
              </Col>
            </Row>
          </CardBody>
        </Card>
      )}

      <Footer />

      <style>
        {`
          .pretty-search {
            padding: 10px 14px;
            border-radius: 12px;
            border: 2px solid #d0d0d0;
            transition: 0.2s ease;
            font-size: 15px;
          }
          .pretty-search:focus {
            border-color: #a80000;
            box-shadow: 0 0 0 4px rgba(168, 0, 0, 0.15);
          }
        `}
      </style>
    </Container>
  );
};

export default AdminDashboard;

const getSidebarStyle = (active) => ({
  width: 48,
  height: 48,
  borderRadius: 12,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  background: active ? '#B3261E' : '#F3F4F6',
  color: active ? '#FFFFFF' : '#374151',
  position: 'relative'
});

const styles = {
  navbar: {
    backgroundColor: "#FDF4F4",
    borderBottom: "2px solid #E19E9C",
    padding: "10px 20px",
    justifyContent: "space-between"
  }
};
