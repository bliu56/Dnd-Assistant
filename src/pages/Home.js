import './Home.css';
import {Carousel} from 'react-bootstrap';
import logo1 from '../img/Pen-and-Dice.jpg';
import logo2 from '../img/spellbook.jpg';
import { useState, useEffect } from "react";
import { SidebarData } from '../comp/nav/SidebarData';
import { Link, useNavigate } from 'react-router-dom';
import * as BsIcons from "react-icons/bs";
import { auth } from "../firebase-config";
import React from 'react';

function Home(){
    let navigate = useNavigate();

    const [loggedin, setLoggedIn] = useState("/login")

    const user = auth.currentUser;

    useEffect(()=> {
        if(user){
            setLoggedIn('../character')
        }
        else
        {
            setLoggedIn("/login")
        }
    }, [])

    return(
        <>
            <div className='homePage'>
                <Carousel>
                    <Carousel.Item >
                        <img
                        className="d-block w-100"
                        src={logo1}
                        alt="First slide"
                        onClick={() => 
                            navigate(loggedin, {replace : true})
                        }
                        />
                        <Carousel.Caption>
                        <h1>Create a Character</h1>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                        className="d-block w-100"
                        src={logo2}
                        alt="Second slide"
                        onClick={() => navigate('../spells', {replace : true})}
                        />

                        <Carousel.Caption>
                        <h1>Spellbook</h1>
                        </Carousel.Caption>
                    </Carousel.Item>
                </Carousel>
            </div>
        </>
    );
}

export default Home;