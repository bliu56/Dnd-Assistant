import './CharacterCreator.css';
import { diceRoll } from '../diceRoll';

import React, { useState } from 'react';
import { Container, Row, Col, CardGroup, Card, Form, Button, ToggleButton, ToggleButtonGroup, DropdownButton, Tabs, Tab, ButtonToolbar } from 'react-bootstrap';
import DropdownItem from 'react-bootstrap/esm/DropdownItem';
import Axios from 'axios';

function verticalRule(){
    return(<div className='vr' style={{padding:'0px', margin:'10px 5px', color:'gray'}}/>)
}
function characterCreatorCardPlaceHolder(name){
    return(
        <Row className='characterCardRow'>
            <Col xs={7} className='characterOptionsCol'>
                <Card className='characterOptionsCard characterCreatorCard' border='light'>
                    <Card.Header>{name}</Card.Header>
                    <Card.Body>
                    </Card.Body>
                </Card>
            </Col>
            {verticalRule()}
            <Col className='characterInfoCol'>
                <Card className='characterInfoCard characterCreatorCard' border='light'>
                    <Card.Body>
                        <Card.Text>information</Card.Text>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
}
function optionsToolBar(list, setItemFxn){
    return(
        <ButtonToolbar>
            {list.map((item) => {
                return(
                    <Button className='charButton' onClick={() => setItemFxn(item)}>
                        {item.name}
                    </Button>
                );
            })}
        </ButtonToolbar>
    );
}
function optionsToggleButtonGroup(name, list, setItemFxn){
    return(
        <ToggleButtonGroup name={name} type='radio' defaultValue={0}>
            {list.map((item, index) => {
                return(
                    <ToggleButton className='charButton' id={item.name} value={index} onChange={() => setItemFxn(item)}>
                        {item.name}
                    </ToggleButton>
                );
            })}
        </ToggleButtonGroup>
    );
}
function optionsDropdown(topItem, list, setItemFxn){
    return(
        <DropdownButton title={topItem.name}>
            {list.map((item) => {
                return(
                    <DropdownItem onClick={() => setItemFxn(item)}>{item.name}</DropdownItem>
                );
            })}
        </DropdownButton>
    );
}

function CharacterCreator(){
    const [loadedRaces, setloadedRaces] = useState(false);
    const [loadedClasses, setloadedClasses] = useState(false);

    const [characterRaces, setCharacterRaces] = useState([
        {
            name: '',
            speed: '',
            ability_bonuses: [],
            alignment: '',
            size: '',
            language_desc: ''
        }
    ]);
    const [characterClasses, setCharacterClasses] = useState([
        {
            name: '',
            info: ''
        }
    ]);
    const [characterBackgrounds, setCharacterBackgrounds] = useState([
        {
            name: 'bg 1',
            info: 'about 1',
            img: ''
        }
    ]);
    const [characterAbilities, setCharacterAbilities] = useState([
        {
            name: 'Strength',
            nameAbbrv: 'STR',
            info: 'about str'
        }
    ]);
    const [optRace,setOptRace] = useState(characterRaces[0]);
    const [optClass,setOptClass] = useState(characterClasses[0]);
    const [optBackground,setOptBackground] = useState(characterBackgrounds[0]);
    const [optAbilitiesInfo,setOptAbilitiesInfo] = useState(characterAbilities[0].info);
    const [optAbilities,setOptAbilities] = useState([0,0,0,0,0,0]);
    const [dieRollResult,setdieRollResult] = useState([0]);
    const handleDieRollResult = () => {
        setdieRollResult(1);
        //dieRoll(1,1,0);
    }

    const fetchRaceInfo = (index) => {
        setCharacterRaces([]);
        Axios.get("https://www.dnd5eapi.co/api/races/" + index).then(
            (r) => {
                let item = JSON.parse(JSON.stringify(r.data))
                setCharacterRaces(prevItems => [...prevItems, {
                    name: item.name,
                    speed: item.speed,
                    ability_bonuses: item.ability_bonuses,
                    alignment: item.alignment,
                    size: item.size,
                    language_desc: item.language_desc
                }]);
            }
        )
    }
    const loadRaces = () => {
        if(!loadedRaces) {
            setloadedRaces(true);
            Axios.get("https://www.dnd5eapi.co/api/races").then(
                (r) => {
                    let len = JSON.parse(JSON.stringify(r.data.count));
                    for(let i = 0; i < len; i ++) {
                        let item = JSON.parse(JSON.stringify(r.data.results[i]));
                        fetchRaceInfo(item.index);
                    }
                }
            )
        }
    }
    const fetchClassInfo = (index) => {
        setCharacterClasses([]);
        Axios.get("https://www.dnd5eapi.co/api/classes/" + index).then(
            (r) => {
                let item = JSON.parse(JSON.stringify(r.data))
                setCharacterClasses(prevItems => [...prevItems, {
                    name: item.name,
                    info: item.url
                }]);
            }
        )
    }
    const loadClasses = () => {
        if(!loadedClasses) {
            setloadedClasses(true);
            Axios.get("https://www.dnd5eapi.co/api/classes").then(
                (r) => {
                    let len = JSON.parse(JSON.stringify(r.data.count));
                    for(let i = 0; i < len; i ++) {
                        let item = JSON.parse(JSON.stringify(r.data.results[i]));
                        fetchClassInfo(item.index);
                    }
                }
            )
        }
    }

    loadRaces();
    loadClasses();
    /* ----------------return JSX stuff---------------- */
    return(
        <>
            <h2 className='characterCreatorTitle'>Character Creator</h2>

            <Container fluid className='characterCreatorContainer'>
                {/* ----------------Race---------------- */}
                <Row className='characterCardRow'>
                    <Col xs={7} className='characterOptionsCol'>
                        <Card className='characterOptionsCard characterCreatorCard' border='light'>
                            <Card.Header>Race</Card.Header>
                            <Card.Body>
                                {optionsToolBar(characterRaces,setOptRace)}
                                {/* {optionsToggleButtonGroup(optRace,characterRaces,setOptRace)} */}
                            </Card.Body>
                        </Card>
                    </Col>
                    {verticalRule()}
                    <Col className='characterInfoCol'>
                        <Card className='characterInfoCard characterCreatorCard' border='light'>
                            {/* <Card.Img src={optRace.img} height='150px'/> */}
                            <Card.Body>
                                <Card.Text>
                                    <h5>{optRace.name}</h5><hr/>
                                    <p><strong>size: </strong>{optRace.size}</p><hr/>
                                    <p><strong>speed: </strong>{optRace.speed}</p><hr/>
                                    <p>
                                        <strong>ability bonuses: </strong>
                                        <ul class='list-inline'>
                                            {optRace.ability_bonuses.map((item) => {
                                                return(
                                                    <li className='list-inline-item'>{item.ability_score.name}: {item.bonus}</li>
                                                );
                                            })}
                                        </ul>
                                    </p><hr/>
                                    <p><strong>alignment: </strong>{optRace.alignment}</p><hr/>
                                    <p><strong>language: </strong>{optRace.language_desc}</p>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* ----------------Class---------------- */}
                <Row className='characterCardRow'>
                    <Col xs={7} className='characterOptionsCol'>
                        <Card className='characterOptionsCard characterCreatorCard' border='light'>
                            <Card.Header>Class</Card.Header>
                            <Card.Body>
                                {optionsToolBar(characterClasses,setOptClass)}
                                {/* {optionsToggleButtonGroup(optRace,characterRaces,setOptRace)} */}
                            </Card.Body>
                        </Card>
                    </Col>
                    {verticalRule()}
                    <Col className='characterInfoCol'>
                        <Card className='characterInfoCard characterCreatorCard' border='light'>
                            {/* <Card.Img src={optRace.img} height='150px'/> */}
                            <Card.Body>
                                <Card.Text>
                                    <div>
                                        <h5>{optClass.name}</h5>
                                    </div>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* ----------------Background---------------- */}
                <Row className='characterCardRow'>
                    <Col xs={7} className='characterOptionsCol'>
                        <Card className='characterOptionsCard characterCreatorCard' border='light'>
                            <Card.Header>Background</Card.Header>
                            <Card.Body>
                                {optionsDropdown(optBackground,characterBackgrounds,setOptBackground)}
                            </Card.Body>
                        </Card>
                    </Col>
                    {verticalRule()}
                    <Col className='characterInfoCol'>
                        <Card className='characterInfoCard characterCreatorCard' border='light'>
                            {/* <Card.Img src={optBackground.img} height='150px'/> */}
                            <Card.Body>
                                <Card.Text>
                                    {optBackground.name} information:
                                    <p>{optBackground.info}</p>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* ----------------Ability Scores---------------- */}
                <Row className='characterCardRow'>
                    <Col xs={7} className='characterOptionsCol'>
                        <Card className='characterOptionsCard characterCreatorCard' border='light'>
                            <Tabs>
                                <Tab eventKey='point-buy' title='Ability Scores: Point Buy'>
                                    <Card.Body>
                                        <CardGroup>
                                            {characterAbilities.map((item, index) => {
                                                return(
                                                    <Card onClick={() => setOptAbilitiesInfo(characterAbilities[index].info)}>
                                                        <Card.Header>{item.nameAbbrv}</Card.Header>
                                                        <Card.Body>
                                                            <Form>
                                                                <Form.Control value={optAbilities[index]}/>
                                                            </Form>
                                                        </Card.Body>
                                                    </Card>
                                                );
                                            })}
                                        </CardGroup>
                                        <p/>
                                        <div>
                                            Points: 0
                                        </div>
                                    </Card.Body>
                                </Tab>
                                <Tab eventKey='dice-roll' title='Ability Scores: Roll'>
                                    <Card.Body>
                                        <CardGroup>
                                            {characterAbilities.map((item, index) => {
                                                return(
                                                    <Card onClick={() => setOptAbilitiesInfo(characterAbilities[index].info)}>
                                                        <Card.Header>{item.nameAbbrv}</Card.Header>
                                                        <Card.Body>
                                                            <Button>{optAbilities[index]}</Button>
                                                        </Card.Body>
                                                    </Card>
                                                );
                                            })}
                                        </CardGroup>
                                        <p/>
                                        <Button onClick={handleDieRollResult}>roll: {dieRollResult}</Button>
                                    </Card.Body>
                                </Tab>
                            </Tabs>
                        </Card>
                    </Col>
                    {verticalRule()}
                    <Col className='characterInfoCol'>
                        <Card className='characterInfoCard characterCreatorCard' border='light'>
                            <Card.Body>
                                <Card.Text>
                                    information:
                                    <p>{optAbilitiesInfo}</p>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* ----------------Class Features---------------- */}
                {characterCreatorCardPlaceHolder("Class Features")}

                {/* ----------------Proficiencies---------------- */}
                {characterCreatorCardPlaceHolder("Proficiencies")}

                {/* ----------------Options---------------- */}
                {characterCreatorCardPlaceHolder("Options")}

                {/* ----------------HP---------------- */}
                {characterCreatorCardPlaceHolder("HP")}

                {/* ----------------Spells---------------- */}
                {characterCreatorCardPlaceHolder("Spells")}

                {/* ----------------Equipment---------------- */}
                {characterCreatorCardPlaceHolder("Equipment")}
            </Container>

            {/* ----------------Save Button---------------- */}
            <Button className='saveButton'>Save</Button>

        </>
    );
}

export default CharacterCreator;