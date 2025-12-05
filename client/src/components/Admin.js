import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input
} from "reactstrap";
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
    try {
      const res = await axios.get("http://localhost:5000/request/all");
      setRequests(res.data);
    } catch (err) {
      console.log("Error loading requests:", err);
    }
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
  const toggleModal = () => setModal(!modal);

  const viewDetails = (req) => {
    setSelectedRequest(req);
    toggleModal();
  };

  const [search, setSearch] = useState("");

  const filteredRequests = requests.filter((r) => {
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
                    <th>Actions</th>
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

                      <td>
                        <Button size="sm" onClick={() => viewDetails(r)} className="admin-btn-view me-2">View</Button>

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
            <p><b>Patient Name:</b> {selectedRequest.patientName}</p>
            <p><b>User Email:</b> {selectedRequest.userEmail}</p>
            <p><b>Patient ID:</b> {selectedRequest.patientId}</p>
            <p><b>Hospital File No:</b> {selectedRequest.hospitalFileNumber}</p>
            <p><b>Relationship:</b> {selectedRequest.relationship}</p>
            <p><b>Blood Type:</b> {selectedRequest.bloodType}</p>
            <p><b>Units:</b> {selectedRequest.bloodUnits}</p>
            <p><b>Reason:</b> {selectedRequest.reason}</p>
            <p><b>Hospital:</b> {selectedRequest.hospital}</p>
            <p><b>Urgency:</b> {selectedRequest.urgency}</p>
            <p><b>Needed Date:</b> {selectedRequest.neededDate}</p>
            <p><b>Mode:</b> {selectedRequest.mode}</p>

            {selectedRequest.medicalReportPath && (
              <p>
                <b>Medical Report: </b>
                <a href={`http://localhost:5000/${selectedRequest.medicalReportPath}`} target="_blank">
                  Download
                </a>
              </p>
            )}
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
