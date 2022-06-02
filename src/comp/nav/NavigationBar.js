import 'bootstrap/dist/css/bootstrap.min.css';
import { Nav, Navbar, Fade, Offcanvas} from 'react-bootstrap';

import * as BsIcons from "react-icons/bs";

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { auth } from '../../firebase-config';
import { onAuthStateChanged, signOut } from 'firebase/auth'

import DiceOffCanvas from '../DiceOffCanvas.js';
import {SidebarData} from './SidebarData.js';
import './NavigationBar.css';
import '../../App.js'


function NavigationBar(){

    //Toggles the sidebar, True means that it is shown, false means that it is hidden
    const [sidebar, setsidebar] = useState(false);

    //Toggles the settings, True means that the settings are shown, false means that it is hidden
    const [settings, setSettings] = useState(false);

    //Toggles wheather it is a Login or Logout button. False means that they are not logined yet.
    const [canLogout, setCanLogout] = useState(false);

    //Toggles the dice offcanvas
    const [dicecanvas, setdicecanvas] = useState(false);

    //Function that handles the sidebar
    const showSidebar = () => setsidebar(!sidebar);

    //Function that handles the settings
    const showSettings = () => setSettings(!settings);

    //Function that handles the dice offcanvas
    const toggleDiceCanvas = () => setdicecanvas((s) => !s);

    //Allows navigation to other pages
    const navigate = useNavigate();

    //Function to logout
    const logout = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
            alert('Logged Out');
            navigate('/');
        }).catch((error) => {
        // An error happened.
            alert('Failed to log out')
        });
    };
    
    //Whether the user logins or logouts, it changes whether the login or logout button is shown
    onAuthStateChanged(auth, (user) => {
        if(user){
            setCanLogout(true);
        }
        else{
            setCanLogout(false);
        }
    });

    return(
        <>
            <Navbar bg="myGray" variant='dark' className='navbar'>
                <Navbar.Collapse id="basic-navbar-nav">
                {/* ---------------Left Side of Nav------------------ */}
                <Nav className="me-auto">
                    <Nav.Link href="#" onClick={showSidebar}><BsIcons.BsArrowBarRight/></Nav.Link>
                </Nav>

                {/* ---------------Dice Button------------------ */}
                <Nav className = "right-nav">
                    <Nav.Link onClick={toggleDiceCanvas}><BsIcons.BsDice3Fill/></Nav.Link>
                </Nav>

                {/* ---------------Ride side of Nav------------------ */}
                <Nav className="right-nav">
                        {/* ---------------Settings------------------ */}
                        <div onClick={showSettings}>
                            <BsIcons.BsFillGearFill/>
                        </div>

                        {/* ---------------Setting Items------------------ */}
                        <nav className={settings? 'settings active' : 'settings'}>
                            <Fade in={settings}>
                                <ul className="settingUl" onClick={showSettings}>
                                    {/* ---------------Login Button------------------ */}
                                    <li>
                                        <Link to='login' className={canLogout? 'keep-hidden': 'setting-items'}>
                                            Login
                                        </Link>
                                    </li>
                                    {/* ---------------Logout Button------------------ */}
                                    <li onClick={logout} className={canLogout? 'setting-items' : 'keep-hidden'}>
                                        Logout
                                    </li>
                                </ul>
                            </Fade>
                        </nav>
                </Nav>  
                </Navbar.Collapse>
            </Navbar>
            
            {/* ---------------SideBar------------------ */}
            <nav className={sidebar ? 'side-menu active' : 'side-menu'}>
                <ul className='side-menu-items' onClick={showSidebar}>
                    <li className='sidebar-toggle'>
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

            {/* ---------------Dice Offcanvas------------------ */}
            <Offcanvas show={dicecanvas} placement={"bottom"} scroll={true} backdrop={false}>
                <DiceOffCanvas/>
            </Offcanvas>
        </>
    );
}

export default NavigationBar