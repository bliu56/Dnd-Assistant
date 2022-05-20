import './CharacterCreator.css';
<<<<<<< Updated upstream
=======
import React, { useState, useEffect } from 'react';
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
>>>>>>> Stashed changes

import './CharacterCreator.css';
import { ToggleButtonGroup,  ToggleButton, ButtonGroup, Button} from 'react-bootstrap';
function CharacterCreator(){
<<<<<<< Updated upstream
    return(
=======
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
            hit_die: ''
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

    const fetchClassInfo = (index) => {
        Axios.get("https://www.dnd5eapi.co/api/classes/" + index).then(
            (r) => {
                let item = JSON.parse(JSON.stringify(r.data))
                setCharacterClasses(prevItems => [...prevItems, {
                    name: item.name,
                    hit_die: item.hit_die
                }]);
            }
        )
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

    useEffect(()=> {
        //Load Races
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

        //Load Classes
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

        //Load Abilities
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
    }, []);
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
                                    <>
                                        <h5><strong>Race: </strong>{optRace.name}</h5><hr/>
                                        <div><strong>Size: </strong>{optRace.size}</div><hr/>
                                        <div><strong>Speed: </strong>{optRace.speed}</div><hr/>
                                        <div>
                                            <strong>Ability bonuses: </strong>
                                            <ul className='list-inline'>
                                                {optRace.ability_bonuses.map((item, index) => {
                                                    return( 
                                                        <li className='list-inline-item' key={index}>{item.ability_score.name}: {item.bonus}</li>
                                                    );
                                                })}
                                            </ul>
                                        </div><hr/>
                                        <div><strong>Alignment: </strong>{optRace.alignment}</div><hr/>
                                        <div><strong>Language: </strong>{optRace.language_desc}</div>
                                    </>
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
                                    <>
                                        <h5>Class: {optClass.name}</h5> <hr/>
                                        <div>Hit Die: {optRace.hit_die}</div> <hr/>
                                    </>
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
                                    {optBackground.name} information:
                                    <div>{optBackground.info}</div>
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
                                    <div>{optAbilities.name}</div><hr/>
                                    {optAbilities.desc.map((item) => {
                                        return(
                                            <div>{item}</div>
                                        );
                                    })}
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
>>>>>>> Stashed changes

            <>
            <h1>Create Character</h1>
            <h3>Race</h3>
            <ToggleButtonGroup type="radio" name="race" defaultValue={8}>
                <ToggleButton id="race-1" value={1}>
                    Dragonborn
                </ToggleButton>
                <ToggleButton id="race-2" value={2}>
                    Dwarf
                </ToggleButton>
                <ToggleButton id="race-3" value={3}>
                    Elf
                </ToggleButton>
                <ToggleButton id="race-4" value={4}>
                    Gnome
                </ToggleButton>
                <ToggleButton id="race-5" value={5}>
                    Half-Elf
                </ToggleButton>
                <ToggleButton id="race-6" value={6}>
                    Halfling
                </ToggleButton>
                <ToggleButton id="race-7" value={7}>
                    Half-Orc
                </ToggleButton>
                <ToggleButton id="race-8" value={8}>
                    Human
                </ToggleButton>
                <ToggleButton id="race-9" value={9}>
                    Half-Orc
                </ToggleButton>
                <ToggleButton id="race-10" value={10}>
                    Human
                </ToggleButton>
                <ToggleButton id="race-11" value={12}>
                    Tiefling
                </ToggleButton>
                {/*<ToggleButton id="race-7" value={7}>
                    Half-Orc
                </ToggleButton>
                <ToggleButton id="race-7" value={7}>
                    Half-Orc
                </ToggleButton>
                <ToggleButton id="race-7" value={7}>
                    Half-Orc
                </ToggleButton>
                <ToggleButton id="race-7" value={7}>
                    Half-Orc
                </ToggleButton>
                <ToggleButton id="race-7" value={7}>
                    Half-Orc
    </ToggleButton>*/}
            </ToggleButtonGroup>
            <h3>Class</h3>
            <ToggleButtonGroup type="radio" name="class" defaultValue={5}>
                <ToggleButton id="tbg-radio-1" value={1}>
                    Barbarian
                </ToggleButton>
                <ToggleButton id="tbg-radio-2" value={2}>
                    Bard
                </ToggleButton>
                <ToggleButton id="tbg-radio-3" value={3}>
                    Cleric
                </ToggleButton>
                <ToggleButton id="tbg-radio-4" value={4}>
                    Druid
                </ToggleButton>
                <ToggleButton id="tbg-radio-5" value={5}>
                    Fighter
                </ToggleButton>
                <ToggleButton id="tbg-radio-6" value={6}>
                    Monk
                </ToggleButton>
                <ToggleButton id="tbg-radio-7" value={7}>
                    Paladin
                </ToggleButton>
                <ToggleButton id="tbg-radio-8" value={8}>
                    Ranger 
                </ToggleButton>
                <ToggleButton id="tbg-radio-9" value={9}>
                    Rogue
                </ToggleButton>
                <ToggleButton id="tbg-radio-10" value={10}>
                    Sorcerer 
                </ToggleButton>
                <ToggleButton id="tbg-radio-11" value={11}>
                    Warlock 
                </ToggleButton>
                <ToggleButton id="tbg-radio-12" value={12}>
                    Wizard
                </ToggleButton>
            </ToggleButtonGroup>
            <h3>Ability Scores</h3>
            {/**
             * ability score entry
             */}
            <h3>Background</h3>
            <ToggleButtonGroup vertical type="radio" name="background" defaultValue={5}>
                <ToggleButton id="tbg-background-1" value={1}>
                Acolyte
                </ToggleButton>
                <ToggleButton id="tbg-background-2" value={2}>
                Charlatan
                </ToggleButton>
                <ToggleButton id="tbg-background-3" value={3}>
                Criminal / Spy
                </ToggleButton>
                <ToggleButton id="tbg-background-4" value={4}>
                Entertainer
                </ToggleButton>
                <ToggleButton id="tbg-background-5" value={5}>
                Folk Hero
                </ToggleButton>
                <ToggleButton id="tbg-background-6" value={6}>
                Gladiator
                </ToggleButton>
                <ToggleButton id="tbg-background-7" value={7}>
                Guild Artisan /
                Merchant
                </ToggleButton>
                <ToggleButton id="tbg-background-8" value={8}>
                Hermit 
                </ToggleButton>
                <ToggleButton id="tbg-background-9" value={9}>
                Knight
                </ToggleButton>
                <ToggleButton id="tbg-background-10" value={10}>
                Noble 
                </ToggleButton>
                <ToggleButton id="tbg-background-11" value={11}>
                Pirate 
                </ToggleButton>
                <ToggleButton id="tbg-background-12" value={12}>
                Sage
                </ToggleButton>
                <ToggleButton id="tbg-background-13" value={13}>
                Sailor 
                </ToggleButton>
                <ToggleButton id="tbg-background-14" value={14}>
                Soldier 
                </ToggleButton>
                <ToggleButton id="tbg-background-15" value={15}>
                Urchin
                </ToggleButton>
            </ToggleButtonGroup>
            <h3>Equipment</h3>
            {/**
             * Equipment entry
             */}
             <button>Save</button><button>Preview Character</button>
            </>
    );
}

export default CharacterCreator;