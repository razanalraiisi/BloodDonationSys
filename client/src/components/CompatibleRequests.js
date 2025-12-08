import { useEffect, useState } from "react";
import { Card, CardBody, Button } from "reactstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaHome } from "react-icons/fa";
import axios from "axios";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const CompatibleRequests = () => {
  const user = useSelector(state => state.users.user);
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  // Blood type compatibility map
  const bloodTypeMap = {
    "A+": ["A+", "AB+"],
    "A-": ["A+", "A-", "AB+", "AB-"],
    "B+": ["B+", "AB+"],
    "B-": ["B+", "B-", "AB+", "AB-"],
    "AB+": ["AB+"],
    "AB-": ["AB+", "AB-"],
    "O+": ["A+", "B+", "O+", "AB+"],
    "O-": ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
  };

  const userBlood = (user?.bloodType || "").trim().toUpperCase();

  useEffect(() => {
    axios.get("http://localhost:5000/request/all")
      .then(res => {
        const allRequests = res.data;

        if (Array.isArray(allRequests)) {
          const filtered = allRequests.filter(r => {
            const status = (r.status || "").trim().toLowerCase();
            // Exclude completed requests
            if (status === 'completed') return false;
            const reqBlood = (r.bloodType || "").trim().toUpperCase();
            return bloodTypeMap[userBlood]?.includes(reqBlood);
          });

          const sorted = filtered.sort((a, b) => {
            const levels = { "Critical": 3, "Urgent": 2, "Normal": 1 };
            return (levels[b.urgency?.trim()] || 0) - (levels[a.urgency?.trim()] || 0);
          });

          setRequests(sorted);
        }
      })
      .catch(err => {
        console.error("Error fetching requests:", err);
        setRequests([]);
      });
  }, [userBlood]);

  const urgencyColor = {
    "Critical": "#FF6B6B",
    "Urgent": "#FFA94D",
    "Normal": "#51CF66",
  };

  return (
    <div style={{ padding: 30, background: "#fff0f5", minHeight: "100vh" }}>
      <div style={{ marginBottom: 16 }}>
        <button
          onClick={() => navigate('/home')}
          title='Go to Home'
          style={{
            background: '#B3261E',
            color: '#fff',
            border: 'none',
            borderRadius: 50,
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: 20,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >
          <FaHome />
        </button>
      </div>
      <Button
        color="#B3261E"
        style={{ marginBottom: 20, borderRadius: 12 }}
        onClick={() => navigate("/centers")}
      >
        <FaArrowLeft />
      </Button>
      
      <div className="d-flex justify-content-center" style={{ marginBottom: 10 }}>
        <DotLottieReact
          src="https://lottie.host/2a844977-5b23-43a9-bd79-e3135f856d7e/usNkEVFNRt.lottie"
          loop
          autoplay
          style={{ width: 140, height: 140 }}
        />
      </div>
      <h2 style={{ color: "#B3261E", marginBottom: 25, textAlign: "center" }}>
        Compatible Blood Requests
      </h2>

      {requests.length === 0 && (
        <p style={{ textAlign: "center", fontSize: 18 }}>
          No compatible requests at the moment.
        </p>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
        {requests.map((req, index) => {
          const bgColor = urgencyColor[req.urgency?.trim()] || "#f0f0f0";

          return (
            <Card
              key={index}
              style={{
                width: 320,
                borderRadius: 20,
                background: bgColor,
                color: "#000",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                transition: "transform 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
            >
              <CardBody>
                <p><strong>Hospital File Number:</strong> {req.hospitalFileNumber}</p>
                <p><strong>Hospital Name:</strong> {req.hospital}</p>
                <p><strong>Blood Type:</strong> {req.bloodType}</p>
                <p><strong>Urgency Level:</strong> {req.urgency}</p>
                <p><strong>Units Needed:</strong> {req.bloodUnits}</p>
                <p><strong>Date Needed:</strong> {req.neededDate}</p>

                <Button
                  color="danger"
                  style={{ marginTop: 10, borderRadius: 12, width: '100%' }}
                  onClick={() => navigate("/donate", {
                    state: {
                      hospitalName: req.hospital,
                      hospitalFileNumber: req.hospitalFileNumber || '',
                      requestId: req._id,
                    }
                  })}
                >
                  Donate Now
                </Button>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CompatibleRequests;
