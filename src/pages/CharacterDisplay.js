import './CharacterDisplay.css';
import React, { useState } from 'react';
import { Container, Row, Col, CardGroup, Card, Form, Button, ToggleButton, ToggleButtonGroup, DropdownButton, Tabs, Tab, ButtonToolbar, InputGroup } from 'react-bootstrap';

function characterDisplayCardSeriesRow(list,type){
    return(
        <CardGroup className='characterDisplayCard' border='light'>
            {list.map(
                (item) => {return(
                    <Card border='light'>
                        <Card.Header>{item.name}</Card.Header>
                        <Card.Body>
                            <Form.Control readOnly={false} type={type} value={item.value}/>
                        </Card.Body>
                    </Card>
                );}
            )}
        </CardGroup>
    );
}

function characterDisplayCardSeriesColumn(list,type,name){
    return(
        <Card className='characterDisplayCard' border='light'>
            <Card.Header>{name}</Card.Header>
            {list.map(
                (item) => {return(
                    <Card border='light'>
                        <Card.Header>{item.name}</Card.Header>
                        <Card.Body>
                            <Form.Control readOnly={false} type={type} value={item.value}/>
                        </Card.Body>
                    </Card>
                );}
            )}
        </Card>
    );
}

function characterDisplayCardMultipleSeriesColumn(list,itemList,name){
    return(
        <Card className='characterDisplayCard' border='light'>
            <Card.Header>{name}</Card.Header>
            {list.map(
                (entry) => {return(
                    <InputGroup>
                        {itemList.map(
                            (itemName) => {return(
                                <>
                                <InputGroup.Text>{itemName}:</InputGroup.Text>
                                <Form.Control value={entry[itemName]}/>
                                </>
                            );}
                        )}
                    </InputGroup>
                );}
            )}
        </Card>
    );
}

function characterDisplayCardSeriesRowWithCheck(list,type,name){
    return(
        <Card className='characterDisplayCard' border='light'>
            <Card.Header>{name}</Card.Header>
            <CardGroup border='light'>
                {list.map(
                    (item) => {return(
                        <Card border='light'>
                            <Card.Header>{item.name}</Card.Header>
                            <Card.Body>
                                <Form.Check className='characterDisplayCheckbox' defaultChecked={item.check}/>
                                <Form.Control className='d-inline' style={{width:'80%', float:'right'}} readOnly={false} type={type} value={item.value}/>
                            </Card.Body>
                        </Card>
                    );}
                )}
            </CardGroup>
        </Card>
    );
}

function characterDisplayCardSingle(item,type,as='input'){
    return(
        <Card className='characterDisplayCard' border='light'>
            <Card.Header>{item.name}</Card.Header>
            <Card.Body>
                <Form.Control readOnly={false} type={type} as={as} value={item.value}/>
            </Card.Body>
        </Card>
    );
}

function CharacterDisplay(){
    
    const characterName = {name:'Character Name',value:'...name'};
    const characterLevel = {name:'Level',value:'0'};
    const characterXP = {name:'Experience Points',value:'0'};
    const characterRace = {name:'Race',value:'...'};
    const characterClass = {name:'Class',value:'...'};
    const characterBackground = {name:'Background',value:'...'};
    const characterAlignment = {name:'Alignment',value:'...'};
    const playerName = {name:'Player Name',value:'...'};
    const playerGroup = {name:'Adventuring Group',value:'...'};

    const abilityScores = [{name:'CHA',value:0},
                            {name:'CON',value:0},
                            {name:'DEX',value:0},
                            {name:'INT',value:0},
                            {name:'STR',value:0},
                            {name:'WIS',value:0}];
    const characterInspiration = {name:'Inspiration',value:'...'};
    const characterProficiencyBonus = {name:'Proficiency Bonus',value:''};
    const characterPassivePerception = {name:'Passive Perception',value:'...'};
    const characterSavingThrows = [{name:'CHA',value:0,checked:true},
                            {name:'CON',value:0,checked:false},
                            {name:'DEX',value:0,checked:false},
                            {name:'INT',value:0,checked:false},
                            {name:'STR',value:0,checked:false},
                            {name:'WIS',value:0,checked:false}];
    const characterSkills = [{}];

    const characterArmorClass = {name:'Armor Class',value:'...'};
    const characterMaxHP = {name:'Max HP',value:'...'};
    const characterTempHP = {name:'Temp HP',value:'...'};
    const characterCurrentHP = {name:'Current Hit Points',value:'...'};

    const characterDice = [{name:'d6',value:0},
                {name:'d8',value:0},
                {name:'d10',value:0},
                {name:'d12',value:0}];
    const characterDeathSaves = {name:'Death Saves',value:'...'};
    const characterInitiative = {name:'Initiative',value:'...'};
    const characterSpeed = {name:'Speed',value:'...'};
    const characterVision = {name:'Vision',value:'...'};

    const characterAttacksSpells = [{name:'',attack:'',damage:'',range:'',ammo:'',used:''}];

    return(
        <>
            <h2 className='characterDisplayTitle'>Character Display</h2>
            <Container fluid className='characterDisplayContainer'>

                {/* ----------------General Info---------------- */}
                <Container fluid className='generalInformation characterDisplayContainer'>
                    <Row>
                        <Col>{characterDisplayCardSingle(characterName,'text')}</Col>
                        <Col xs={2}>{characterDisplayCardSingle(characterLevel,'number')}</Col>
                        <Col xs={3}>{characterDisplayCardSingle(characterXP,'number')}</Col>
                    </Row>
                    <Row>
                        <Col>{characterDisplayCardSingle(characterRace,'text')}</Col>
                        <Col>{characterDisplayCardSingle(characterClass,'text')}</Col>
                        <Col>{characterDisplayCardSingle(characterBackground,'text')}</Col>
                        <Col>{characterDisplayCardSingle(characterAlignment,'text')}</Col>
                    </Row>
                    <Row>
                        <Col>{characterDisplayCardSingle(playerName,'text')}</Col>
                        <Col>{characterDisplayCardSingle(playerGroup,'text')}</Col>
                    </Row>
                    <hr style={{color:'gray'}}></hr>
                </Container>

                {/* ----------------Ability Info---------------- */}
                <Container fluid className='abilityScoreInformation characterDisplayContainer'>
                    <Row>
                        <Col xs={7}>{characterDisplayCardSeriesRow(abilityScores,'number')}</Col>
                        <Col>{characterDisplayCardSingle(characterInspiration,'number')}</Col>
                        <Col>{characterDisplayCardSingle(characterProficiencyBonus,'number')}</Col>
                        <Col>{characterDisplayCardSingle(characterPassivePerception,'number')}</Col>
                    </Row>
                    <Row>
                        <Col>{characterDisplayCardSeriesRowWithCheck(characterSavingThrows,'number','Saving Throws')}</Col>
                    </Row>
                    <Row>
                        <Col>{characterDisplayCardSeriesRowWithCheck(characterSkills,'number','Skills')}</Col>
                    </Row>
                    <hr style={{color:'gray'}}></hr>
                </Container>

                {/* ----------------HP Info---------------- */}
                <Container fluid className='HPInformation characterDisplayContainer'>
                    <Row>
                        <Col>{characterDisplayCardSingle(characterArmorClass,'number')}</Col>
                        <Col>{characterDisplayCardSingle(characterMaxHP,'number')}</Col>
                        <Col>{characterDisplayCardSingle(characterTempHP,'number')}</Col>
                        <Col xs={5}>{characterDisplayCardSingle(characterCurrentHP,'number')}</Col>
                    </Row>
                    <hr style={{color:'gray'}}></hr>
                </Container>

                {/* ----------------Dice Info---------------- */}
                <Container fluid className='DiceInformation characterDisplayContainer'>
                    <Row>
                        <Col>{characterDisplayCardSeriesColumn(characterDice,'number','Hit Dice')}</Col>
                        <Col>{characterDisplayCardSingle(characterDeathSaves,'number')}</Col>
                        <Col>{characterDisplayCardSingle(characterInitiative,'number')}</Col>
                        <Col>{characterDisplayCardSingle(characterSpeed,'number')}</Col>
                        <Col>{characterDisplayCardSingle(characterVision,'number')}</Col>
                    </Row>
                    <hr style={{color:'gray'}}></hr>
                </Container>

                {/* ----------------Attacks and Spells---------------- */}
                <Container fluid className='AttacksSpellsInformation characterDisplayContainer'>
                    <Row>
                        <Col>{characterDisplayCardMultipleSeriesColumn(characterAttacksSpells,['name','attack','damage','range','ammo','used'],'Attacks and Spellcasting')}</Col>
                    </Row>
                    <hr style={{color:'gray'}}></hr>
                </Container>

                {/* ----------------Features and Traits---------------- */}
                <Container fluid className='FeaturesTraitsInformation characterDisplayContainer'>
                    <Row>
                        <Col>{characterDisplayCardSingle({name:'Features and Traits',value:'...'},'number','textarea')}</Col>
                    </Row>
                    <hr style={{color:'gray'}}></hr>
                </Container>

                {/* ----------------Other Proficiencies and Languages---------------- */}
                <Container fluid className='Other characterDisplayContainer'>
                    <Row>
                        <Col>{characterDisplayCardSingle({name:'Other Proficiences and Languages',value:'...'},'number','textarea')}</Col>
                    </Row>
                 <hr style={{color:'gray'}}></hr>
                </Container>

            </Container>
        </>
    );
}

export default CharacterDisplay;

// confirm page will be same as display page just with an addition save button
// display page on the top have a dropdown that will show all the characters