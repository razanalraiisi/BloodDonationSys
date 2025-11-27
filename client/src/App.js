import './App.css';
import Login from './components/Login.js';
import Register from './components/Register.js';
import Home from './components/Home.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container, Row } from 'reactstrap';
import Header from './components/Header.js';
import { useSelector } from 'react-redux';
import Footer from './components/Footer.js';
import DonationCenter from './components/DonationCenter.js';

function App() {
  const email=useSelector((state)=>state.users.user.email);
  return (
    <Container fluid className='appBG'>
      <Router>
        <Row>
          {email?<Header/>:null}
        </Row>
        <Row>
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/map" element={<DonationCenter />} />
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
