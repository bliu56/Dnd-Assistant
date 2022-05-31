import './CharacterCreator.css';
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, CardGroup, Card, Form, Button, ToggleButton, ToggleButtonGroup, DropdownButton, Tabs, Tab, ButtonToolbar, ButtonGroup } from 'react-bootstrap';
import { dropMinRoll } from '../dropMinRoll';
import Select from 'react-select'
import DropdownItem from 'react-bootstrap/esm/DropdownItem';
import Axios from 'axios';
import { doc, getFirestore, setDoc } from "firebase/firestore"; 
import { auth } from '../firebase-config';


const file = require("../json/classes.json")

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
                    <ToggleButton className='charButton' id={item.name} key={index} onChange={() => setItemFxn(item)}>
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
    const [classFile, setClassFile] = useState(file);

    const [tabKey, setTabKey] = useState("barbarian")

    const [barbTab, setBarbTab] = useState(true);
    const [bardTab, setBardTab] = useState(true);
    const [clericTab, setClericTab] = useState(true);
    const [druidTab, setDruidTab] = useState(true);
    const [fighterTab, setFighterTab] = useState(true);
    const [monkTab, setMonkTab] = useState(true);
    const [paladinTab, setPaladinTab] = useState(true);
    const [rangerTab, setRangerTab] = useState(true);
    const [rougeTab, setRogueTab] = useState(true);
    const [sorcererTab, setSorcererTab] = useState(true);
    const [wizardTab, setWizardTab] = useState(true);
    const [warlockTab, setWarlockTab] = useState(true);


    // push if optclass = cleric
    const [selectedDomain, setSelectedDomain] = useState();
    const domains = [
        { value: 'knowledge', label: 'Knowledge'},
        { value: 'life', label: 'Life'},
        { value: 'light', label: 'Light'},
        { value: 'nature', label: 'Nature'},
        { value: 'tempest', label: 'Tempest'},
        { value: 'trickery', label: 'Trickery'},
        { value: 'war', label: 'War'},
    ]

    // push if optclass = fighter
    const [selectedStyle, setSelectedStyle] = useState();
    const styles = [
        { value: 'archery', label: 'Archery'},
        { value: 'defense', label: 'Defense'},
        { value: 'dueling', label: 'Dueling'},
        { value: 'great-weapon-fighting', label: 'Great Weapon Fighting'},
        { value: 'protection', label: 'Protection'},
        { value: 'two-weapon-fighting', label: 'Two-Weapon Fighting'},
    ]

    // push if optclass = sorcerer
    const [selectedOrigin, setSelectedOrigin] = useState();
    const origin = [
        { value: 'draconic-bloodline', label: 'Draconic Bloodline'},
        { value: 'wild-magic', label: 'Wild Magic'},
    ]

    // push if optclass = sorcerer and selecetedOrigin = dragonic-bloodline
    const [ selectedDragonAncestor, setSelectedDragonAncestor] = useState();
    const dragonAncestor = [
        { value: 'black', label: 'Black - Acid'},
        { value: 'blue', label: 'Blue - Lightning'},
        { value: 'brass', label: 'Brass - Fire'},
        { value: 'bronze', label: 'Bronze - Lightning'},
        { value: 'copper', label: 'Copper - Acid'},
        { value: 'gold', label: 'Gold - Fire'},
        { value: 'green', label: 'Green - Poison'},
        { value: 'red', label: 'Red - Fire'},
        { value: 'silver', label: 'Silver - Cold'},
        { value: 'white', label: 'White - Cold'},
    ]

    //push if optclass = warlock
    const [ selectedPatron, setSelectedPatron] = useState();
    const patron = [
        { value: 'archfey', label: 'Archfey'},
        { value: 'fiend', label: 'Fiend'},
        { value: 'great-old-one', label: 'Great Old One'},
    ]

    const [classProf, setClassProf] = useState([]);
    const [raceProf, setRaceProf] = useState([]);

    const [classSkills, setClassSkills] = useState([
        { name: 'acrobatics', state: false},
        { name: 'animal-handling', state: false},
        { name: 'arcana', state: false},
        { name: 'athletics', state: false},
        { name: 'deception', state: false},
        { name: 'history', state: false},
        { name: 'insight', state: false},
        { name: 'intimidation', state: false},
        { name: 'investigation', state: false},
        { name: 'medicine', state: false},
        { name: 'nature', state: false},
        { name: 'perception', state: false},
        { name: 'performance', state: false},
        { name: 'persuasion', state: false},
        { name: 'religion', state: false},
        { name: 'slight-of-hand', state: false},
        { name: 'stealth', state: false},
        { name: 'survival', state: false}
    ]);

    const [raceSkills, setRaceSkills] = useState([
        { name: 'acrobatics', state: false},
        { name: 'animal-handling', state: false},
        { name: 'arcana', state: false},
        { name: 'athletics', state: false},
        { name: 'deception', state: false},
        { name: 'history', state: false},
        { name: 'insight', state: false},
        { name: 'intimidation', state: false},
        { name: 'investigation', state: false},
        { name: 'medicine', state: false},
        { name: 'nature', state: false},
        { name: 'perception', state: false},
        { name: 'performance', state: false},
        { name: 'persuasion', state: false},
        { name: 'religion', state: false},
        { name: 'slight-of-hand', state: false},
        { name: 'stealth', state: false},
        { name: 'survival', state: false}
    ]);

    const [choiceNum, setChoiceNum] = useState();
    const [classChoices, setClassChoices] = useState([]);

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

    //push optRace, optClass, abilities
    const [optRace,setOptRace] = useState(characterRaces[0]);
    const [optClass,setOptClass] = useState(characterClasses[0]);
    const [optBackground,setOptBackground] = useState(characterBackgrounds[0]);
    const [optAbilities,setOptAbilities] = useState(characterAbilities[0]);
    const [charAbilities,setCharAbilities] = useState([0,0,0,0,0,0]);
    const [abilityPoints,setAbilityPoints] = useState(27);
    const [dieRollResult,setdieRollResult] = useState([0]);
    const [curStat, setCurStat]            = useState({0 : 'CHA', 1 : 0});

    const handleDomain = (e) => {
        setSelectedDomain(e.value);
    }

    const handleStyle = (e) => {
        setSelectedStyle(e.value);
    }

    const handleOrigin = (e) => {
        setSelectedOrigin(e.value);
    }

    const handleDragonAncestor = (e) => {
        setSelectedDragonAncestor(e.value);
    }

    const handlePatron = (e) => {
        setSelectedPatron(e.value);
    }

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
    const handleSetAbilityScore = (event, index, isBuy) => {
        let newScore = Number(event.target.value);
        let remainingAbilityPoints = abilityPoints + charAbilities[index] - newScore
        if(remainingAbilityPoints >= 0 || !isBuy) {
            charAbilities[index] = newScore;
            setCharAbilities(charAbilities);
            setAbilityPoints(remainingAbilityPoints);
        }
    }
    
    /*-----------------------------------------------------------------------load Race/Class/Abilities Buttons------------------ */
    useEffect(() => {
        loadRaces(); // eslint-disable-next-line react-hooks/exhaustive-deps
        loadClasses(); // eslint-disable-next-line react-hooks/exhaustive-deps
        loadAbilities(); // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    //Races
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
    //Classes
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

    // Abilities
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
    
    /* -------------------------------------------------------------------------- CLASS --------------------------------------------*/
    // grab class file and manually direct the tab to the selected class
    useEffect(() => {
        let temp = optClass.name;
        setClassTab(temp); // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [optClass])
    
    // Sets all the tabs for class features to disabled 
    const setTabTrue = () => {
        setBarbTab(true);
        setBardTab(true);
        setClericTab(true);
        setDruidTab(true);
        setFighterTab(true);
        setMonkTab(true);
        setPaladinTab(true);
        setRangerTab(true);
        setRogueTab(true);
        setSorcererTab(true);
        setWizardTab(true);
        setWarlockTab(true);        
    }
    
    // Gets the correct class file, then automatically makes the class tab selecetd and disables the rest
    const setClassTab = (e) => {
        if(e === "Bard"){
            setClassFile(file.Bard);
            setTabTrue();
            setBardTab(false);
            setTabKey("bard")
        }
        else if (e === "Barbarian"){
            setClassFile(file.Barbarian);
            setTabTrue();
            setBarbTab(false);
            setTabKey("barbarian")
        }
        else if (e === "Druid"){
            setClassFile(file.Druid)
            setTabTrue();
            setDruidTab(false);
            setTabKey("druid")
        }
        else if (e === "Cleric"){
            setClassFile(file.Cleric)
            setTabTrue();
            setClericTab(false);
            setTabKey("cleric")
        }
        else if (e === "Fighter"){
            setClassFile(file.Fighter)
            setTabTrue();  
            setFighterTab(false);
            setTabKey("fighter")
        }
        else if (e === "Monk"){
            setClassFile(file.Monk)
            setTabTrue();
            setMonkTab(false);
            setTabKey("monk")
        }
        else if (e === "Paladin"){
            setClassFile(file.Paladin)
            setTabTrue();
            setPaladinTab(false);
            setTabKey("paladin")
        }
        else if (e === "Ranger"){
            setClassFile(file.Ranger)
            setTabTrue();
            setRangerTab(false);
            setTabKey("ranger")
        }
        else if (e === "Rogue"){
            setClassFile(file.Rouge)
            setTabTrue();
            setRogueTab(false);
            setTabKey("rogue")
        }
        else if (e === "Warlock"){
            setClassFile(file.Warlock)
            setTabTrue();
            setWarlockTab(false);
            setTabKey("warlock")
        }
        else if (e === "Sorcerer"){
            setClassFile(file.Sorcerer)
            setTabTrue();
            setSorcererTab(false);
            setTabKey("sorcerer")
        }
        else if (e === "Wizard"){
            setClassFile(file.Wizard)
            setTabTrue();
            setWizardTab(false);
            setTabKey("wizard")
        }
    }   

    /* ------------------------------------------------------------------------- Class Prof -----------------------------------*/
    const profChoices = () => {
        try{
            Axios.get("https://www.dnd5eapi.co/api/classes/" + optClass.name.toLowerCase()).then(
                (r) => {
                    let temp = JSON.parse(JSON.stringify(r.data));
                    let choiceArray = temp.proficiency_choices[0].from;
                    let tempArray = []

                    for( let q = 0; q < choiceArray.length; q++){
                        var result = raceSkills.filter(skill => skill.name === choiceArray[q].index.substring(6))
                        if(result[0].state === false){
                            tempArray.push({name:choiceArray[q].index.substring(6), state: result[0].state})
                        }
                    }

                    setChoiceNum(temp.proficiency_choices[0].choose)
                    setClassChoices(tempArray)
                }
            )
        }
        catch{}
    }

    const updateChoice = (choice) => {
        setClassChoices(
            classChoices.map( (prevChoice) =>
                prevChoice.name === choice? {...prevChoice, state: !prevChoice.state} : {...prevChoice}
            )
        );

        setClassSkills(
            classSkills.map( (prevChoice) =>
                prevChoice.name === choice? {...prevChoice, state: !prevChoice.state} : {...prevChoice}
            )
        );
    }

    /* ----------------return JSX stuff---------------- */
    useEffect(() => {
        let tempArray = [];
        try{
            let profArray = classFile.Class_Features.Proficiencies;
            tempArray.push(profArray.content[0]);
            tempArray.push(profArray.content[1]);
            profChoices();
        }
        catch(err){

        }
        setClassProf(tempArray);
    }, [classFile])

    /* ------------------------------------------------------------------------ Race Prof ----------------------------------*/
    useEffect(() => {
        try{
            Axios.get("https://www.dnd5eapi.co/api/races/" + (optRace.name.toLowerCase())).then(
                (r) => {
                    let tempArray = []
                    let tempR = JSON.parse(JSON.stringify(r.data));
                    try{
                        for( let q = 0; q < tempR.starting_proficiencies.length; q++ ){
                            var tempProf = tempR.starting_proficiencies[q].index;
                            let skillCheck = tempProf.substring(0,5)
                            if(skillCheck === 'skill'){
                                let raceSkill = tempProf.substring(6)
                                raceSkills.map((curSkill) => curSkill.name === raceSkill? curSkill.state = true : curSkill.state = false)
                            }
                            else
                            {
                                tempArray.push(tempProf);
                            }
                        }
                    }
                    catch{}
                    setRaceProf(tempArray);

                    try{
                    }
                    catch{}
                }
            );
        }
        catch{}

    }, [optRace]);

    function pushTofirebae()
    {

        const db=getFirestore();
        var user=auth.currentUser;
        const uid=user.uid;

        const path="User/"+uid+"/characters"
        const fileName="tst3.json";
        console.log(optRace);

        console.log("");
        console.log(optClass);

        var myData={};

        if(optClass.name==="Cleric")
        {
            myData={"optClass":optClass,"domains":selectedDomain};
        }

        else if (optClass.name==="Fighter")
        {
            myData={"optClass":optClass,"styles":selectedStyle};

        }
        else if (optClass.name==="Sorcerer" && selectedOrigin==="draconic-bloodline")
        {
            myData={"optClass":optClass,"origin":selectedOrigin,"dragonAncestor":selectedDragonAncestor};

        }
        else if (optClass.name==="Sorcerer")
        {
            myData={"optClass":optClass,"origin":selectedOrigin};

        }
        else if (optClass.name==="Warlock")
        {
            myData={"optClass":optClass,"patron":selectedPatron};

        }
        else if (optClass.name==="Druid" || optClass.name==="Barbarian" || optClass.name==="Monk" || optClass.name==="Bard" || optClass.name==="Paladin" || optClass.name==="Ranger" || optClass.name==="Rouge" || optClass.name==="Wizard")
        {
            myData={"optClass":optClass};

        }
        

        myData.optRace=optRace;


        setDoc(doc(db,path, fileName), myData);


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
                                    <h5><strong>Race: </strong>{optRace.name}</h5><hr/>
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
                                    <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example" className="mb-3" activeKey={tabKey} onSelect={(k)=> setTabKey(k)}>
                                        <Tab eventKey="barbarian" title="Barbarian" disabled={barbTab}>
                                            <div>
                                                Rage: 
                                                    <p>
                                                        <span>In battle, you fight with primal ferocity. On your turn, you can enter a rage as a bonus action.</span>
                                                        <br/>
                                                        <span>
                                                        While raging, you gain the following benefits if you aren’t wearing heavy armor:
                                                            <li>
                                                                You have advantage on Strength checks and Strength saving throws.
                                                            </li>
                                                            <li>
                                                                When you make a melee weapon attack using Strength, you gain a bonus to the damage roll that increases as you gain levels as a barbarian.
                                                            </li>
                                                            <li>
                                                                You have resistance to bludgeoning, piercing, and slashing damage.
                                                            </li>
                                                        </span>
                                                        <span>If you are able to cast spells, you can’t cast them or concentrate on them while raging. </span> 
                                                        <br/>
                                                        <span>Your rage lasts for 1 minute. It ends early if you are knocked unconscious or if your turn ends and you haven’t attacked a hostile creature since your last turn or taken damage since then. You can also end your rage on your turn as a bonus action.</span>
                                                        <br/>
                                                        <span>Once you have raged the number of times shown for your barbarian level in the Rages column of the Barbarian table, you must finish a long rest before you can rage again.</span>
                                                    </p>
                                                <hr/>
                                                    <p>
                                                        Unarmored Defense:
                                                        <br/>
                                                        <span>While you are not wearing any armor, your Armor Class equals 10 + your Dexterity modifier + your Constitution modifier. You can use a shield and still gain this benefit.</span>
                                                    </p>

                                            </div>
                                        </Tab>
                                        <Tab eventKey="cleric" title="Cleric" disabled={clericTab}>
                                            <div>
                                                <p>
                                                Spellcasting:
                                                <br/>
                                                    <span>As a conduit for divine power, you can cast cleric spells.</span>
                                                </p>
                                                <hr/>
                                                <div>
                                                Divine Domain:
                                                <br/>
                                                    <span>Select one: <Select options={domains} onChange={handleDomain} /></span>
                                                </div>
                                            </div>
                                        </Tab>
                                        <Tab eventKey="bard" title="Bard" disabled={bardTab}>
                                            <div>
                                                <p>
                                                Spellcasting:
                                                <br/>
                                                    <span>You have learned to untangle and reshape the fabric of reality in harmony with your wishes and music.</span>
                                                </p>
                                                <hr/>
                                                Bardic Inspiration:
                                                <p>
                                                    <span>You can inspire others through stirring words or music. To do so, you use a bonus action on your turn to choose one creature other than yourself within 60 feet of you who can hear you. That creature gains one Bardic Inspiration die, a d6.</span>
                                                    <br/>
                                                    <span>Once within the next 10 minutes, the creature can roll the die and add the number rolled to one ability check, attack roll, or saving throw it makes. The creature can wait until after it rolls the d20 before deciding to use the Bardic Inspiration die, but must decide before the GM says whether the roll succeeds or fails. Once the Bardic Inspiration die is rolled, it is lost. A creature can have only one Bardic Inspiration die at a time.</span>
                                                    <br/>
                                                    <span>You can use this feature a number of times equal to your Charisma modifier (a minimum of once). You regain any expended uses when you finish a long rest.</span>
                                                    <br/>
                                                    <span>Your Bardic Inspiration die changes when you reach certain levels in this class. The die becomes a d8 at 5th level, a d10 at 10th level, and a d12 at 15th level.</span>
                                                </p>
                                            </div>
                                        </Tab>
                                        <Tab eventKey="druid" title="Druid" disabled={druidTab}>
                                            <div>
                                                <p>
                                                Spellcasting:
                                                <br/>
                                                <span>Drawing on the divine essence of nature itself, you can cast spells to shape that essence to your will.</span>
                                                </p>
                                                <hr/>
                                                Druidic:
                                                <p>
                                                    <span>You know Druidic, the secret language of druids. You can speak the language and use it to leave hidden messages. You and others who know this language automatically spot such a message. Others spot the message’s presence with a successful DC 15 Wisdom (Perception) check but can’t decipher it without magic.</span>
                                                </p>
                                            </div>
                                        </Tab>
                                        <Tab eventKey="fighter" title="Fighter" disabled={fighterTab}>
                                            <div>
                                                <div>
                                                Fighting Style:
                                                <br/>
                                                    <span>Select one: <Select options={styles} onChange={handleStyle} /></span>
                                                </div>
                                                <hr/>
                                                <p>
                                                Second Wind:
                                                <br/>
                                                    <span>You have a limited well of stamina that you can draw on to protect yourself from harm. On your turn, you can use a bonus action to regain hit points equal to 1d10 + your fighter level. Once you use this feature, you must finish a short or long rest before you can use it again.</span>
                                                </p>
                                            </div>
                                        </Tab>
                                        <Tab eventKey="monk" title="Monk" disabled={monkTab}>
                                            <div>
                                                <p>
                                                Unarmored Defense:
                                                <br/>
                                                    <span>Beginning at 1st level, while you are wearing no armor and not wielding a shield, your AC equals 10 + your Dexterity modifier + your Wisdom modifier.</span>
                                                </p>
                                                <hr/>
                                                Martial Arts:
                                                <p>
                                                    <span>At 1st level, your practice of martial arts gives you mastery of combat styles that use unarmed strikes and monk weapons, which are shortswords and any simple melee weapons that don’t have the two- handed or heavy property.</span>
                                                    <br/>
                                                    <span>
                                                        You gain the following benefits while you are unarmed or wielding only monk weapons and you aren’t wearing armor or wielding a shield:
                                                        <li>
                                                            You can use Dexterity instead of Strength for the attack and damage rolls of your unarmed strikes and monk weapons.
                                                        </li>
                                                        <li>
                                                            You can roll a d4 in place of the normal damage of your unarmed strike or monk weapon. This die changes as you gain monk levels, as shown in the Martial Arts column of the Monk table.
                                                        </li>
                                                        <li>
                                                            When you use the Attack action with an unarmed strike or a monk weapon on your turn, you can make one unarmed strike as a bonus action. For example, if you take the Attack action and attack with a quarterstaff, you can also make an unarmed strike as a bonus action, assuming you haven’t already taken a bonus action this turn.
                                                        </li>
                                                    </span>
                                                    <br/>
                                                    <span>Certain monasteries use specialized forms of the monk weapons. For example, you might use a club that is two lengths of wood connected by a short chain (called a nunchaku) or a sickle with a shorter, straighter blade (called a kama). Whatever name you use for a monk weapon, you can use the game statistics provided for the weapon.</span>

                                                </p>
                                            </div>
                                        </Tab>
                                        <Tab eventKey="paladin" title="Paladin" disabled={paladinTab}>
                                            <div>
                                                <p>
                                                Divine Sense:
                                                <br/>
                                                    <span>The presence of strong evil registers on your senses like a noxious odor, and powerful good rings like heavenly music in your ears. </span>
                                                    <br/>
                                                    <span>As an action, you can open your awareness to detect such forces. Until the end of your next turn, you know the location of any celestial, fiend, or undead within 60 feet of you that is not behind total cover. You know the type (celestial, fiend, or undead) of any being whose presence you sense, but not its identity (the vampire,
                                                                                                            Count Strahd von Zarovich, for instance).</span>
                                                    <br/>
                                                    <span>Within the same radius, you also detect the presence of any place or object that has been consecrated or desecrated, as with the *hallow* spell.</span>
                                                    <br/>
                                                    <span>You can use this feature a number of times equal to 1 + your Charisma modifier. When you finish a long rest, you regain all expended uses.</span>
                                                </p>
                                                <hr/>
                                                Lay on Hands:
                                                <p>
                                                    <span>Your blessed touch can heal wounds. You have a pool of healing power that replenishes when you take a long rest. With that pool, you can restore a total number of hit points equal to your paladin level × 5.</span>
                                                    <br/>
                                                    <span>As an action, you can touch a creature and draw power from the pool to restore a number of hit points to that creature, up to the maximum amount remaining in your pool.</span>
                                                    <br/>
                                                    <span>Alternatively, you can expend 5 hit points from your pool of healing to cure the target of one disease or neutralize one poison affecting it. You can cure multiple diseases and neutralize multiple poisons with a single use of Lay on Hands, expending hit points separately for each one.</span>
                                                    <br/>
                                                    <span>This feature has no effect on undead and constructs.</span>
                                                </p>
                                            </div>
                                        </Tab>
                                        <Tab eventKey="ranger" title="Ranger" disabled={rangerTab}>
                                            <div>
                                                <p>
                                                Favored Enemy:
                                                <br/>
                                                    <span>Beginning at 1st level, you have significant experience studying, tracking, hunting, and even talking to a certain type of enemy.</span>
                                                    <br/>
                                                    <span>Choose a type of favored enemy: aberrations, beasts, celestials, constructs, dragons, elementals, fey, fiends, giants, monstrosities, oozes, plants, or undead. Alternatively, you can select two races of humanoid (such as gnolls and orcs) as favored enemies.</span>
                                                    <br/>
                                                    <span>When you gain this feature, you also learn one language of your choice that is spoken by your favored enemies, if they speak one at all.</span>
                                                    <br/>
                                                    <span>You choose one additional favored enemy, as well as an associated language, at 6th and 14th level. As you gain levels, your choices should reflect the types of monsters you have encountered on your adventures.</span>
                                                </p>
                                                <hr/>
                                                Natural Explorer:
                                                <p>
                                                    <span>You are particularly familiar with one type of natural environment and are adept at traveling and surviving in such regions. Choose one type of favored terrain: arctic, coast, desert, forest, grassland, mountain, or swamp. When you make an Intelligence or Wisdom check related to your favored terrain, your proficiency bonus is doubled if you are using a skill that you’re proficient in.</span>
                                                    <br/>
                                                    <span>
                                                        While traveling for an hour or more in your favored terrain, you gain the following benefits:
                                                        <li>
                                                            Difficult terrain doesn’t slow your group’s travel.
                                                        </li>
                                                        <li>
                                                            Your group can’t become lost except by magical means.
                                                        </li>
                                                        <li>
                                                            Even when you are engaged in another activity while traveling (such as foraging, navigating, or tracking), you remain alert to danger.
                                                        </li>
                                                        <li>
                                                            If you are traveling alone, you can move stealthily at a normal pace.
                                                        </li>
                                                        <li>
                                                            When you forage, you find twice as much food as you normally would.
                                                        </li>
                                                        <li>
                                                            While tracking other creatures, you also learn their exact number, their sizes, and how long ago they passed through the area.
                                                        </li>
                                                    </span>
                                                    <br/>
                                                    <span>You choose additional favored terrain types at 6th and 10th level.</span>
                                                </p>
                                            </div>
                                        </Tab>
                                        <Tab eventKey="rogue" title="Rogue" disabled={rougeTab}>
                                            <div>
                                                <p>
                                                Sneak Attack:
                                                <br/>
                                                    <span>Beginning at 1st level, you know how to strike subtly and exploit a foe’s distraction. Once per turn, you can deal an extra 1d6 damage to one creature you hit with an attack if you have advantage on the attack roll. The attack must use a finesse or a ranged weapon.</span>
                                                    <br/>
                                                    <span>You don’t need advantage on the attack roll if another enemy of the target is within 5 feet of it, that enemy isn’t incapacitated, and you don’t have disadvantage on the attack roll.</span>
                                                    <br/>
                                                    <span>The amount of the extra damage increases as you gain levels in this class, as shown in the Sneak Attack column of the Rogue table.</span>
                                                </p>
                                                <hr/>
                                                Thieves’ Cant:
                                                <p>
                                                    <span>During your rogue training you learned thieves’ cant, a secret mix of dialect, jargon, and code that allows you to hide messages in seemingly normal conversation. Only another creature that knows thieves’ cant understands such messages. It takes four times longer to convey such a message than it does to speak the same idea plainly.</span>
                                                    <br/>
                                                    <span>In addition, you understand a set of secret signs and symbols used to convey short, simple messages, such as whether an area is dangerous or the territory of a thieves’ guild, whether loot is nearby, or whether the people in an area are easy marks or will provide a safe house for thieves on the run.</span>
                                                </p>
                                            </div>
                                        </Tab>
                                        <Tab eventKey="sorcerer" title="Sorcerer" disabled={sorcererTab}>
                                            <div>
                                                <p>
                                                Spellcasting:
                                                <br/>
                                                <span>An event in your past, or in the life of a parent or ancestor, left an indelible mark on you, infusing you with arcane magic. This font of magic, whatever its origin, fuels your spells.</span>
                                                </p>
                                                <hr/>
                                                <div>
                                                Sorcerous Origin:
                                                <br/>
                                                    <span>
                                                        <Select options={origin} onChange={handleOrigin}/>
                                                    </span>
                                                    <br/>
                                                    <div>
                                                        {selectedOrigin === 'draconic-bloodline'? 
                                                            <div>
                                                                Choose one type of dragon as your ancestor(Dragon Type - Damage Type). <br/>
                                                                <Select options={dragonAncestor} onChange={handleDragonAncestor}/>  <br/>
                                                                <span>You can speak, read, and write Draconic. Additionally, whenever you make a Charisma check when interacting with dragons, your proficiency bonus is doubled if it applies to the check.</span> <hr/>
                                                                Draconic Resilience: <br/>
                                                                    <span>As magic flows through your body, it causes physical traits of your dragon ancestors to emerge. At 1st level, your hit point maximum increases by 1 and increases by 1 again whenever you gain a level in this class.</span>
                                                                    <br/>
                                                                    <span>Additionally, parts of your skin are covered by a thin sheen of dragon-like scales. When you aren’t wearing armor, your AC equals 13 + your Dexterity modifier.</span>
                                                            </div>  
                                                            : 
                                                            <div>
                                                                Tides of Chaos: <br/>
                                                                <span>Starting at 1st level, you can manipulate the forces of chance and chaos to gain advantage on one attack roll, ability check, or saving throw. Once you do so, you must finish a long rest before you can use this feature again.</span> <br/>
                                                                <span>Any time before you regain the use of this feature, the DM can have you roll on the Wild Magic Surge table immediately after you cast a sorcerer spell of 1st level or higher. You then regain the use of this feature.</span> <br/>
                                                                Wild Magic Surge: <br/>
                                                                <span>Starting when you choose this origin at 1st level, your Spellcasting can unleash surges of untamed magic. Immediately after you cast a sorcerer spell of 1st level or higher, the DM can have you roll a d20. If you roll a 1, roll on the Wild Magic Surge table to create a random magical effect.</span>
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </Tab>
                                        <Tab eventKey="warlock" title="Warlock" disabled={warlockTab}>
                                            <div>
                                                Pact Magic: <br/>
                                                <span>Your arcane research and the magic bestowed on you by your patron have given you facility with spells.</span>
                                                <hr/>
                                                Select Otherworldly Patron:
                                                <Select options={patron} onChange={handlePatron}/>
                                            </div>
                                        </Tab>
                                        <Tab eventKey="wizard" title="Wizard" disabled={wizardTab}>
                                            <div>
                                                Spellcasting: <br/>
                                                <span>As a student of arcane magic, you have a spellbook containing spells that show the first glimmerings of your true power.</span> <hr/>
                                                Arcane Recovery: <br/>
                                                <span>You have learned to regain some of your magical energy by studying your spellbook. Once per day when you finish a short rest, you can choose expended spell slots to recover. The spell slots can have a combined level that is equal to or less than half your wizard level (rounded up), and none of the slots can be 6th level or higher.
                                                    For example, if you’re a 4th-level wizard, you can recover up to two levels worth of spell slots. You can recover either a 2nd-level spell slot or two 1st-level spell slots.</span>
                                            </div>
                                        </Tab>
                                    </Tabs>
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
                <Row className='characterCardRow'>
                    <Col xs={7} className='characterOptionsCol'>
                        <Card className='characterOptionsCard characterCreatorCard' border='light'>
                            <Card.Header>Proficiencies</Card.Header>
                            <Card.Body>
                                <div>
                                    Proficienes recieved from {optRace.name}: {raceProf.map((item, index)=>{
                                        return(
                                            <div key={index}>{item}</div>
                                        )
                                    })}
                                </div>
                                <hr/>
                                <div>
                                    Proficienes recieved from {optClass.name}: {classProf.map((item, index)=>{
                                        return(
                                            <div key={index}>{item}</div>
                                        )
                                    })}
                                    {optClass.name === 'Cleric'? 
                                        selectedDomain === 'life' | selectedDomain === 'nature' | selectedDomain === 'tempest'? 
                                                selectedDomain === 'tempest' | selectedDomain === 'war'?
                                                    <div><hr/> Proficienes recieved from Domain: <br/> Heavy Armor, Martial Weapons</div>
                                                :
                                                <div><hr/> Proficienes recieved from Domain: <br/> Heavy Armor</div>
                                            : <div></div>
                                        :
                                        <div></div>
                                    }
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

                {/* ----------------Skills---------------- */}
                <Row className='characterCardRow'>
                    <Col xs={7} className='characterOptionsCol'>
                        <Card className='characterOptionsCard characterCreatorCard' border='light'>
                            <Card.Header>Skills</Card.Header>
                            <Card.Body>
                                <div>
                                    Skills recieved from {optRace.name}: {raceSkills.map((item, index)=>{
                                        return(
                                        item.state === true? 
                                            <div key={index}> {item.name} </div>
                                        :   
                                            <div key={index}></div>
                                        );
                                    })}
                                </div>
                                <hr/>
                                <div>
                                    Pick {choiceNum} <br/>
                                    {classChoices.map((item, idx) => (
                                        <ToggleButton
                                            key={idx}
                                            id={`radio-${idx}`}
                                            type="checkbox"
                                            variant="primary"
                                            checked={item.state}
                                            onChange={()=>{updateChoice(item.name)}}
                                        >
                                            {item.name}
                                        </ToggleButton>
                                    ))}
                                    
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

                {/* ----------------HP---------------- */}
                {characterCreatorCardPlaceHolder("HP")}

                {/* ----------------Spells---------------- */}
                {characterCreatorCardPlaceHolder("Spells")}

                {/* ----------------Equipment---------------- */}
                {characterCreatorCardPlaceHolder("Equipment")}
            </Container>

            {/* ----------------Save Button---------------- */}
            <Button className='saveButton'>Save</Button>
            <button onClick={pushTofirebae}>Submit</button>


        </>
    );
}

export default CharacterCreator;