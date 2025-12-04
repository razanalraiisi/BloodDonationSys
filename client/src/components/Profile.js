import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Container, Row, Col, FormGroup, Label, Button } from "reactstrap";

const Profile = () => {
  const user = useSelector((state) => state.users.user); 
  const [profile, setProfile] = useState(null);

  // Load profile data from backend
  useEffect(() => {
    const fetchProfile = async () => {
      const res = await axios.post("http://localhost:5000/profile", {
        email: user.email
      });
      setProfile(res.data);
    };

    fetchProfile();
  }, [user.email]);

  if (!profile) return <p>Loading profile...</p>;

  // Save profile changes
  const updateProfile = async (e) => {
    e.preventDefault();

    await axios.post("http://localhost:5000/updateProfile", {
      email: user.email,
      fullName: profile.fullName,
      city: profile.city,
      bloodType: profile.bloodType,
      medicalHistory: profile.medicalHistory,
      dob: profile.dob,
      gender: profile.gender
    });

    alert("Profile updated successfully!");
  };

  return (
    <Container>
      <Row className="div-row">
        <Col md="6" className="div-col">
          <form className="div-form" onSubmit={updateProfile}>
            <h2>Your Profile</h2>

            {/* FULL NAME */}
            <FormGroup>
              <Label>Full Name</Label>
              <input
                className="form-control"
                type="text"
                value={profile.fullName}
                onChange={(e) =>
                  setProfile({ ...profile, fullName: e.target.value })
                }
              />
            </FormGroup>

            {/* EMAIL (read-only) */}
            <FormGroup>
              <Label>Email</Label>
              <input className="form-control" type="email" value={profile.email} disabled />
            </FormGroup>

            {/* BLOOD TYPE */}
            <FormGroup>
              <Label>Blood Type</Label>
              <select
                className="form-control"
                value={profile.bloodType}
                onChange={(e) =>
                  setProfile({ ...profile, bloodType: e.target.value })
                }
              >
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

            {/* DOB */}
            <FormGroup>
              <Label>Date of Birth</Label>
              <input
                className="form-control"
                type="date"
                value={profile.dob}
                onChange={(e) =>
                  setProfile({ ...profile, dob: e.target.value })
                }
              />
            </FormGroup>

            {/* CITY */}
            <FormGroup>
              <Label>City</Label>
              <input
                className="form-control"
                type="text"
                value={profile.city}
                onChange={(e) =>
                  setProfile({ ...profile, city: e.target.value })
                }
              />
            </FormGroup>

            {/* GENDER */}
            <FormGroup>
              <Label>Gender</Label>
              <select
                className="form-control"
                value={profile.gender}
                onChange={(e) =>
                  setProfile({ ...profile, gender: e.target.value })
                }
              >
                <option>Female</option>
                <option>Male</option>
                <option>Other</option>
              </select>
            </FormGroup>

            {/* MEDICAL HISTORY */}
            <FormGroup>
              <Label>Medical History (optional)</Label>
              <textarea
                className="form-control"
                value={profile.medicalHistory}
                onChange={(e) =>
                  setProfile({ ...profile, medicalHistory: e.target.value })
                }
              />
            </FormGroup>

            {/* SUBMIT BUTTON */}
            <Button className="form-control" color="dark" type="submit">
              Save Changes
            </Button>

          </form>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
