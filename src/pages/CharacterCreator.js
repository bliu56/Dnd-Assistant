import './CharacterCreator.css';
import React, { useState } from 'react';
import { Container, Row, Col, CardGroup, Card, Form, Button, ToggleButton, ToggleButtonGroup, DropdownButton, Tabs, Tab, ButtonToolbar } from 'react-bootstrap';
import DropdownItem from 'react-bootstrap/esm/DropdownItem';
import Axios from 'axios';
import { dropMinRoll } from '../dropMinRoll';

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
    const [loadedAbilities, setloadedAbilities] = useState(false);

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
            name: '',
            index: '',
            full_name: '',
            desc: []
        }
    ]);
    const [optRace,setOptRace] = useState(characterRaces[0]);
    const [optClass,setOptClass] = useState(characterClasses[0]);
    const [optBackground,setOptBackground] = useState(characterBackgrounds[0]);
    const [optAbilities,setOptAbilities] = useState(characterAbilities[0]);
    const [charAbilities,setCharAbilities] = useState([0,0,0,0,0,0]);
    const [abilityPoints,setAbilityPoints] = useState(27);
    const [dieRollResult,setdieRollResult] = useState([0]);
    const [curStat, setCurStat]            = useState({0 : 'CHA', 1 : 0});

    const handledieRollResult = () => {
        setdieRollResult(dropMinRoll(4,6));
    }

    const handleSetCharAbilities = (index) => {
        const newAbilities = []
        for (let i = 0; i < charAbilities.length; i++) {
            if(i == index)
                newAbilities[i] = dieRollResult;
            else
                newAbilities[i] = charAbilities[i];
        }
        setCharAbilities(newAbilities);
        setAbilityPoints(abilityPoints + charAbilities[index] - dieRollResult)
    }
    const handleSetAbilityScore = (event, index, isBuy) => {
        let newScore = Number(event.target.value);
        let remainingAbilityPoints = abilityPoints + charAbilities[index] - newScore
        if(remainingAbilityPoints >= 0 || !isBuy) {
            charAbilities[index] = newScore;
            setCharAbilities(charAbilities);
            setAbilityPoints(remainingAbilityPoints);
        }
    }

    const fetchRaceInfo = (index) => {
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
            setCharacterRaces([]);
            Axios.get("https://www.dnd5eapi.co/api/races").then(
                (r) => {
                    let len = JSON.parse(JSON.stringify(r.data.count));
                    for(let i = 0; i < len; i ++) {
                        let item = JSON.parse(JSON.stringify(r.data.results[i]));
                        fetchRaceInfo(item.index);
                    }
                }
            )
            setloadedRaces(true);
        }
    }
    const fetchClassInfo = (index) => {
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
            setCharacterClasses([]);
            Axios.get("https://www.dnd5eapi.co/api/classes").then(
                (r) => {
                    let len = JSON.parse(JSON.stringify(r.data.count));
                    for(let i = 0; i < len; i ++) {
                        let item = JSON.parse(JSON.stringify(r.data.results[i]));
                        fetchClassInfo(item.index);
                    }
                }
            )
            setloadedClasses(true);
        }
    }
    const fetchAbilitiesInfo = (index) => {
        Axios.get("https://www.dnd5eapi.co/api/ability-scores/" + index).then(
            (r) => {
                let item = JSON.parse(JSON.stringify(r.data))
                setCharacterAbilities(prevItems => [...prevItems, {
                    name: item.name,
                    index: item.index,
                    full_name: item.full_name,
                    desc: item.desc
                }]);
            }
        )
    }
    const loadAbilities = () => {
        if(!loadedAbilities) {
            setCharacterAbilities([]);
            Axios.get("https://www.dnd5eapi.co/api/ability-scores").then(
                (r) => {
                    let len = JSON.parse(JSON.stringify(r.data.count));
                    for(let i = 0; i < len; i++) {
                        let item = JSON.parse(JSON.stringify(r.data.results[i]));
                        fetchAbilitiesInfo(item.index);
                    }
                }
            )
            setloadedAbilities(true);
        }
    }

    loadRaces();
    loadClasses();
    loadAbilities();
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
                            <Card.Header>Ability Scores</Card.Header>
                            <Tabs>
                                <Tab eventKey='point-buy' title='Point Buy'>
                                    <Card.Body>
                                        <CardGroup>
                                            {characterAbilities.map((item, index) => {
                                                return(
                                                    <>
                                                    <Card onClick={() => setOptAbilities(characterAbilities[index])}>
                                                        <Card.Header>{item.name}</Card.Header>
                                                        <Card.Body>
                                                            <Form>
                                                                <Form.Control 
                                                                    type="number"
                                                                    pattern="[0-20]*"
                                                                    value={charAbilities[index]}
                                                                    onChange={(event) => handleSetAbilityScore(event,index,true)}
                                                                />
                                                            </Form>
                                                        </Card.Body>
                                                    </Card>
                                                    </>
                                                );
                                            })}
                                        </CardGroup>
                                        <p/>
                                        <div>
                                            Points: {abilityPoints}
                                        </div>
                                    </Card.Body>
                                </Tab>
                                <Tab eventKey='dice-roll' title='Roll For Stats'>
                                    <Card.Body>
                                        <CardGroup>
                                            {characterAbilities.map((item, index) => {
                                                return(
                                                    <Card onClick={() => setOptAbilities(characterAbilities[index])}>
                                                        <Card.Header>{item.name}</Card.Header>
                                                        <Card.Body>
                                                        <Button onClick={() => setCurStat({0 : item.name, 1 : index})}>{charAbilities[index]}</Button>
                                                        </Card.Body>
                                                    </Card>
                                                );
                                            })}
                                        </CardGroup>
                                        <p></p>
                                        <Button onClick={handledieRollResult}> roll: {dieRollResult}</Button>
                                        <>   </>
                                        <Button onClick={() => handleSetCharAbilities(curStat[1])}> Commit to: {curStat[0]}</Button>
                                    </Card.Body>
                                </Tab>
                                <Tab eventKey='manual-entry' title='Manual Entry'>
                                    <Card.Body>
                                        <CardGroup>
                                            {characterAbilities.map((item, index) => {
                                                return(
                                                    <Card onClick={() => setOptAbilities(characterAbilities[index])}>
                                                        <Card.Header>{item.name}</Card.Header>
                                                        <Card.Body>
                                                            <Form.Control
                                                                type="number"
                                                                pattern="[0-20]*"
                                                                value={charAbilities[index]}
                                                                onChange={(event) => handleSetAbilityScore(event,index,false)}
                                                            />
                                                        </Card.Body>
                                                    </Card>
                                                );
                                            })}
                                        </CardGroup>
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
                                    <h5>{optAbilities.name}</h5><hr/>
                                    {optAbilities.desc.map((item) => {
                                        return(
                                            <p>{item}</p>
                                        );
                                    })}
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