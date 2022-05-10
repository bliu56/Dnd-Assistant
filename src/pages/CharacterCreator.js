import './CharacterCreator.css';

import React, { useState } from 'react';
import { Container, Row, Col, CardGroup, Card, Form, Button, ToggleButton, DropdownButton, Tabs, Tab, ButtonToolbar } from 'react-bootstrap';
import DropdownItem from 'react-bootstrap/esm/DropdownItem';
import { diceRoll } from '../diceRoll';

function CharacterCreator(){
    //temporary, should fetch info from api
    const characterRaces = [
        {
            name: 'Dragonborn',
            info: 'about Dragonborn',
            img: ''
        },
        {
            name: 'Dwarf',
            info: 'about Dwarf',
            img: ''
        },
        {
            name: 'Elf',
            info: 'about Elf',
            img: ''
        },
        {
            name: 'Gnome',
            info: 'about Gnome',
            img: ''
        },
        {
            name: 'Half-Elf',
            info: 'about Half-Elf',
            img: ''
        },
        {
            name: 'Half-Orc',
            info: 'about Half-Orc',
            img: ''
        },
        {
            name: 'Halfling',
            info: 'about Halfling',
            img: ''
        },
        {
            name: 'Human',
            info: 'about Human',
            img: ''
        },
        {
            name: 'Tiefling',
            info: 'about Tiefling',
            img: ''
        }
    ];
    const characterClasses = [
        {
            name: 'Barbarian',
            info: 'about Barbarian',
            img: ''
        },
        {
            name: 'Bard',
            info: 'about Bard',
            img: ''
        },
        {
            name: 'Cleric',
            info: 'about Cleric',
            img: ''
        },
        {
            name: 'Druid',
            info: 'about Druid',
            img: ''
        },
        {
            name: 'Monk',
            info: 'about Monk',
            img: ''
        },
        {
            name: 'Paladin',
            info: 'about Paladin',
            img: ''
        },
        {
            name: 'Ranger',
            info: 'about Ranger',
            img: ''
        },
        {
            name: 'Rogue',
            info: 'about Rogue',
            img: ''
        },
        {
            name: 'Sorcerer',
            info: 'about Sorcerer',
            img: ''
        },
        {
            name: 'Warlock',
            info: 'about Warlock',
            img: ''
        },
        {
            name: 'Wizard',
            info: 'about Wizard',
            img: ''
        }
    ];
    const characterBackgrounds = [
        {
            name: 'bg 1',
            info: 'about 1',
            img: ''
        },
        {
            name: 'bg 2',
            info: 'about 2',
            img: ''
        },
        {
            name: 'bg 3',
            info: 'about 3',
            img: ''
        }
    ];
    const characterAbilities = [
        {
            name: 'Strength',
            nameAbbrv: 'STR',
            info: 'about str',
        },
        {
            name: 'Dexterity',
            nameAbbrv: 'DEX',
            info: 'about dex',
        },
        {
            name: 'Constitution',
            nameAbbrv: 'CON',
            info: 'about con',
        },
        {
            name: 'Intelligence',
            nameAbbrv: 'INT',
            info: 'about int',
        },
        {
            name: 'Wisdom',
            nameAbbrv: 'WIS',
            info: 'about wis',
        },
        {
            name: 'Charisma',
            nameAbbrv: 'CHA',
            info: 'about cha',
        }
    ]
    const [charRace,setCharRace] = useState(characterRaces[0]);
    const [charClass,setCharClass] = useState(characterClasses[0]);
    const [charBackground,setCharBackground] = useState(characterBackgrounds[0]);
    const [charAbilitiesInfo,setCharAbilitiesInfo] = useState(characterAbilities[0].info);
    const [charAbilities,setCharAbilities] = useState([0,0,0,0,0,0]);
    const [dieRollResult,setdieRollResult] = useState([0]);
    const handledieRollResult = () => {
        setdieRollResult(1);
        //dieRoll(1,1,0);
    }

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
                                {/*<ToggleButtonGroup name='charRace' type='radio' defaultValue={0}>
                                    {characterRaces.map((item, index) => {
                                        return(
                                            <ToggleButton className='charButton' id={item.name} value={index} onChange={() => setCharRace(item)}>
                                                {item.name}
                                            </ToggleButton>
                                        );
                                    })}
                                </ToggleButtonGroup>*/}
                                <ButtonToolbar>{/*button toolbar tends to flow better on smaller displays*/}
                                    {characterRaces.map((item, index) => {
                                        return(
                                            <Button className='charButton' onClick={() => setCharRace(item)}>
                                                {item.name}
                                            </Button>
                                        );
                                    })}
                                </ButtonToolbar>
                            </Card.Body>
                        </Card>
                    </Col>
                    <div class='vr' style={{padding:'0px',margin:'10px 5px',color:'gray'}}></div>
                    <Col className='characterInfoCol'>
                        <Card className='characterInfoCard characterCreatorCard' border='light'>
                            <Card.Img src={charRace.img} height='150px'></Card.Img>
                            <Card.Body>
                                <Card.Text>
                                    {charRace.name} information:
                                    <p>{charRace.info}</p>
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
                            {/*<ToggleButtonGroup name='charClass' type='radio' defaultValue={0}>
                                    {characterClasses.map((item, index) => {
                                        return(
                                            <ToggleButton className='charButton' id={item.name} value={index} onChange={() => setCharClass(item)}>
                                                {item.name}
                                            </ToggleButton>
                                        );
                                    })}
                                </ToggleButtonGroup>*/}
                                <ButtonToolbar>
                                    {characterClasses.map((item, index) => {
                                        return(
                                            <ToggleButton className='charButton' onClick={() => setCharClass(item)}>
                                                {item.name}
                                            </ToggleButton>
                                        );
                                    })}
                                </ButtonToolbar>
                            </Card.Body>
                        </Card>
                    </Col>
                    <div class='vr' style={{padding:'0px',margin:'10px 5px',color:'gray'}}></div>
                    <Col className='characterInfoCol'>
                        <Card className='characterInfoCard characterCreatorCard' border='light'>
                            <Card.Img src={charClass.img} height='150px'></Card.Img>
                            <Card.Body>
                                <Card.Text>
                                    {charClass.name} information:
                                    <p>{charClass.info}</p>
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
                                <DropdownButton title={charBackground.name}>
                                    {characterBackgrounds.map((item) => {
                                        return(
                                            <DropdownItem onClick={() => setCharBackground(item)}>{item.name}</DropdownItem>
                                        );
                                    })}
                                </DropdownButton>
                            </Card.Body>
                        </Card>
                    </Col>
                    <div class='vr' style={{padding:'0px',margin:'10px 5px',color:'gray'}}></div>
                    <Col className='characterInfoCol'>
                        <Card className='characterInfoCard characterCreatorCard' border='light'>
                            <Card.Img src={charBackground.img} height='150px'></Card.Img>
                            <Card.Body>
                                <Card.Text>
                                    {charBackground.name} information:
                                    <p>{charBackground.info}</p>
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
                                                    <Card onClick={() => setCharAbilitiesInfo(characterAbilities[index].info)}>
                                                        <Card.Header>{item.nameAbbrv}</Card.Header>
                                                        <Card.Body>
                                                            <Form>
                                                                <Form.Control value={charAbilities[index]}></Form.Control>
                                                            </Form>
                                                        </Card.Body>
                                                    </Card>
                                                );
                                            })}
                                        </CardGroup>
                                        <p></p>
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
                                                    <Card onClick={() => setCharAbilitiesInfo(characterAbilities[index].info)}>
                                                        <Card.Header>{item.nameAbbrv}</Card.Header>
                                                        <Card.Body>
                                                            <Button>{charAbilities[index]}</Button>
                                                        </Card.Body>
                                                    </Card>
                                                );
                                            })}
                                        </CardGroup>
                                        <p></p>
                                        <Button onClick={handledieRollResult}>roll: {dieRollResult}</Button>
                                    </Card.Body>
                                </Tab>
                            </Tabs>
                        </Card>
                    </Col>
                    <div class='vr' style={{padding:'0px',margin:'10px 5px',color:'gray'}}></div>
                    <Col className='characterInfoCol'>
                        <Card className='characterInfoCard characterCreatorCard' border='light'>
                            <Card.Body>
                                <Card.Text>
                                    information:
                                    <p>{charAbilitiesInfo}</p>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* ----------------Class Features---------------- */}
                <Row className='characterCardRow'>
                    <Col xs={7} className='characterOptionsCol'>
                        <Card className='characterOptionsCard characterCreatorCard' border='light'>
                            <Card.Header>Class Features</Card.Header>
                            <Card.Body>
                            </Card.Body>
                        </Card>
                    </Col>
                    <div class='vr' style={{padding:'0px',margin:'10px 5px',color:'gray'}}></div>
                    <Col className='characterInfoCol'>
                        <Card className='characterInfoCard characterCreatorCard' border='light'>
                            <Card.Body>
                                <Card.Text>information</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* ----------------Proficiencies---------------- */}
                <Row className='characterCardRow'>
                    <Col xs={7} className='characterOptionsCol'>
                        <Card className='characterOptionsCard characterCreatorCard' border='light'>
                            <Card.Header>Proficiencies</Card.Header>
                            <Card.Body>
                            </Card.Body>
                        </Card>
                    </Col>
                    <div class='vr' style={{padding:'0px',margin:'10px 5px',color:'gray'}}></div>
                    <Col className='characterInfoCol'>
                        <Card className='characterInfoCard characterCreatorCard' border='light'>
                            <Card.Body>
                                <Card.Text>information</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* ----------------Options---------------- */}
                <Row className='characterCardRow'>
                    <Col xs={7} className='characterOptionsCol'>
                        <Card className='characterOptionsCard characterCreatorCard' border='light'>
                            <Card.Header>Options</Card.Header>
                            <Card.Body>
                            </Card.Body>
                        </Card>
                    </Col>
                    <div class='vr' style={{padding:'0px',margin:'10px 5px',color:'gray'}}></div>
                    <Col className='characterInfoCol'>
                        <Card className='characterInfoCard characterCreatorCard' border='light'>
                            <Card.Body>
                                <Card.Text>information</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* ----------------HP---------------- */}
                <Row className='characterCardRow'>
                    <Col xs={7} className='characterOptionsCol'>
                        <Card className='characterOptionsCard characterCreatorCard' border='light'>
                            <Card.Header>HP</Card.Header>
                            <Card.Body>
                            </Card.Body>
                        </Card>
                    </Col>
                    <div class='vr' style={{padding:'0px',margin:'10px 5px',color:'gray'}}></div>
                    <Col className='characterInfoCol'>
                        <Card className='characterInfoCard characterCreatorCard' border='light'>
                            <Card.Body>
                                <Card.Text>information</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* ----------------Spells---------------- */}
                <Row className='characterCardRow'>
                    <Col xs={7} className='characterOptionsCol'>
                        <Card className='characterOptionsCard characterCreatorCard' border='light'>
                            <Card.Header>Spells</Card.Header>
                            <Card.Body>
                            </Card.Body>
                        </Card>
                    </Col>
                    <div class='vr' style={{padding:'0px',margin:'10px 5px',color:'gray'}}></div>
                    <Col className='characterInfoCol'>
                        <Card className='characterInfoCard characterCreatorCard' border='light'>
                            <Card.Body>
                                <Card.Text>information</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* ----------------Equipment---------------- */}
                <Row className='characterCardRow'>
                    <Col xs={7} className='characterOptionsCol'>
                        <Card className='characterOptionsCard characterCreatorCard' border='light'>
                            <Card.Header>Equipment</Card.Header>
                            <Card.Body>
                            </Card.Body>
                        </Card>
                    </Col>
                    <div class='vr' style={{padding:'0px',margin:'10px 5px',color:'gray'}}></div>
                    <Col className='characterInfoCol'>
                        <Card className='characterInfoCard characterCreatorCard' border='light'>
                            <Card.Body>
                                <Card.Text>information</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* ----------------Save Button---------------- */}
                <Button>Save</Button>
            </Container>

        </>
    );
}

export default CharacterCreator;