import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
} from 'reactstrap';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUserAlt, FaSignInAlt } from "react-icons/fa";
import Logo from '../assets/logo.jpeg';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);

    return (
        <>
            <Navbar className='navigation' light expand='md' style={styles.navbar}>
                <NavbarBrand>
                    <img src={Logo} width="150px" height="75px" alt="logo" />
                </NavbarBrand>

                <NavbarToggler onClick={toggle} />

                <Collapse isOpen={isOpen} navbar>
                    <Nav className="ms-auto" navbar>

                        <NavItem className='navs'>
                            <Link to="/"><FaHome /></Link>
                        </NavItem>

                        <NavItem className='navs'>
                            <Link to="/request">Request Blood</Link>
                        </NavItem>

                        <NavItem className='navs'>
                            <Link to="/user"><FaUserAlt /></Link>
                        </NavItem>
                        <NavItem className='navs'>
                            <Link to="/login"><FaSignInAlt /></Link>
                        </NavItem>

                        <NavItem className='navs'>
                            <Link to="/about" style={styles.link}>About Us</Link>
                        </NavItem>

                    </Nav>
                </Collapse>
            </Navbar>
        </>
    );
};

export default Header;

const styles = {
    navbar: {
        backgroundColor: "#FDF4F4",
        borderBottom: "2px solid #E19E9C",
        padding: "10px 20px",
    },
    link: {
        textDecoration: "none",
        marginRight: "20px",
        color: "#B3261E",
        fontWeight: "600",
        fontSize: "16px",
    }
};
