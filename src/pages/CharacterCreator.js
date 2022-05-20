import React, { useState, useEffect } from 'react';
import { Container, Row, Col, CardGroup, Card, Form, Button, ToggleButton, ToggleButtonGroup, DropdownButton, Tabs, Tab, ButtonToolbar } from 'react-bootstrap';
import { dropMinRoll } from '../dropMinRoll';
import DropdownItem from 'react-bootstrap/esm/DropdownItem';
import Axios from 'axios';
import ClassFeature from '../comp/class/ClassFeature';

import './CharacterCreator.css';

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
            {list.map((item, index) => {
                return(
                    <Button className='charButton' onClick={() => setItemFxn(item)} key={index}>
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
                    <ToggleButton className='charButton' id={item.name} value={index} key={index} onChange={() => setItemFxn(item)}>
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
            {list.map((item, index) => {
                return(
                    <DropdownItem onClick={() => setItemFxn(item)} key={index}>{item.name}</DropdownItem>
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
            hit_die: '',
            proficiencies: "",
            saving_throws: "",
            skills: ""
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
            if(i === index)
                newAbilities[i] = dieRollResult;
            else
                newAbilities[i] = charAbilities[i];
        }
        setCharAbilities(newAbilities);
        setAbilityPoints(abilityPoints + charAbilities[index] - dieRollResult)
    }

    /* -------------------------------------------------------------------------------------Ab Score---------------- */
    const handleSetAbilityScore = (event, index, isBuy) => {
        let newScore = Number(event.target.value);
        let remainingAbilityPoints = abilityPoints + charAbilities[index] - newScore
        if(remainingAbilityPoints >= 0 || !isBuy) {
            charAbilities[index] = newScore;
            setCharAbilities(charAbilities);
            setAbilityPoints(remainingAbilityPoints);
        }
    }

    /* -------------------------------------------------------------------------------------Race---------------- */
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
    /* -------------------------------------------------------------------------------------Classes---------------- */
    const fetchClassInfo = (index) => {
        Axios.get("https://www.dnd5eapi.co/api/classes/" + index).then(
            (r) => {
                let item = JSON.parse(JSON.stringify(r.data))

                //proficiencies
                let profItem = item.proficiencies;
                let prof = "";
                for(var q = 0; q < profItem.length; q++){
                    if(q === 0){
                        prof = profItem[q].name;
                    }
                    else
                    {
                        prof = prof + ", " + profItem[q].name;
                    }
                }

                //saving throw
                let stItem = item.saving_throws
                let st = ""
                for(var w = 0; w < stItem.length; w++){
                    if(w === 0){
                        st = stItem[w].name;
                    }
                    else
                    {
                        st = st + ", " + stItem[w].name;
                    }
                }

                //skills
                let choiceNum = item.proficiency_choices[0].choose;
                let skillsArray = item.proficiency_choices[0].from;
                let choices = "";
                let skill = "";
                for(var e = 0; e < skillsArray.length; e++){
                    let temp = skillsArray[e].name;
                    let newTemp = temp.replace('Skill: ', '');
                    if(e === 0){
                        choices = newTemp;
                    }
                    else
                    {
                        choices = choices + ", " + newTemp;
                    }
                }
                skill = choiceNum + ": " + choices;

                setCharacterClasses(prevItems => [...prevItems, {
                    name: item.name,
                    hit_die: item.hit_die,
                    proficiencies: prof,
                    saving_throws: st,
                    skills: skill
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

    /* -------------------------------------------------------------------------------------Abilities---------------- */
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

    useEffect(() => {
        loadRaces(); // eslint-disable-next-line react-hooks/exhaustive-deps
        loadClasses(); // eslint-disable-next-line react-hooks/exhaustive-deps
        loadAbilities(); // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return(
        <>
            <h2 className='characterCreatorTitle'>Character Creator</h2>

            <Container fluid className='characterCreatorContainer'>
                {/* -------------------------------------------------------------------------------------Race---------------- */}
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
                                    <h5>Race: {optRace.name}</h5><hr/>
                                    <p><strong>Size: </strong>{optRace.size}</p><hr/>
                                    <p><strong>Speed: </strong>{optRace.speed}</p><hr/>
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
                                    <p><strong>Alignment: </strong>{optRace.alignment}</p><hr/>
                                    <p><strong>Language: </strong>{optRace.language_desc}</p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* -------------------------------------------------------------------------------------Class---------------- */}
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
                                    <div>
                                        <h5>Class: {optClass.name}</h5> <hr/>
                                        <p><strong>Hit Die:</strong> {optClass.hit_die}</p> <hr/>
                                        <p><strong>Proficiencies:</strong> {optClass.proficiencies}</p> <hr/>
                                        <p><strong>Saving Throws:</strong> {optClass.saving_throws}</p> <hr/>
                                        <p><strong>Choose</strong> {optClass.skills}</p>
                                    </div>
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
                                    <p>{optBackground.info}</p>
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
                                                    <Card onClick={() => setOptAbilities(characterAbilities[index])} key={index}>
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
                                                    <Card onClick={() => setOptAbilities(characterAbilities[index])} key={index}>
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
                                                    <Card onClick={() => setOptAbilities(characterAbilities[index])} key={index}>
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
                                    <h5>{optAbilities.name}</h5><hr/>
                                    {optAbilities.desc.map((item, index) => {
                                        return(
                                            <p key={index}>{item}</p>
                                        );
                                    })}
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
                                    <div>
                                        <strong>Selected Class:</strong> {optClass.name}
                                        {ClassFeature(optClass.name)}
                                    </div>
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