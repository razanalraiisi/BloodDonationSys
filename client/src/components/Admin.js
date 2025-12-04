import { Container, Row, Col, Card, CardBody, Button, Table, Modal, ModalHeader, ModalBody, ModalFooter, Input } from "reactstrap";
import { useState, useEffect } from "react";
import Footer from "./Footer";
import axios from "axios";

const Admin = () => {

  // -------------------------
  // 1. STATS (STATIC FOR NOW)
  // -------------------------
  const [stats] = useState({
    activeDonors: 1000,
    livesSaved: 3700,
    unitsAvailable: 100,
    centers: 12,
  });

  // -------------------------
  // 2. REQUESTS STATE (NEEDED)
  // -------------------------
  const [requests, setRequests] = useState([]);

  // -------------------------
  // 3. LOAD REQUESTS FUNCTION
  // -------------------------
  const loadRequests = async () => {
    try {
      const res = await axios.get("http://localhost:5000/request/all");
      setRequests(res.data); // store the requests
    } catch (err) {
      console.log("Error loading requests:", err);
    }
  };

  // Load requests on page load
  useEffect(() => {
    loadRequests();
  }, []);

  // -------------------------
  // 4. APPROVE REQUEST
  // -------------------------
  const approve = async (id) => {
    await axios.post("http://localhost:5000/request/approve", { id });
    loadRequests(); // refresh table
  };

  // -------------------------
  // 5. REJECT REQUEST
  // -------------------------
  const reject = async (id) => {
    await axios.post("http://localhost:5000/request/reject", { id });
    loadRequests(); // refresh table
  };

  // -------------------------
  // 6. DONORS & CENTERS STATIC DATA
  // -------------------------
  const [donors] = useState([
    { id: 1, name: "Sara Salim", bloodType: "O+", city: "Muscat", totalDonations: 30, lastDonation: "2025-10-05" },
    { id: 2, name: "Hassan Ali", bloodType: "B+", city: "Seeb", totalDonations: 12, lastDonation: "2025-08-22" },
  ]);

  const [centers] = useState([
    { id: 1, name: "Royal Hospital", phone: "22334455", city: "Muscat", hours: "24/7" },
    { id: 2, name: "Sultan Qaboos Hospital", phone: "99887766", city: "Seeb", hours: "8am - 5pm" },
  ]);

  // -------------------------
  // 7. MODAL HANDLING
  // -------------------------
  const [modal, setModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const toggleModal = () => setModal(!modal);

  const viewDetails = (req) => {
    setSelectedRequest(req);
    toggleModal();
  };

  const [search, setSearch] = useState("");

  // -------------------------
  // 8. SEARCH FILTER
  // -------------------------
  const filteredRequests = requests.filter((r) => {
    if (!search) return true;

    return (
      r.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      r.bloodType?.toLowerCase().includes(search.toLowerCase()) ||
      r.hospital?.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <Container fluid>
      <Row className="mt-4">
        <Col><h2 className="admin-title">Admin Dashboard</h2></Col>
      </Row>

      {/* STATS */}
      <Row className="mt-4 justify-content-center">
        {[{
          label: "Active Donors",
          value: stats.activeDonors
        }, {
          label: "Lives Saved",
          value: stats.livesSaved
        }, {
          label: "Units Available",
          value: stats.unitsAvailable
        }, {
          label: "Donation Centers",
          value: stats.centers
        }].map((s, i) => (
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

      {/* SEARCH */}
      <Row className="mt-5 justify-content-center">
        <Col md="4">
          <Input
            placeholder="Search requests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
      </Row>

      {/* REQUESTS TABLE */}
      <Row className="mt-4 justify-content-center">
        <Col md="10">
          <Card className="info-card">
            <CardBody>
              <h4 className="admin-section-title">Blood Requests</h4>

              <Table bordered responsive className="admin-table mt-3">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Blood Type</th>
                    <th>Hospital</th>
                    <th>Date Required</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredRequests.map((r) => (
                    <tr key={r._id}>
                      <td>{r._id}</td>
                      <td>{r.fullName}</td>
                      <td>{r.bloodType}</td>
                      <td>{r.hospital}</td>
                      <td>{r.dateReq}</td>
                      <td>{r.status}</td>

                      <td>
                        <Button size="sm" className="admin-btn-view me-2" onClick={() => viewDetails(r)}>View</Button>

                        {r.status === "Pending" && (
                          <>
                            <Button size="sm" className="admin-btn-approve me-2" onClick={() => approve(r._id)}>Approve</Button>
                            <Button size="sm" className="admin-btn-reject" onClick={() => reject(r._id)}>Reject</Button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* DONORS + CENTERS */}
      <Row className="mt-5 justify-content-center">
        <Col md="5">
          <Card className="info-card">
            <CardBody>
              <h4>Registered Donors</h4>
              {donors.map((d) => (
                <div key={d.id} className="admin-list-item">
                  <b>{d.name}</b> ({d.bloodType})<br />
                  {d.city} — Donations: {d.totalDonations}
                </div>
              ))}
            </CardBody>
          </Card>
        </Col>

        <Col md="5">
          <Card className="info-card">
            <CardBody>
              <h4>Donation Centers</h4>
              {centers.map((c) => (
                <div key={c.id} className="admin-list-item">
                  <b>{c.name}</b><br />
                  {c.city} — {c.hours} — {c.phone}
                </div>
              ))}
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Footer />

      {/* MODAL */}
      {selectedRequest && (
        <Modal isOpen={modal} toggle={toggleModal}>
          <ModalHeader toggle={toggleModal}>Request Details</ModalHeader>
          <ModalBody>
            <p><b>Name:</b> {selectedRequest.fullName}</p>
            <p><b>Blood Type:</b> {selectedRequest.bloodType}</p>
            <p><b>Hospital:</b> {selectedRequest.hospital}</p>
            <p><b>Date Required:</b> {selectedRequest.dateReq}</p>
            <p><b>Urgency:</b> {selectedRequest.urgency}</p>
            <p><b>Status:</b> {selectedRequest.status}</p>
          </ModalBody>

          <ModalFooter>
            <Button color="secondary" onClick={toggleModal}>Close</Button>
          </ModalFooter>
        </Modal>
      )}
    </Container>
  );
};

export default Admin;
