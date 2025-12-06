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

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaUserAlt, FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/UserSlice';
import Logo from '../assets/logo.jpeg';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const user = useSelector((state)=>state.users.user);
    const [profileUrl, setProfileUrl] = useState('');
    const defPic = "https://i.pinimg.com/736x/b6/e6/87/b6e687094f11e465e7d710a6b5754a4e.jpg";
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const toggle = () => setIsOpen(!isOpen);
    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

    useEffect(() => {
        const email = user?.email || '';
        const key = email ? `profile.${email}.profileUrl` : null;
        try {
            const savedPic = key ? localStorage.getItem(key) : null;
            if (savedPic) setProfileUrl(savedPic);
            else setProfileUrl('');
        } catch {}
        const onProfileUpdated = () => {
            try {
                const updatedPic = key ? localStorage.getItem(key) : null;
                setProfileUrl(updatedPic || '');
            } catch {}
        };
        window.addEventListener('profile-updated', onProfileUpdated);
        return () => {
            window.removeEventListener('profile-updated', onProfileUpdated);
        };
    }, [user?.email]);

    return (
        <Navbar className="navigation" light expand="md" style={styles.navbar}>
            <NavbarBrand>
                <Link to="/">
                    <img src={Logo} width="75px" height="75px" alt="logo" />
                </Link>
                <h6 style={{ display: 'inline', color: '#B3261E', marginLeft: '10px', fontWeight: '700' }}>BloodLink</h6>
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
                            <DropdownItem style={styles.link} tag={Link} to="/compatibleRequests">Compatible Blood Request</DropdownItem>
                            <DropdownItem style={styles.link}tag={Link} to="/centers">Donation Centers</DropdownItem>
                            <DropdownItem style={styles.link} tag={Link} to="/info">Eligibility & Terms</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>

                    <NavItem>
                        <Link to="/AboutUs" style={styles.link}>About Us</Link>
                    </NavItem>

                    <NavItem>
                        <Link to="/UserProfile" style={{ ...styles.icon, display: 'flex', alignItems: 'center' }}>
                            <img
                                src={profileUrl || defPic}
                                alt="avatar"
                                style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', boxShadow: '0 2px 6px rgba(0,0,0,0.15)', border: '2px solid #fff' }}
                            />
                        </Link>
                    </NavItem>

                    <NavItem>
                                                {!user ? (
                                                        <Link to="/login" style={styles.icon}><FaSignInAlt /></Link>
                                                ) : (
                                                        <a
                                                            href="#"
                                                            style={styles.icon}
                                                            onClick={(e)=>{e.preventDefault(); dispatch(logout()); navigate('/login');}}
                                                            title="Logout"
                                                        >
                                                            <FaSignOutAlt />
                                                        </a>
                                                )}
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
