import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    NavbarText,
} from 'reactstrap';
import { useState } from 'react';
import Logo from '../assets/logoimg.jpg';
import { Link } from 'react-router-dom';
import { FaHome, FaUserAlt, FaSignInAlt } from "react-icons/fa";

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);
    return (
        <>
            <Navbar className='navigation' light expand='md'>
                <NavbarBrand>
                    <img src={Logo} width="150px" height="75px"/>
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
                    </Nav>
                </Collapse>
            </Navbar>
        </>
    )
}
export default Header;