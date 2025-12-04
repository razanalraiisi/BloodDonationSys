import { Container, Row, Col, Card, CardBody, Button, Table, Modal, ModalHeader, ModalBody, ModalFooter, Input } from "reactstrap";
import Footer from "./Footer";
import axios from "axios";
import { useState, useEffect } from "react";

const Admin = () => {
  const [stats] = useState({
    activeDonors: 1000,
    livesSaved: 3700,
    unitsAvailable: 100,
    centers: 12,
  });

  const [requests, setRequests] = useState([]);

  const loadRequests = async () => {
    const res = await axios.get("http://localhost:5000/request/all");
    setRequests(res.data);
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const approve = async (id) => {
    await axios.post("http://localhost:5000/request/approve", { id });
    loadRequests();
  };

  const reject = async (id) => {
    await axios.post("http://localhost:5000/request/reject", { id });
    loadRequests();
  };

  const [modal, setModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [search, setSearch] = useState("");

  const toggleModal = () => setModal(!modal);

  const viewDetails = (req) => {
    setSelectedRequest(req);
    toggleModal();
  };

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
        <Col>
          <h2 className="admin-title">Admin Dashboard</h2>
        </Col>
      </Row>

      {/* Stats */}
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

      <Footer />

      {/* Modal */}
      {selectedRequest && (
        <Modal isOpen={modal} toggle={toggleModal}>
          <ModalHeader toggle={toggleModal}>Request Details</ModalHeader>
          <ModalBody>
            <p><b>Name:</b> {selectedRequest.fullName}</p>
            <p><b>Blood Type:</b> {selectedRequest.bloodType}</p>
            <p><b>Hospital:</b> {selectedRequest.hhospital}</p>
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
