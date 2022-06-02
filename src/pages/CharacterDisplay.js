import './CharacterDisplay.css';
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, CardGroup, Card, Form, Button, ToggleButton, ToggleButtonGroup, DropdownButton, Tabs, Tab, ButtonToolbar, InputGroup } from 'react-bootstrap';
import { doc, getFirestore, getDoc, collection, getDocs } from "firebase/firestore"; 
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase-config';

// a card that has N number of headers and inputs but in a column format
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

// a card that has N number of headers and inputs but in a column format
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

// a card that has N number of headers and inputs and a checkbox but in a row format
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
                                <Form.Check className='characterDisplayCheckbox' defaultChecked={item.checked}/>
                                <Form.Control className='d-inline' style={{width:'80%', float:'right'}} readOnly={false} type={type} value={item.value}/>
                            </Card.Body>
                        </Card>
                    );}
                )}
            </CardGroup>
        </Card>
    );
}

// a card that has a single header and a single input
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

function CharacterDisplay() {
    // Code block that gets data from Firebase
    // use states that will hold the data taken from Firebase
    const [bigData, setBigData] = useState(0);
    const [charLevel, setCharLevel] = useState(1);
    const [charExp, setCharExp] = useState(0);
    const [charName, setCharName] = useState("");
    const [abilityScore, setAbilityScore] = useState([0,0,0,0,0,0]);
    const [bigBackgroundText, setBigBackgroundText] = useState("");
    const [maxCharacterHealth, setMaxCharacterHealth] = useState(0);
    const [characterHealth, setCharacterHealth] = useState(0);
    const [proficiencyBonus, setPorficiencyBonus] = useState(2);
    const [background, setBackground] = useState("");
    const [knownLang, setKnownLang] = useState("");
    const [className, setClassName] = useState("");
    const [charRace, setCharRace] = useState("");
    const [charSpeed, setCharSpeed] = useState("");
    const [hitDiceNumber, setHitDiceNumber] = useState(0);
    const [classProficiencies, setClassProficiencies] = useState("");
    // CON: 0, CHA: 1, DEX: 2, STR: 3, INT: 4, WIS: 5  NOT WORKING RN
    const [savingThrows, setSavingThrows] = useState([{name: "CON", value: 0, checked: false},
                                                        {name: "CHA", value: 0, checked: false}, 
                                                        {name: "DEX", value: 0, checked: false},
                                                        {name: "STR", value: 0, checked: false},
                                                        {name: "INT", value: 0, checked: false},
                                                        {name: "WIS", value: 0, checked: false}]);

    // Force Log in
    const navigate = useNavigate();
    const user = auth.currentUser;

    useEffect(()=>{
        if(!user){
            navigate("/login");
        }
    }, []) 

    // Function that gets the user's path in firebase and gets the charactersheet.json stored
    const getData = async () => {
        const uid= user.uid;
        const path="User/"+uid+"/characters/";
        const db = getFirestore();

        const docRef = doc(db, path, "characterSheet.json");
        const docSnap = await getDoc(docRef);
        const rawSnap = await docSnap.data();
        console.log(rawSnap)
        setBigData(rawSnap)

        // taking data from firebase and putting into useState
        setAbilityScore(rawSnap['abilityScores'])
        setBigBackgroundText(rawSnap['background']['feature_desc'][0] + '\n' + rawSnap['background']['feature_desc'][1])
        setMaxCharacterHealth(rawSnap['health'])
        setCharacterHealth(rawSnap['health'])
        setCharName(rawSnap['name'])

        // taking all the languages that the character should know(string form) and putting each language into an array
        let a = rawSnap['knownLanguages']
        let b = rawSnap['langClass']
        let c = rawSnap['langRace']
        var totalLang = a.concat(b).concat(c)
        var set = new Set(totalLang)
        totalLang = Array.from(set)
        setKnownLang(totalLang)

        setClassName(rawSnap['optClass']['name'])
        setHitDiceNumber(rawSnap['optClass']['hit_die'])
        setClassProficiencies(rawSnap['optClass']['proficiencies'])
        setBackground(rawSnap['background']['name'])

        // Go through saving throw array and find which ability scores should have plus 2 added
        var stProof = rawSnap['optClass']['saving_throws']
        stProof = stProof.replace(/\s/g, '');
        const stProofArray = stProof.split(",");
        
        for (let j = 0; j < stProofArray.length; j++) {
            for (let i = 0; i < rawSnap['abilityScores'].length; i++) {
                if (stProofArray[j] === savingThrows[i].name || savingThrows[i]['checked'] === true) {
                    setSavingThrows(savingThrows[i]['value'] = Math.floor((rawSnap['abilityScores'][i] - 10) / 2) + 2)
                    setSavingThrows(savingThrows[i]['checked'] = true)
                } else {
                    setSavingThrows(savingThrows[i]['value'] = Math.floor((rawSnap['abilityScores'][i] - 10) / 2))
                }
            }
        }
        
        console.log(savingThrows)

        setCharRace(rawSnap['optRace']['name'])
        setCharSpeed(rawSnap['optRace']['speed'])
    }

    useEffect(() => {
        getData();
    }, []);
    
    console.log(bigData);

    // metadata that the backend data will be equal to and eventually will be displayed onto the frontend
    const characterName = {name:'Character Name',value: charName};
    const characterLevel = {name:'Level',value: charLevel};
    const characterXP = {name:'Experience Points',value: charExp};
    const characterRace = {name:'Race',value: charRace};
    const characterClass = {name:'Class',value: className};
    const characterBackground = {name:'Background',value: background};
    const characterAlignment = {name:'Alignment',value:'...'};
    const playerName = {name:'Player Name',value:'...'};
    const playerGroup = {name:'Adventuring Group',value:'...'};

    const abilityScores = [{name:'CON',value: abilityScore[0]},
                            {name:'CHA',value: abilityScore[1]},
                            {name:'DEX',value: abilityScore[2]},
                            {name:'STR',value: abilityScore[3]},
                            {name:'INT',value: abilityScore[4]},
                            {name:'WIS',value: abilityScore[5]}];

    const characterInspiration = {name:'Inspiration',value:'...'};
    const characterProficiencyBonus = {name:'Proficiency Bonus',value: proficiencyBonus};
    const characterPassivePerception = {name:'Passive Perception',value:'...'};

    const characterSavingThrows = [{name:'CON',value: 0,checked: false},
                            {name:'CHA',value: 0,checked: false},
                            {name:'DEX',value: 0,checked: false},
                            {name:'STR',value: 0,checked: false},
                            {name:'INT',value: 0,checked: false},
                            {name:'WIS',value: 0,checked: false}];
    const characterSkills = [{}];

    const characterArmorClass = {name:'Armor Class',value:'...'};
    const characterMaxHP = {name:'Max HP',value: maxCharacterHealth};
    const characterTempHP = {name:'Temp HP',value:'...'};                   // empty
    const characterCurrentHP = {name:'Current Hit Points',value: characterHealth};

    const characterDeathSaves = {name:'Death Saves',value:'...'};
    const characterInitiative = {name:'Initiative',value:'...'};
    const characterSpeed = {name:'Speed',value: charSpeed};
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
                        <Col>{characterDisplayCardSingle({name: 'Hit Dice', value: hitDiceNumber},'number')}</Col>
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
                        <Col>{characterDisplayCardSingle({name:'Features and Traits',value: bigBackgroundText},'number','textarea')}</Col>
                    </Row>
                    <hr style={{color:'gray'}}></hr>
                </Container>

                {/* ----------------Other Proficiencies and Languages---------------- */}
                <Container fluid className='Other characterDisplayContainer'>
                    <Row>
                        <Col>{characterDisplayCardSingle({name:'Other Proficiences and Languages',value: knownLang + '\n' + classProficiencies},'number','textarea')}</Col>
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