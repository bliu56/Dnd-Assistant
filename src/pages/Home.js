import './Home.css';
import {Carousel} from 'react-bootstrap';
import logo1 from '../img/Pen-and-Dice.jpg';
import logo2 from '../img/spellbook.jpg'
import { SidebarData } from '../comp/SidebarData';
import { Link, useNavigate } from 'react-router-dom';
import * as BsIcons from "react-icons/bs";

function Home(){
    let navigate = useNavigate();
    return(
        <Carousel>
            <Carousel.Item >
                <img
                className="d-block w-100"
                src={logo1}
                alt="First slide"
                onClick={() => navigate('../character', {replace : true})}
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
    );
}

export default Home;