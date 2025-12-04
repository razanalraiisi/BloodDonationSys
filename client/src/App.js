import './App.css';
import Login from './components/Login.js';
import Register from './components/Register.js';
import Home from './components/Home.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container, Row } from 'reactstrap';
import Header from './components/Header.js';
import { useSelector } from 'react-redux';
import Footer from './components/Footer.js';
<<<<<<< HEAD
import DonationCenter from './components/DonationCenter.js';
import Admin from './components/Admin';
=======
import RequestBlood from './components/RequestBlood.js';
>>>>>>> a012894 (Added theme.css)

function App() {
  const email=useSelector((state)=>state.users.user.email);
  return (
    <Container fluid className='appBG'>
      <Router>
        <Row>
          <Header/>
        </Row>
        <Row>
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
<<<<<<< HEAD
          <Route path="/map" element={<DonationCenter />} />
          <Route path="/admin" element={<Admin />} />
=======
          <Route path="/request" element={<RequestBlood />} />
>>>>>>> a012894 (Added theme.css)
        </Routes>
        </Row>
        <Row>
          <Footer/>
        </Row>
      </Router>
    </Container>
  );
}

export default App;
