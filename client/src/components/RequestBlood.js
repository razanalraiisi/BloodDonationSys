import { useState, useEffect } from "react";
import { FormGroup, Label, Button } from "reactstrap";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../features/UserSlice"; // adjust path if needed

const RequestBlood = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.users.user);

  const [mode, setMode] = useState("self");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [bloodType, setBloodType] = useState("");

  const [patientId, setPatientId] = useState("");
  const [hospitalFileNumber, setHospitalFileNumber] = useState("");
  const [relationship, setRelationship] = useState("");

  const [bloodUnits, setBloodUnits] = useState("");
  const [reason, setReason] = useState("");
  const [hospital, setHospital] = useState("");

  const [urgency, setUrgency] = useState("Normal");
  const [neededDate, setNeededDate] = useState("");

  const [medicalReport, setMedicalReport] = useState(null);

  const [hospitalList, setHospitalList] = useState([]);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");


  // ⭐ Load user profile from DB after login
  useEffect(() => {
    if (user?.email) {
      dispatch(getProfile(user.email));
    }
  }, [dispatch, user?.email]);

  // ⭐ Load hospital centers
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/donation-centers");
        setHospitalList(res.data);
      } catch (err) {
        console.error("Error fetching donation centers:", err);
      }
    };
    fetchHospitals();
  }, []);

  // ⭐ Autofill for "self"
  useEffect(() => {
    if (mode === "self" && user) {
      setFullName(user.fullName || "");
      setEmail(user.email || "");
      setBloodType(user.bloodType || "");
    }
  }, [mode, user]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    console.log("DEBUG SUBMIT:", {
      userEmail: email,
      patientName: fullName,
      bloodType,
      hospital,
      neededDate,
      mode,
    });

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
      formData.append("neededDate", neededDate); // FIXED 💥
      formData.append("mode", mode);

      if (medicalReport) {
        formData.append("medicalReport", medicalReport);
      }

      await axios.post("http://localhost:5000/request/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("Request submitted successfully.");

      // Reset only optional fields – NOT autofill fields
      setPatientId("");
      setHospitalFileNumber("");
      setRelationship("");
      setBloodUnits("");
      setReason("");
      setHospital("");
      setUrgency("Normal");
      setNeededDate(""); // now this resets correctly
      setMedicalReport(null);

    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Submission failed");
    }
  };


  return (
    <div className="auth-page" style={{ position: "relative" }}>

      {/* ⭐ Fixed Back Button */}
      <button
        onClick={() => navigate("/home")}
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          background: "none",
          border: "none",
          color: "#B3261E",
          fontWeight: "600",
          display: "flex",
          alignItems: "center",
          fontSize: "16px",
          cursor: "pointer",
          zIndex: 10,
        }}
      >
        <FaArrowLeft size={18} style={{ marginRight: "6px" }} />
        Back
      </button>

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
                  checked={mode === "self"}
                  onChange={() => setMode("self")}
                /> Self
              </Label>

              <Label>
                <input
                  type="radio"
                  checked={mode === "other"}
                  onChange={() => setMode("other")}
                /> Someone Else
              </Label>
            </FormGroup>

            {/* Email */}
            <FormGroup className="mb-3">
              <Label>Email</Label>
              <input
                className="auth-input"
                value={email}
                readOnly={mode === "self"}   // submits properly
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormGroup>

            {/* Full Name */}
            <FormGroup className="mb-3">
              <Label>Full Name</Label>
              <input
                className="auth-input"
                value={fullName}
                readOnly={mode === "self"}
                onChange={(e) => setFullName(e.target.value)}
              />
            </FormGroup>

            {/* Patient ID */}
            <FormGroup className="mb-3">
              <Label>Patient ID</Label>
              <input
                className="auth-input"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
              />
            </FormGroup>

            {/* Hospital File Number */}
            <FormGroup className="mb-3">
              <Label>Hospital File Number</Label>
              <input
                className="auth-input"
                value={hospitalFileNumber}
                onChange={(e) => setHospitalFileNumber(e.target.value)}
              />
            </FormGroup>

            {/* Relationship (if other) */}
            {mode === "other" && (
              <FormGroup className="mb-3">
                <Label>Relationship to Patient</Label>
                <input
                  className="auth-input"
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                />
              </FormGroup>
            )}

            {/* Blood Type */}
            <FormGroup className="mb-3">
              <Label>Blood Type</Label>
              <select
                className="auth-input"
                value={bloodType}
                readOnly={mode === "self"}
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

            {/* Hospital */}
            <FormGroup className="mb-3">
              <Label>Hospital Name</Label>
              <select
                className="auth-input"
                value={hospital}
                onChange={(e) => setHospital(e.target.value)}
              >
                <option value="">Select Hospital</option>
                {hospitalList.map((center) => (
                  <option key={center._id} value={center.name}>
                    {center.name}
                  </option>
                ))}
              </select>
            </FormGroup>

            {/* Date Required */}
            <FormGroup className="mb-3">
              <Label>Date Required</Label>
              <input
                type="date"
                className="auth-input"
                value={neededDate}
                onChange={(e) => {
                  console.log("DATE SELECTED:", e.target.value);
                  setNeededDate(e.target.value);
                }}
                required
              />
            </FormGroup>

            {/* Reason */}
            <FormGroup className="mb-3">
              <Label>Reason</Label>
              <input
                className="auth-input"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </FormGroup>

            {/* Medical Report */}
            <FormGroup className="mb-3 col-span-2">
              <Label>Medical Report (optional)</Label>
              <input
                className="auth-input"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setMedicalReport(e.target.files?.[0] || null)}
              />
            </FormGroup>

            {/* Urgency */}
            <FormGroup className="mb-3 col-span-2">
              <Label>Urgency</Label>
              <div>
                <label className="me-3">
                  <input
                    type="radio"
                    checked={urgency === "Normal"}
                    onChange={() => setUrgency("Normal")}
                  /> Normal
                </label>
                <label className="me-3">
                  <input
                    type="radio"
                    checked={urgency === "Urgent"}
                    onChange={() => setUrgency("Urgent")}
                  /> Urgent
                </label>
                <label>
                  <input
                    type="radio"
                    checked={urgency === "Critical"}
                    onChange={() => setUrgency("Critical")}
                  /> Critical
                </label>
              </div>
            </FormGroup>

            <div className="col-span-2">
              <Button className="auth-btn-primary w-100" type="submit">
                Submit
              </Button>
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
