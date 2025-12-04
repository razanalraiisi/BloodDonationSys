import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from 'reactstrap';

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUserAlt, FaSignInAlt } from "react-icons/fa";
import Logo from '../assets/logo.jpeg';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);
    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

    return (
        <Navbar className="navigation" light expand="md" style={styles.navbar}>
            <NavbarBrand>
                <Link to="/">
                    <img src={Logo} width="75px" height="75px" alt="logo" />
                    <h6 style={{ display: 'inline', color: '#B3261E', marginLeft: '10px', fontWeight: '700' }}>BloodLink</h6>
                </Link>
            </NavbarBrand>

            <NavbarToggler onClick={toggle} />

            <Collapse isOpen={isOpen} navbar>
                <Nav className="ms-auto align-items-center" navbar>

                    
                    <Dropdown nav isOpen={dropdownOpen} toggle={toggleDropdown}>
                        <DropdownToggle nav caret style={styles.link}>
                            Services
                        </DropdownToggle>

                        <DropdownMenu>
                            <DropdownItem style={styles.link} tag={Link} to="/request">Request Blood</DropdownItem>
                            <DropdownItem style={styles.link} tag={Link} to="/donate">Donate Blood</DropdownItem>
                            <DropdownItem style={styles.link}tag={Link} to="/centers">Donation Centers</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>

                    <NavItem>
                        <Link to="/AboutUs" style={styles.link}>About Us</Link>
                    </NavItem>

                    <NavItem>
                        <Link to="/login" style={styles.icon}><FaSignInAlt /></Link>
                    </NavItem>

                    <NavItem>
                        <Link to="/UserProfile" style={styles.icon}><FaUserAlt /></Link>
                    </NavItem>

                </Nav>
            </Collapse>
        </Navbar>
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
        marginRight: "25px",
        color: "#B3261E",
        fontWeight: "600",
        fontSize: "16px",
        cursor: "pointer",
    },
    icon: {
        color: "#B3261E",
        fontSize: "20px",
        marginLeft: "15px",
    }
};
