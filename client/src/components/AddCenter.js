import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Input,
  Label,
  FormGroup,
  Navbar,
  NavbarBrand
} from "reactstrap";
import Footer from "./Footer";
import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/UserSlice';
import { FaSignOutAlt, FaArrowLeft, FaSignInAlt } from "react-icons/fa";
import Logo from '../assets/logo.jpeg';

const AddCenter = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.users.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const [centerForm, setCenterForm] = useState({
    name: "",
    address: "",
    contact: "",
    openingHours: "24/7",
    lat: "",
    lng: "",
    type: "Donation Center",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setCenterForm({ ...centerForm, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); 
  };

  const validate = () => {
    const newErrors = {};

    if (!centerForm.name.trim()) newErrors.name = "Name is required";
    if (!centerForm.address.trim()) newErrors.address = "Address is required";

    // Phone validation: starts with 2, 7, or 9
    if (!/^[279]\d{7}$/.test(centerForm.contact)) {
      newErrors.contact = "Contact must start with 2, 7, or 9 and be 8 digits";
    }

    if (!centerForm.lat || isNaN(centerForm.lat)) newErrors.lat = "Latitude must be a number";
    if (!centerForm.lng || isNaN(centerForm.lng)) newErrors.lng = "Longitude must be a number";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitCenter = async () => {
    if (!validate()) return;

    try {
      const payload = {
        ...centerForm,
        lat: Number(centerForm.lat),
        lng: Number(centerForm.lng)
      };

      const res = await axios.post("https://blooddonationsys.onrender.com/center/add", payload);

      // Show success message only if backend saved the center
      if (res.status === 200 && res.data.message === "Center added") {
        setSuccessMessage("✅ Donation center added successfully!");
        // Clear form
        setCenterForm({
          name: "",
          address: "",
          contact: "",
          openingHours: "24/7",
          lat: "",
          lng: "",
          type: "Donation Center",
        });
        // Auto-hide after 5 seconds
        setTimeout(() => setSuccessMessage(""), 5000);
      }

    } catch (err) {
      console.log(err);
      setErrors({ submit: "Failed to add donation center" });
    }
  };

  return (
    <Container fluid>
      {/* Navbar */}
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

      {/* Form */}
      <Row className="mt-4 justify-content-center">
        <Col md="6">
          <Card className="info-card">
            <CardBody>
              {/* Back Icon inside form */}
              <div style={{ position: "relative" }}>
                <FaArrowLeft 
                  size={20} 
                  color="#B3261E" 
                  style={{ cursor: "pointer", position: "absolute", top: "0", left: "0" }} 
                  onClick={() => navigate("/admin")} 
                />
                <h4 className="admin-section-title mb-4" style={{ textAlign: "center" }}>
                  Add Donation Center
                </h4>
              </div>

              {[ 
                { label: "Name", name: "name", type: "text", placeholder: "Center Name" },
                { label: "Address", name: "address", type: "text", placeholder: "Address" },
                { label: "Contact Number", name: "contact", type: "text", placeholder: "Contact Number" },
                { label: "Opening Hours", name: "openingHours", type: "text", placeholder: "e.g. 9:00 AM - 5:00 PM" },
                { label: "Latitude", name: "lat", type: "text", placeholder: "Latitude" },
                { label: "Longitude", name: "lng", type: "text", placeholder: "Longitude" }
              ].map(field => (
                <FormGroup key={field.name} className="d-flex align-items-center mb-3">
                  <Label style={{ width: "30%", fontWeight: "bold", marginBottom: 0 }}>
                    {field.label}:
                  </Label>
                  <div style={{ width: "70%" }}>
                    <Input
                      type={field.type}
                      name={field.name}
                      value={centerForm[field.name]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                    />
                    {errors[field.name] && (
                      <div style={{ color: "red", fontSize: "0.9rem", marginTop: "2px" }}>
                        {errors[field.name]}
                      </div>
                    )}
                  </div>
                </FormGroup>
              ))}

              {/* Type Selector */}
              <FormGroup className="d-flex align-items-center mb-3">
                <Label style={{ width: "30%", fontWeight: "bold", marginBottom: 0 }}>Type:</Label>
                <div style={{ width: "70%" }}>
                  <Input
                    type="select"
                    name="type"
                    value={centerForm.type}
                    onChange={handleChange}
                  >
                    <option>Donation Center</option>
                    <option>Hospital</option>
                  </Input>
                </div>
              </FormGroup>

              {errors.submit && (
                <div style={{ color: "red", marginBottom: "10px" }}>{errors.submit}</div>
              )}

              <Button
                style={{
                  backgroundColor: "#B3261E", 
                  borderColor: "#B3261E",
                  width: "100%"
                }}
                onClick={submitCenter}
              >
                Add Center
              </Button>

              {/* Success message */}
              {successMessage && (
                <div style={{ 
                  color: "#155724", 
                  backgroundColor: "#d4edda", 
                  border: "1px solid #c3e6cb", 
                  padding: "10px", 
                  borderRadius: "5px", 
                  marginTop: "10px", 
                  textAlign: "center" 
                }}>
                  {successMessage}
                </div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Footer />
    </Container>
  );
};

export default AddCenter;

const styles = {
  navbar: {
    backgroundColor: "#FDF4F4",
    borderBottom: "2px solid #E19E9C",
    padding: "10px 20px",
    justifyContent: "space-between"
  }
};
