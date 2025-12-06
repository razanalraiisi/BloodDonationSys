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
import { FaSignOutAlt, FaSignInAlt, FaHome, FaFileAlt } from "react-icons/fa";
import Logo from '../assets/logo.jpeg';
import bloodDonation from '../assets/bloodDonation.png';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.users.user);
  const dispatch = useDispatch();

  // Sidebar section selection
  const [activeSection, setActiveSection] = useState('dashboard'); // 'dashboard' | 'eligibility'

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
      r.userEmail?.toLowerCase().includes(term) ||
      r.bloodType?.toLowerCase().includes(term) ||
      r.hospital?.toLowerCase().includes(term) ||
      r.urgency?.toLowerCase().includes(term) ||
      r.status?.toLowerCase().includes(term)
    );
  });

  // Eligibility Terms state & actions
  const [eligibilityTerms, setEligibilityTerms] = useState([]);
  const [termForm, setTermForm] = useState({ title: '', description: '', category: 'General', order: 0, active: true });
  const [termMsg, setTermMsg] = useState('');
  const [editTermId, setEditTermId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', category: 'General', order: 0, active: true });

  const loadTerms = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/eligibility-terms');
      const items = Array.isArray(res.data) ? res.data : [];
      // If no terms exist, seed with the original default cards so admin can edit/delete them
      if (!items || items.length === 0) {
        const defaultTerms = [
          {
            title: 'Eligibility Checklist',
            description: '• You are feeling well today.\n• No recent health changes since your last donation.\n• You are not currently taking any medication.\n• You do not have chronic illnesses that prevent donation.',
            category: 'General',
            order: 1,
            active: true
          },
          {
            title: 'Minimum Intervals',
            description: '• Whole Blood: 56 days (8 weeks)\n• Platelets: 7 days\n• Plasma: 28 days\n• Double Red Cells: 112 days (16 weeks)\n\nIf you try to donate earlier, the Donate form will show your next eligible date and block submission.',
            category: 'Intervals',
            order: 2,
            active: true
          },
          {
            title: 'ID, Age & Safety',
            description: '• Bring a valid ID on donation day.\n• Meet the minimum age and weight per local regulations.\n• Hydrate well and have a light meal before donating.',
            category: 'Safety',
            order: 3,
            active: true
          },
          {
            title: 'Terms & Consent',
            description: '• Provide accurate information about your health history.\n• Your data is used to provide services and ensure safety.\n• By donating, you consent to standard screening and processing.',
            category: 'Consent',
            order: 4,
            active: true
          }
        ];
        try {
          await Promise.all(defaultTerms.map(dt => axios.post('http://localhost:5000/api/eligibility-terms', dt)));
          const seeded = await axios.get('http://localhost:5000/api/eligibility-terms');
          setEligibilityTerms(Array.isArray(seeded.data) ? seeded.data : []);
          return;
        } catch (seedErr) {
          // If seeding fails, fall back to empty list
          setEligibilityTerms([]);
          return;
        }
      }
      setEligibilityTerms(items);
    } catch { setEligibilityTerms([]); }
  };

  useEffect(() => { loadTerms(); }, []);

  const createTerm = async () => {
    try {
      await axios.post('http://localhost:5000/api/eligibility-terms', termForm);
      setTermMsg('Term created');
      setTermForm({ title: '', description: '', category: 'General', order: 0, active: true });
      loadTerms();
    } catch { setTermMsg('Create failed'); }
  };

  const updateTerm = async (id, patch) => {
    try { await axios.put(`http://localhost:5000/api/eligibility-terms/${id}`, patch); loadTerms(); }
    catch { setTermMsg('Update failed'); }
  };

  const deleteTerm = async (id) => {
    try { await axios.delete(`http://localhost:5000/api/eligibility-terms/${id}`); loadTerms(); }
    catch { setTermMsg('Delete failed'); }
  };

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

      {/* Slim icon-only sidebar: 56-64px wide, hover labels */}
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
          {/* Dashboard icon */}
          <div
            className="sidebar-icon"
            onClick={()=>setActiveSection('dashboard')}
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              background: activeSection==='dashboard' ? '#B3261E' : '#F3F4F6',
              color: activeSection==='dashboard' ? '#FFFFFF' : '#374151',
              position: 'relative'
            }}
            title="Dashboard"
          >
            <FaHome size={18} />
          </div>

          {/* Eligibility Terms icon */}
          <div
            className="sidebar-icon"
            onClick={()=>setActiveSection('eligibility')}
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              background: activeSection==='eligibility' ? '#B3261E' : '#F3F4F6',
              color: activeSection==='eligibility' ? '#FFFFFF' : '#374151',
              position: 'relative'
            }}
            title="Eligibility Terms"
          >
            <FaFileAlt size={18} />
          </div>
        </div>
      </div>

      {/* Content area */}
      <Row className="mt-4">
        <Col md="12" lg="12">
          {activeSection === 'dashboard' && (
            <>
              {/* Restore original dashboard layout */}
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
                <Col md="6" className="d-flex flex-column align-items-center">
                  <img
                    src={bloodDonation}
                    style={{ width: '500px', height: '300px', borderRadius: '15px', marginBottom: '20px' }}
                    alt="Blood Donation"
                  />
                  <Button
                    style={{ background: '#B3261E', width: '300px' }}
                    onClick={() => navigate("/add-center")}
                  >
                    Add Donation Center
                  </Button>
                </Col>
              </Row>

              {/* Restore original requests section on dashboard */}
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
                            <th>Blood</th>
                            <th>Hospital</th>
                            <th>Urgency</th>
                            <th>Date Needed</th>
                            <th>Units</th>
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
                              <td>{r.status}</td>
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

          {activeSection === 'eligibility' && (
            <Card className="info-card">
              <CardBody>
                <h4 className="admin-section-title">Edit Eligibility Terms</h4>
                {termMsg && (<div className='auth-label' style={{ color: termMsg.includes('failed') ? '#B3261E' : '#065F46' }}>{termMsg}</div>)}
                <Row>
                  <Col md="6">
                    <h6 className="auth-title" style={{ marginBottom: 8 }}>Add New</h6>
                    <div>
                      <label className='auth-label'>Title</label>
                      <Input value={termForm.title} onChange={(e)=>setTermForm({...termForm, title: e.target.value})} />
                      <label className='auth-label' style={{ marginTop: 8 }}>Description</label>
                      <Input type="textarea" rows={4} value={termForm.description} onChange={(e)=>setTermForm({...termForm, description: e.target.value})} />
                      <Row className='mt-2'>
                        <Col>
                          <label className='auth-label'>Category</label>
                          <Input value={termForm.category} onChange={(e)=>setTermForm({...termForm, category: e.target.value})} />
                        </Col>
                        <Col>
                          <label className='auth-label'>Order</label>
                          <Input type='number' value={termForm.order} onChange={(e)=>setTermForm({...termForm, order: Number(e.target.value)||0})} />
                        </Col>
                      </Row>
                      <div className='mt-2'>
                        <label className='auth-label' style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                          <input type='checkbox' checked={termForm.active} onChange={(e)=>setTermForm({...termForm, active: e.target.checked})} /> Active
                        </label>
                      </div>
                      <div className='mt-2'>
                        <Button style={{ background: '#B3261E' }} onClick={createTerm}>Add Term</Button>
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
                          <div key={t._id} style={{ border: '1px solid #E5E7EB', borderRadius: 8, padding: 12, marginBottom: 10 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center' }}>
                              <strong>{t.title}</strong>
                              <div style={{ display: 'inline-flex', gap: 8 }}>
                                <Button size='sm' onClick={()=>{ setEditTermId(t._id); setEditForm({ title: t.title||'', description: t.description||'', category: t.category||'General', order: t.order||0, active: !!t.active }); }}>Edit</Button>
                                <Button size='sm' color='danger' onClick={()=>deleteTerm(t._id)}>Delete</Button>
                              </div>
                            </div>
                            <div className='auth-label' style={{ marginTop: 6 }}>{t.description}</div>
                            <div className='auth-label' style={{ marginTop: 6, display: 'grid', gridTemplateColumns: 'repeat(3, auto)', gap: 12 }}>
                              <span>Category: {t.category}</span>
                              <span>Order: {t.order}</span>
                              <span>Status: {t.active ? 'Active' : 'Inactive'}</span>
                            </div>
                            {editTermId === t._id && (
                              <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px dashed #E5E7EB' }}>
                                <h6 className='auth-title' style={{ marginBottom: 8 }}>Edit Term</h6>
                                <label className='auth-label'>Title</label>
                                <Input value={editForm.title} onChange={(e)=>setEditForm({...editForm, title: e.target.value})} />
                                <label className='auth-label' style={{ marginTop: 8 }}>Description</label>
                                <Input type='textarea' rows={4} value={editForm.description} onChange={(e)=>setEditForm({...editForm, description: e.target.value})} />
                                <Row className='mt-2'>
                                  <Col>
                                    <label className='auth-label'>Category</label>
                                    <Input value={editForm.category} onChange={(e)=>setEditForm({...editForm, category: e.target.value})} />
                                  </Col>
                                  <Col>
                                    <label className='auth-label'>Order</label>
                                    <Input type='number' value={editForm.order} onChange={(e)=>setEditForm({...editForm, order: Number(e.target.value)||0})} />
                                  </Col>
                                </Row>
                                <div className='mt-2'>
                                  <label className='auth-label' style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                                    <input type='checkbox' checked={editForm.active} onChange={(e)=>setEditForm({...editForm, active: e.target.checked})} /> Active
                                  </label>
                                </div>
                                <div className='mt-2' style={{ display: 'inline-flex', gap: 8 }}>
                                  <Button style={{ background: '#065F46' }} size='sm' onClick={async()=>{ try { await updateTerm(t._id, editForm); setEditTermId(null); setTermMsg('Term updated'); } catch{} }}>Save</Button>
                                  <Button size='sm' color='secondary' onClick={()=>setEditTermId(null)}>Cancel</Button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </Col>
                </Row>
              </CardBody>
            </Card>
          )}

        </Col>
      </Row>



      {/* End main layout */}

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
