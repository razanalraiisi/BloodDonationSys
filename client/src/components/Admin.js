import { Container, Row, Col, Card, CardBody, Button, Table, Modal, ModalHeader, ModalBody, ModalFooter, Input } from "reactstrap";
import { useState } from "react";
import Footer from "./Footer";

const Admin = () => {
  const [stats] = useState({
    activeDonors: 1000,
    livesSaved: 3700,
    unitsAvailable: 100,
    centers: 12,
  });

  const [requests, setRequests] = useState([
    { id: 1, name: "Ali Mohammed", bloodType: "O+", hospital: "Royal Hospital", urgency: "Urgent", dateRequired: "2025-12-18", status: "Pending" },
    { id: 2, name: "Fatima Said", bloodType: "A-", hospital: "SQH", urgency: "Normal", dateRequired: "2025-12-25", status: "Approved" },
  ]);

  const [donors] = useState([
    { id: 1, name: "Sara Salim", bloodType: "O+", city: "Muscat", totalDonations: 30, lastDonation: "2025-10-05" },
    { id: 2, name: "Hassan Ali", bloodType: "B+", city: "Seeb", totalDonations: 12, lastDonation: "2025-08-22" },
  ]);

  const [centers] = useState([
    { id: 1, name: "Royal Hospital", phone: "22334455", city: "Muscat", hours: "24/7" },
    { id: 2, name: "Sultan Qaboos Hospital", phone: "99887766", city: "Seeb", hours: "8am - 5pm" },
  ]);

  const [modal, setModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [search, setSearch] = useState("");

  const toggleModal = () => setModal(!modal);

  const viewDetails = (req) => {
    setSelectedRequest(req);
    toggleModal();
  };

  const approve = (id) => {
    setRequests((prev) => prev.map((x) => x.id === id ? { ...x, status: "Approved" } : x));
  };

  const reject = (id) => {
    setRequests((prev) => prev.map((x) => x.id === id ? { ...x, status: "Rejected" } : x));
  };

  const filteredRequests = requests.filter((r) => {
    if (!search) return true;
    return (
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.bloodType.toLowerCase().includes(search.toLowerCase()) ||
      r.hospital.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <Container fluid>
      <Row className="mt-4">
        <Col>
          <h2 className="admin-title">Admin Dashboard</h2>
        </Col>
      </Row>

      {/* Stats */}
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

      {/* Search */}
      <Row className="mt-5 justify-content-center">
        <Col md="4">
          <Input
            className="admin-search-input"
            placeholder="Search requests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
      </Row>

      {/* Requests Table */}
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
                    <tr key={r.id}>
                      <td>{r.id}</td>
                      <td>{r.name}</td>
                      <td>{r.bloodType}</td>
                      <td>{r.hospital}</td>
                      <td>{r.dateRequired}</td>
                      <td>{r.status}</td>
                      <td>
                        <Button size="sm" className="admin-btn-view me-2" onClick={() => viewDetails(r)}>View</Button>
                        {r.status === "Pending" && (
                          <>
                            <Button size="sm" className="admin-btn-approve me-2" onClick={() => approve(r.id)}>Approve</Button>
                            <Button size="sm" className="admin-btn-reject" onClick={() => reject(r.id)}>Reject</Button>
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

      {/* Donors & Centers */}
      <Row className="mt-5 justify-content-center">
        <Col md="5">
          <Card className="info-card">
            <CardBody>
              <h4 className="admin-section-title">Registered Donors</h4>
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
              <h4 className="admin-section-title">Donation Centers</h4>
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

      {/* Modal */}
      {selectedRequest && (
        <Modal isOpen={modal} toggle={toggleModal}>
          <ModalHeader toggle={toggleModal}>Request Details</ModalHeader>
          <ModalBody>
            <p><b>Name:</b> {selectedRequest.name}</p>
            <p><b>Blood Type:</b> {selectedRequest.bloodType}</p>
            <p><b>Hospital:</b> {selectedRequest.hospital}</p>
            <p><b>Date Required:</b> {selectedRequest.dateRequired}</p>
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
