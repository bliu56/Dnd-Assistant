import { Nav, Navbar, NavDropdown, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import './NavigationBar.css';
import {SidebarData} from './SidebarData.js';

import * as BsIcons from "react-icons/bs";

function NavigationBar(){

    const [sidebar, setsidebar] = useState(false);

    const showSidebar = () => setsidebar(!sidebar);

    return(
        <>
            <Navbar bg="myGray" variant='dark' className='navbar'>
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link href="#" onClick={showSidebar}><BsIcons.BsArrowBarRight/></Nav.Link>
                </Nav>
                <Nav className="left-nav">
                        <BsIcons.BsFillGearFill/>
                </Nav>  
                </Navbar.Collapse>
            </Navbar>
            
            <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
                <ul className='nav-menu-items' onClick={showSidebar}>
                    <li className='navbar-toggle'>
                    <Link to='#' className='menu-bars'>
                        <BsIcons.BsArrowBarLeft/>
                    </Link>
                    </li>
                    {SidebarData.map((item, index) => {
                    return (
                        <li key={index} className={item.cName}>
                        <Link to={item.path}>
                            {item.icon}
                            <span>{item.title}</span>
                        </Link>
                        </li>
                    );
                    })}
                </ul>
            </nav>
        </>
    );
}

export default NavigationBar