import { useState } from "react";
import { FormGroup, Label, Button } from "reactstrap";
import axios from "axios";

const RequestBlood = () => {

  const [mode, setMode] = useState("self");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [patientId, setPatientId] = useState("");
  const [hospitalFileNumber, setHospitalFileNumber] = useState("");
  const [relationship, setRelationship] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [bloodUnits, setBloodUnits] = useState("");
  const [reason, setReason] = useState("");
  const [hospital, setHospital] = useState("");
  const [urgency, setUrgency] = useState("Normal");
  const [neededDate, setNeededDate] = useState("");
  const [medicalReport, setMedicalReport] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const formData = new FormData();

      formData.append("userEmail", email);
      formData.append("patientName", fullName);
      formData.append("patientId", patientId);
      formData.append("hospitalFileNumber", hospitalFileNumber);
      formData.append("relationship", relationship);
      formData.append("bloodType", bloodType);
      formData.append("bloodUnits", bloodUnits || 0);
      formData.append("reason", reason);
      formData.append("hospital", hospital);
      formData.append("urgency", urgency);
      formData.append("neededDate", neededDate);
      formData.append("mode", mode);

      if (medicalReport) {
        formData.append("medicalReport", medicalReport);
      }

      await axios.post("http://localhost:5000/request/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("Request submitted successfully.");

      // Clear all inputs
      setFullName("");
      setEmail("");
      setPatientId("");
      setHospitalFileNumber("");
      setRelationship("");
      setBloodType("");
      setBloodUnits("");
      setReason("");
      setHospital("");
      setUrgency("Normal");
      setNeededDate("");
      setMedicalReport(null);

    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || "Submission failed";
      setError(msg);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Request Blood Form</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">

            {/* Request Type */}
            <FormGroup className="mb-3 col-span-2">
              <Label className="auth-label d-block">Request Type</Label>
              <Label className="me-3">
                <input
                  type="radio"
                  name="reqtype"
                  checked={mode === "self"}
                  onChange={() => setMode("self")}
                /> Self
              </Label>
              <Label>
                <input
                  type="radio"
                  name="reqtype"
                  checked={mode === "other"}
                  onChange={() => setMode("other")}
                /> Someone Else
              </Label>
            </FormGroup>

            <FormGroup className="mb-3">
              <Label>Email</Label>
              <input
                className="auth-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
              />
            </FormGroup>

            <FormGroup className="mb-3">
              <Label>Full Name</Label>
              <input
                className="auth-input"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Patient full name"
              />
            </FormGroup>

            <FormGroup className="mb-3">
              <Label>Patient ID</Label>
              <input
                className="auth-input"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                placeholder="Patient ID"
              />
            </FormGroup>

            <FormGroup className="mb-3">
              <Label>Hospital File Number</Label>
              <input
                className="auth-input"
                value={hospitalFileNumber}
                onChange={(e) => setHospitalFileNumber(e.target.value)}
                placeholder="Hospital File Number"
              />
            </FormGroup>

            {mode === "other" && (
              <FormGroup className="mb-3">
                <Label>Relationship to Patient</Label>
                <input
                  className="auth-input"
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  placeholder="Relationship"
                />
              </FormGroup>
            )}

            <FormGroup className="mb-3">
              <Label>Blood Type</Label>
              <select
                className="auth-input"
                value={bloodType}
                onChange={(e) => setBloodType(e.target.value)}
              >
                <option value="">Select</option>
                <option>O+</option>
                <option>O-</option>
                <option>A+</option>
                <option>A-</option>
                <option>B+</option>
                <option>B-</option>
                <option>AB+</option>
                <option>AB-</option>
              </select>
            </FormGroup>

            <FormGroup className="mb-3">
              <Label>Blood Units (optional)</Label>
              <input
                className="auth-input"
                type="number"
                min="1"
                max="10"
                value={bloodUnits}
                onChange={(e) => setBloodUnits(e.target.value)}
                placeholder="e.g., 2"
              />
            </FormGroup>

            <FormGroup className="mb-3">
              <Label>Date Required</Label>
              <input
                className="auth-input"
                type="date"
                value={neededDate}
                onChange={(e) => setNeededDate(e.target.value)}
              />
            </FormGroup>

            <FormGroup className="mb-3">
              <Label>Reason</Label>
              <input
                className="auth-input"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Reason"
              />
            </FormGroup>

            <FormGroup className="mb-3">
              <Label>Hospital Name</Label>
              <input
                className="auth-input"
                value={hospital}
                onChange={(e) => setHospital(e.target.value)}
                placeholder="Hospital"
              />
            </FormGroup>

            <FormGroup className="mb-3 col-span-2">
              <Label>Medical Report (optional)</Label>
              <input
                className="auth-input"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setMedicalReport(e.target.files?.[0] || null)}
              />
            </FormGroup>

            <FormGroup className="mb-3 col-span-2">
              <Label>Urgency</Label>
              <div>
                <label className="me-3">
                  <input type="radio" checked={urgency === "Normal"} onChange={() => setUrgency("Normal")} /> Normal
                </label>
                <label className="me-3">
                  <input type="radio" checked={urgency === "Urgent"} onChange={() => setUrgency("Urgent")} /> Urgent
                </label>
                <label>
                  <input type="radio" checked={urgency === "Critical"} onChange={() => setUrgency("Critical")} /> Critical
                </label>
              </div>
            </FormGroup>

            <div className="col-span-2">
              <Button className="auth-btn-primary w-100" type="submit">Submit</Button>
            </div>

            {message && <p style={{ color: "green" }}>{message}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestBlood;
