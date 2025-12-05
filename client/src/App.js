import './App.css';
import Login from './components/Login.js';
import Register from './components/Register.js';
import Home from './components/Home.js';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Container, Row } from 'reactstrap';
import Header from './components/Header.js';
import Footer from './components/Footer.js';
import RequestBlood from './components/RequestBlood.js';
import DonationCenter from './components/DonationCenter.js';
import DonateBlood from './components/DonateBlood.js';
import User from './components/User.js';
import AboutUs from './components/AboutUs.js';
import LandingPage from './components/LandingPage.js';
import EligibilityTerms from './components/EligibilityTerms.js';
import Admin from './components/Admin.js';
import AddCenter from './components/AddCenter.js';

function AppContent() {
  const location = useLocation();

  // Paths where header/footer should be hidden
  const hideOn = ["/", "/login", "/register", "/admin", "/add-center"]; 

  return (
    <Container fluid className='appBG'>
      <Row>
        {!hideOn.includes(location.pathname) && <Header />}
      </Row>

      <Row>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/request" element={<RequestBlood />} />
          <Route path="/centers" element={<DonationCenter />} />
          <Route path="/donate" element={<DonateBlood />} />
          <Route path="/info" element={<EligibilityTerms />} />
          <Route path="/UserProfile" element={<User />} />
          <Route path="/AboutUs" element={<AboutUs />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/add-center" element={<AddCenter />} />
        </Routes>
      </Row>

      <Row>
        {!hideOn.includes(location.pathname) && <Footer />}
      </Row>
    </Container>
  );
}


function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
