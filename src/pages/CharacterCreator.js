import './CharacterCreator.css';
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, CardGroup, Card, Form, Button, ToggleButton, ToggleButtonGroup, DropdownButton, Tabs, Tab, ButtonToolbar, ButtonGroup } from 'react-bootstrap';
import { dropMinRoll } from '../comp/dropMinRoll';
import Select from 'react-select'
import DropdownItem from 'react-bootstrap/esm/DropdownItem';
import { Link, useNavigate } from 'react-router-dom';
import Axios from 'axios';
import { doc, getFirestore, setDoc } from "firebase/firestore"; 
import { auth } from '../firebase-config';
import { diceRoll } from '../comp/diceRoll';


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
function optionsToolBar(list, setItemFxn, size='md'){
    return(
        <ButtonToolbar>
            {list.map((item, index) => {
                return(
                    <Button className='charButton' onClick={() => setItemFxn(item)} key={index} size={size} variant='outline-primary'>
                        {item.name}
                    </Button>
                );
            })}
        </ButtonToolbar>
    );
}
function optionsToggleButtonGroup(list, handleFxn, size='md'){
    return(
        <ButtonToolbar>
            {list.map((item, index) => {
                return(
                    <ToggleButton className='charButton' type='checkbox' onChange={() => handleFxn(item)}
                        id={item.name} value={item.name} key={index} checked={item.state}
                        size={size} variant='outline-primary'>
                        {item.name}
                    </ToggleButton>
                );
            })}
        </ButtonToolbar>
    );
}
function optionsDropdown(name, list, setItemFxn){
    return(
        <DropdownButton title={name}>
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
        { value: 'wild-magic', label: 'Wild Magic'},
        { value: 'draconic-bloodline', label: 'Draconic Bloodline'},
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

    const [arrayNum, setArrayNum] = useState(0)

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

    const [skillChoiceNum, setSkillChoiceNum] = useState();
    const [classChoices, setClassChoices] = useState([]);

    const [knownLanguages, setKnownLanguages] = useState([]);

    const [langChoiceNum, setLangChoiceNum] = useState();
    const [langClassChoices, setLangClassChoices] = useState([
        {name: "common", state: false},
        {name: "dwarvish", state: false},
        {name: "elvish", state: false},
        {name: "giant", state: false},
        {name: "gnomish", state: false},
        {name: "goblin", state: false},
        {name: "halfling", state: false},
        {name: "orc", state: false},
        {name: "abyssal", state: false},
        {name: "celestial", state: false},
        {name: "draconic", state: false},
        {name: "deep-speech", state: false},
        {name: "infernal", state: false},
        {name: "primordial", state: false},
        {name: "sylvan", state: false},
        {name: "undercommon", state: false}
    ]);
    const [langRaceChoices, setLangRaceChoices] = useState([]);

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
            skills: "",
            hp: "",
            starting_equipment: [],
	        starting_equipment_options: []
        }
    ]);
    const [characterBackgrounds, setCharacterBackgrounds] = useState([
        {
            name: 'background',
            info: '',
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
    const [characterSpells, setCharacterSpells] = useState([
        {
            name:'',
            desc:''
        }
    ]);
    const [characterCantrips, setCharacterCantrips] = useState([
        {
            name:'',
            desc:''
        }
    ]);

    const [backGroundEquipment, setBackGroundEquipment] = useState([
		{
			name: "Clothes, common",
            desc: [],
			quantity: 1
		},
        {
		    name: "Pouch",
            desc: [],
			quantity: 1
		}
	]);
    const [backGroundEquipmentOptions, setBackGroundEquipmentOptions] = useState([
		{
			name: "Amulet",
			desc: [
                "A holy symbol is a representation of a god or pantheon. It might be an amulet depicting a symbol representing a deity, the same symbol carefully engraved or inlaid as an emblem on a shield, or a tiny box holding a fragment of a sacred relic.",
                " Appendix B lists the symbols commonly associated with many gods in the multiverse. A cleric or paladin can use a holy symbol as a spellcasting focus. To use the symbol in this way, the caster must hold it in hand, wear it visibly, or bear it on a shield."
            ],
            quantity: 1
		},
		{
		    name: "Emblem",
			desc: [
                "A holy symbol is a representation of a god or pantheon. It might be an amulet depicting a symbol representing a deity, the same symbol carefully engraved or inlaid as an emblem on a shield, or a tiny box holding a fragment of a sacred relic.",
                " Appendix B lists the symbols commonly associated with many gods in the multiverse. A cleric or paladin can use a holy symbol as a spellcasting focus. To use the symbol in this way, the caster must hold it in hand, wear it visibly, or bear it on a shield."
            ],
            quantity: 1
		},
		{
			"name": "Reliquary",
			desc: [
                "A holy symbol is a representation of a god or pantheon. It might be an amulet depicting a symbol representing a deity, the same symbol carefully engraved or inlaid as an emblem on a shield, or a tiny box holding a fragment of a sacred relic.",
                " Appendix B lists the symbols commonly associated with many gods in the multiverse. A cleric or paladin can use a holy symbol as a spellcasting focus. To use the symbol in this way, the caster must hold it in hand, wear it visibly, or bear it on a shield."
            ],
            quantity: 1
		}
	]); 

    const [optEquipment, setOptEquipment] = useState([
        {
            name: "",
            desc: [],
            quantity: 0
        }, 		
        {
            name: "Clothes, common",
            desc: [],
            quantity: 1
        },
        {
            name: "Pouch",
            desc: [],
            quantity: 1
        }]);

    const [characterSpellCount,setCharacterSpellCount] = useState({cantrips:0,spells:0});

    //push optRace, optClass, abilities
    const [optName,setOptName] = useState('');
    const [optRace,setOptRace] = useState(characterRaces[0]);
    const [optClass,setOptClass] = useState(characterClasses[0]);
    const [optBackground,setOptBackground] = useState(characterBackgrounds[0]);
    const [optAbilities,setOptAbilities] = useState(characterAbilities[0]);
    const [viewSpell,setViewSpell] = useState(characterSpells[0]);
    // Holds the character abilite scores in order:
    // CON/CHA/DEX/STR/INT/WIS
    const [charAbilities,setCharAbilities] = useState([8,8,8,8,8,8]);
    const [abilityPoints,setAbilityPoints] = useState(27);
    const [dieRollResult,setdieRollResult] = useState([0]);
    const [curStat, setCurStat]            = useState({0 : 'CHA', 1 : 0});

    const [loadedBackgrounds, setloadedBackgrounds] = useState()

    const [hitdie, setHitDie] = useState()
    const [hp, setHp] = useState(0);

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

    const handleHp = (operation) => {
        if(operation === "max"){
            setHitDie(optClass.hit_die);
            setHp(optClass.hit_die + Math.floor((charAbilities[1]-10)/2));
        }
        else if(operation === "roll"){
            setHitDie(diceRoll(1, optClass.hit_die))
            setHp(diceRoll(1, optClass.hit_die, Math.floor((charAbilities[1]-10)/2)))
        }
    }

    // Force Log in
    const navigate = useNavigate();
    const user = auth.currentUser;

    useEffect(()=>{
        if(!user){
            navigate("/login")
        }
    }, []) 

    /*-----------------------------------------------------------------------load Race/Class/Abilities Buttons------------------ */
    useEffect(() => {
        loadRaces();
        loadClasses();
        loadBackground();
        loadSpells();
        loadAbilities(); // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChangeName = (event) => {
        setOptName(event.target.value);
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
        if(isBuy){
            if (newScore < 8){
                newScore = 8;
            }
            else if (newScore > 15) {
                newScore =15;
            }
        }
        else{
            if (newScore < 0){
                newScore = 0;
            }
            else if (newScore > 20) {
                newScore = 20;
            }
        }
        let remainingAbilityPoints = abilityPoints + charAbilities[index] - newScore
        if(remainingAbilityPoints >= 0 || !isBuy) {
            charAbilities[index] = newScore;
            setCharAbilities(charAbilities);
            setAbilityPoints(remainingAbilityPoints);
        }
    }
    

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
                let choiceNum = item.proficiency_choices[arrayNum].choose;
                let skillsArray = item.proficiency_choices[arrayNum].from;
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
                    skills: skill,
                    hp: 0
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

    // Background
    const loadBackground = () => {
        if(!loadedBackgrounds) {
            setCharacterBackgrounds([]);
            Axios.get("https://www.dnd5eapi.co/api/backgrounds").then(
                (r) => {
                    let len = JSON.parse(JSON.stringify(r.data.count));
                    for(let i = 0; i < len; i++) {
                        let item = JSON.parse(JSON.stringify(r.data.results[i]));
                        fetchBackground(item.index);
                    }
                }
            )
            setloadedBackgrounds(true);
        }
    }
    const fetchBackground = (index) => {
        Axios.get("https://www.dnd5eapi.co/api/backgrounds/" + index).then(
            (r) => {
                let item = JSON.parse(JSON.stringify(r.data))
                setCharacterBackgrounds(prevItems => [...prevItems, {
                    name: item.name,
                    starting_proficiencies: item.starting_proficiencies,
                    language_options: item.language_options,
                    starting_equipment: item.starting_equipment,
                    starting_equipment_options: item.starting_equipment_options,
                    feature_name: item.feature.name,
                    feature_desc: item.feature.desc,
                }]);
            }
        )
    }
    // Spells
    const fetchSpell = (index) => {
        Axios.get("https://www.dnd5eapi.co/api/spells/" + index).then(
            (r) => {
                let item = JSON.parse(JSON.stringify(r.data))
                let classes = item.classes;
                let len = item.classes.length;
                if (item.level === 0) {
                    for(let i = 0; i < len; i ++) {
                        if(classes[i].name === optClass.name) {
                            setCharacterCantrips(prevItems => [...prevItems, {
                                name: item.name,
                                desc: item.desc,
                                level: item.level,
                                state: false,
                            }]);
                            break;
                        }
                    }
                }
                else if (item.level === 1) {
                    for(let i = 0; i < len; i ++) {
                        if(classes[i].name === optClass.name) {
                            setCharacterSpells(prevItems => [...prevItems, {
                                name: item.name,
                                desc: item.desc,
                                level: item.level,
                            }]);
                            break;
                        }
                    }
                }
            }
        )
    }
    const loadSpells = () => {
            Axios.get("https://www.dnd5eapi.co/api/spells").then(
                (r) => {
                    let len = JSON.parse(JSON.stringify(r.data.count));
                    setCharacterSpells([]);
                    setCharacterCantrips([]);
                    for(let i = 0; i < len; i ++) {
                        let item = JSON.parse(JSON.stringify(r.data.results[i]));
                        fetchSpell(item.index);
                    }
                }
            )
    }
    const setSpellsCount = () => {
        if(optClass.name === 'Cleric') {setCharacterSpellCount({cantrips:3,spells:1})}//
        else if(optClass.name === 'Bard') {setCharacterSpellCount({cantrips:2,spells:4})}
        else if(optClass.name === 'Druid') {setCharacterSpellCount({cantrips:2,spells:1})}//
        else if(optClass.name === 'Paladin') {setCharacterSpellCount({cantrips:0,spells:1})}//
        else if(optClass.name === 'Ranger') {setCharacterSpellCount({cantrips:0,spells:2})}
        else if(optClass.name === 'Sorcerer') {setCharacterSpellCount({cantrips:4,spells:2})}
        else if(optClass.name === 'Warlock') {setCharacterSpellCount({cantrips:2,spells:2})}
        else if(optClass.name === 'Wizard') {setCharacterSpellCount({cantrips:3,spells:6})}
        else {setCharacterSpellCount({cantrips:0,spells:0})}
    }
    const handlePickSpell = (item) => {
        setViewSpell(item);
        if(item.state) {
            item.state = false;
        } else {
            item.state = true;
        }
    }
    


    /* -------------------------------------------------------------------------- CLASS --------------------------------------------*/
    // grab class file and manually direct the tab to the selected class
    useEffect(() => {
        let temp = optClass.name;
        setViewSpell({name:'',desc:''});
        setSpellsCount();
        loadSpells();
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
            setArrayNum(0)
            setTabTrue();
            setBardTab(false);
            setTabKey("bard")
        }
        else if (e === "Barbarian"){
            setClassFile(file.Barbarian);
            setArrayNum(0)
            setTabTrue();
            setBarbTab(false);
            setTabKey("barbarian")
        }
        else if (e === "Druid"){
            setClassFile(file.Druid)
            setArrayNum(0)
            setTabTrue();
            setDruidTab(false);
            setTabKey("druid")
        }
        else if (e === "Cleric"){
            setClassFile(file.Cleric)
            setArrayNum(0)
            setTabTrue();
            setClericTab(false);
            setTabKey("cleric")
        }
        else if (e === "Fighter"){
            setClassFile(file.Fighter)
            setArrayNum(0)
            setTabTrue();  
            setFighterTab(false);
            setTabKey("fighter")
        }
        else if (e === "Monk"){
            setClassFile(file.Monk)
            setArrayNum(2)
            setTabTrue();
            setMonkTab(false);
            setTabKey("monk")
        }
        else if (e === "Paladin"){
            setClassFile(file.Paladin)
            setArrayNum(0)
            setTabTrue();
            setPaladinTab(false);
            setTabKey("paladin")
        }
        else if (e === "Ranger"){
            setClassFile(file.Ranger)
            setArrayNum(0)
            setTabTrue();
            setRangerTab(false);
            setTabKey("ranger")
        }
        else if (e === "Rogue"){
            setClassFile(file.Rogue)
            setArrayNum(0)
            setTabTrue();
            setRogueTab(false);
            setTabKey("rogue")
        }
        else if (e === "Warlock"){
            setClassFile(file.Warlock)
            setArrayNum(0)
            setTabTrue();
            setWarlockTab(false);
            setTabKey("warlock")
        }
        else if (e === "Sorcerer"){
            setClassFile(file.Sorcerer)
            setArrayNum(0)
            setTabTrue();
            setSorcererTab(false);
            setTabKey("sorcerer")
        }
        else if (e === "Wizard"){
            setClassFile(file.Wizard)
            setArrayNum(0)
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
                    let choiceArray = temp.proficiency_choices[arrayNum].from;
                    let tempArray = []  
                    for( let q = 0; q < choiceArray.length; q++){
                        var result = raceSkills.filter(skill => skill.name === choiceArray[q].index.substring(6))
                        try{
                            if(result[0].state === false){
                                tempArray.push({name:choiceArray[q].index.substring(6), state: result[0].state})
                            }
                        }
                        catch{}
                    }

                    setSkillChoiceNum(temp.proficiency_choices[arrayNum].choose)
                    setClassChoices(tempArray)
                }
            )
        }
        catch{}
    }

    const updateSkillChoice = (choice) => {
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

    /* --------------------------------------------------------------------- Languages -------------------------------------*/
    const updateLangChoice = (choice) => {
        setLangRaceChoices(
            langRaceChoices.map( (prevChoice) =>
                prevChoice.name === choice? {...prevChoice, state: !prevChoice.state} : {...prevChoice}
            )
        );

        setLangClassChoices(
            langClassChoices.map( (l) =>
                l.name === choice? {...l, state: !l.state}:{...l}
            )
        )
    }

    const addDraconic = () => {
        setKnownLanguages((prev)=>[...prev, "draconic"])
    }

    const langChoice = (e) => {
        try{
            let temp = e.languages;
            let tempArray = []
            for(let q = 0; q < temp.length; q++){
                let lang = temp[q].index
                tempArray.push(lang)

                setLangClassChoices(
                    langClassChoices.map( (l) =>
                        l.name === lang? {...l, state: !l.state}:{...l}
                    )
                )
            }

            setKnownLanguages(tempArray);

            try{
                setLangChoiceNum(1);
                let tempLangArray = e.language_options.from;
                for(let q = 0; q< tempLangArray.length; q++){
                    setLangRaceChoices((prev) => [...prev, {name: tempLangArray[q].index, state: false}])
                }
            }
            catch{
                setLangChoiceNum(0)
            }
        }
        catch{}
    }

    useEffect(() => {
        let tempArray = [];
        try{
            let profArray = classFile.Class_Features.Proficiencies;
            tempArray.push(profArray.content[0]);
            tempArray.push(profArray.content[1]);
            profChoices();
            equipChoices(); 
        }
        catch(err){
        }

        if(optClass.name === "Sorcerer"){
            addDraconic();
        }
        else{
            setKnownLanguages(knownLanguages.filter(prev => prev !== "draconic"));
        }

        setClassProf(tempArray); // eslint-disable-next-line react-hooks/exhaustive-deps
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
                    setLangRaceChoices([]);
                    langChoice(tempR);
                }
            );
        }
        catch{}
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [optRace]);

/* ------------------------------------------------------------------------- background Equipment -----------------------------------*/
    const [equipChoiceNum, setEquipChoiceNum] = useState();

    const equipChoices = () => {
        try{
            Axios.get("https://www.dnd5eapi.co/api/classes/" + optClass.name.toLowerCase()).then(
                (r) => {
                    let temp = JSON.parse(JSON.stringify(r.data));
                    let choiceArray = temp.starting_equipment_options[arrayNum].from;
                    let tempArray = []  

                    setEquipChoiceNum(temp.starting_equipment_options[arrayNum].choose)
                }
            )
        }
        catch{}
    }

    const updateEquipmentChoice = (choice) => {
        setOptEquipment([choice, backGroundEquipment[0], backGroundEquipment[1]])
    }

    function pushTofirebae()
    {

        const db=getFirestore();
        var user=auth.currentUser;
        const uid=user.uid;

        const path="User/"+uid+"/characters"
        const fileName="characterSheet.json";
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
        myData.abilityScores=charAbilities;

       var jsonRaceskills=[];
       var jsonClassSkills=[];
       var jsonLang=[];
       var jsonClassLang=[];

        for (var i=0; i<raceSkills.length;i++)
        {
            if (raceSkills[i].state===true)
            {
                console.log("race ",raceSkills[i].name);
                jsonRaceskills.push(raceSkills[i].name);
            }
        }


        for (var j=0; j<classSkills.length;j++)
        {
            if (classSkills[j].state===true)
            {
                console.log("class ",classSkills[j].name);
                jsonClassSkills.push(classSkills[j].name);
            }
        }

        console.log("langs Race ",langRaceChoices);
        console.log("langs Class ",langClassChoices);
        console.log("langs Known ",knownLanguages);


        for (var k=0; k<langRaceChoices.length;k++)
        {
            if(langRaceChoices[k].state===true)
            {
                console.log("langRace ", langRaceChoices[k].name)
                jsonLang.push(langRaceChoices[k].name)
            }
        }

        for (var a=0; a<langClassChoices.length;a++)
        {
            if(langClassChoices[a].state===true)
            {
                console.log("langClass ", langClassChoices[a].name)
                jsonClassLang.push(langClassChoices[a].name)
            }
        }

        console.log("back grounds ",optBackground);

        myData.knownLanguages=knownLanguages;

        myData.raceSkills=jsonRaceskills;
        myData.classSkills=jsonClassSkills;

        myData.langRace=jsonLang;
        myData.langClass=jsonClassLang;

        myData.health=hp;
        myData.background=optBackground;

        setDoc(doc(db,path, fileName), myData);


    }

    return(
        <>
            <h2 className='characterCreatorTitle'>Character Creator</h2>

            <Container fluid className='characterCreatorContainer'>
                {/* ----------------Name---------------- */}
                <Row className='characterCardRow'>
                    <Col xs={7} className='characterOptionsCol'>
                        <Card className='characterOptionsCard characterCreatorCard' border='light'>
                            <Card.Header>Name</Card.Header>
                            <Card.Body>
                                <Form.Control type='text' value={optName} onChange={(e)=>handleChangeName(e)}></Form.Control>
                            </Card.Body>
                        </Card>
                    </Col>

{verticalRule()}

<Col className='characterInfoCol'>
    <Card className='characterInfoCard characterCreatorCard' border='light'>
        {/* <Card.Img src={optRace.img} height='150px'/> */}
        <Card.Body>
                <h5><strong>Character Name: </strong></h5>
                <p>{optName}</p>
        </Card.Body>
    </Card>
</Col>
                </Row>


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
                                {optionsDropdown('background',characterBackgrounds,setOptBackground)}
                            </Card.Body>
                        </Card>
                    </Col>

                    {verticalRule()}
                    
                    <Col className='characterInfoCol'>
                        <Card className='characterInfoCard characterCreatorCard' border='light'>
                            {/* <Card.Img src={optBackground.img} height='150px'/> */}
                            <Card.Body>
                                Background:
                                <p>{optBackground.info}</p>
                                <Card.Text>
                                    <h5>{optBackground.name}</h5><hr/>
                                    {/*
                                    <p>{optBackground.starting_proficiencies}</p>
                                    <p>{optBackground.tool_proficiencies}</p>
                                    <p>{optBackground.language_options}</p>
                                    <p>{optBackground.starting_equipment}</p>
                                    */}
                                    <p>Feature: {optBackground.feature_name}</p>
                                    <p>{optBackground.feature_desc}</p>
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
                            <Tabs onSelect= {(activeKey)=> {
                                if(activeKey === 'point-buy'){
                                    setCharAbilities([8,8,8,8,8,8]);
                                    setAbilityPoints(27);
                                }
                                else 
                                    setCharAbilities([0,0,0,0,0,0]);
                                }
                            }>
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
                                            Points Left: {abilityPoints}
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
                                    Skills from {optClass.name} <br/>
                                    Pick {skillChoiceNum} : <br/>
                                    {classChoices.map((item, idx) => (
                                        <ToggleButton
                                            key={idx}
                                            id={item.name}
                                            value={item.name}
                                            type="checkbox"
                                            variant="outline-primary"
                                            checked={item.state}
                                            className="charButton"
                                            onChange={()=>{updateSkillChoice(item.name)}}
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

                {/*-----------------Language------------*/}
                <Row className='characterCardRow'>
                    <Col xs={7} className='characterOptionsCol'>
                        <Card className='characterOptionsCard characterCreatorCard' border='light'>
                            <Card.Header>Language</Card.Header>
                            <Card.Body>
                                <div>
                                    {optClass.name === "Sorcerer"?
                                            <div>
                                                Language recieved from {optRace.name} + Sorcerer: {knownLanguages.map((item, index)=>(
                                                    <div key={index}> {item} </div>
                                                ))}
                                            </div>
                                        :
                                            <div>
                                                Language recieved from {optRace.name}: {knownLanguages.map((item, index)=>(
                                                    <div key={index}> {item} </div>
                                                ))}
                                            </div>
                                    }
                                </div>
                                
                                {langChoiceNum > 0? 
                                    <div>
                                        <hr/>
                                        <div>
                                            Language from {optRace.name} <br/>
                                            Pick {langChoiceNum} : <br/>
                                            {langRaceChoices.map((item, idx) => (
                                                <ToggleButton
                                                key={idx}
                                                id={item.name}
                                                value={item.name}
                                                type="checkbox"
                                                variant="outline-primary"
                                                className='charButton'
                                                checked={item.state}
                                                    onChange={()=>{updateLangChoice(item.name)}}
                                                    >
                                                    {item.name}
                                                </ToggleButton>
                                            ))}
                                        
                                        </div>
                                    </div>
                                    :
                                    <></>
                                }
                                
                                {
                                    optClass.name === "Cleric"? 
                                        selectedDomain === 'knowledge'?
                                            <div>
                                                <hr/>
                                                Language from choesen Knowledge Cleric Domain <br/>
                                                Pick 2: <br/>
                                                {langClassChoices.map((item, idx) => (
                                                    <ToggleButton
                                                    key={idx}
                                                    id={item.name}
                                                    value={item.name}
                                                    type="checkbox"
                                                    variant="outline-primary"
                                                    checked={item.state}
                                                        onChange={()=>{updateLangChoice(item.name)}}
                                                        >
                                                        {item.name}
                                                    </ToggleButton>
                                                ))}
                                            </div>
                                        :
                                            []
                                    :
                                    []
                                }

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
                <Row className='characterCardRow'>
                    <Col xs={7} className='characterOptionsCol'>
                        <Card className='characterOptionsCard characterCreatorCard' border='light'>
                            <Card.Header>HP</Card.Header>
                            <Card.Body>
                                Hit Die: {optClass.hit_die} <br/>
                                Constitution Modifier: {Math.floor((charAbilities[1]-10)/2)} <br/>
                                HP Formula : Hit Die + Constitution Modifier = Starting HP <br/>

                                [{hitdie}] + [{Math.floor((charAbilities[1]-10)/2)}] = {hp}

                                <hr/>

                                <Button variant="primary" className='charButton' onClick={()=>{handleHp("max")}}>Max</Button>
                                <Button variant="primary" className='charButton' onClick={()=>{handleHp("roll")}}>Roll</Button>
                            </Card.Body>
                        </Card>
                    </Col>

                    {verticalRule()}

                    <Col className='characterInfoCol'>
                        <Card className='characterInfoCard characterCreatorCard' border='light'>
                            {/* <Card.Img src={optRace.img} height='150px'/> */}
                            <Card.Body>
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
                                <div>Cantrips: (choose {characterSpellCount.cantrips})<p/></div>
                                {optionsToggleButtonGroup(characterCantrips,handlePickSpell,'sm')}
                                <hr/>
                                <div>Spells: (choose {characterSpellCount.spells})<p/></div>
                                {optionsToggleButtonGroup(characterSpells,handlePickSpell,'sm')}
                            </Card.Body>
                        </Card>
                    </Col>

                    {verticalRule()}

                    <Col className='characterInfoCol'>
                        <Card className='characterInfoCard characterCreatorCard' border='light'>
                            {/* <Card.Img src={optRace.img} height='150px'/> */}
                            <Card.Body>
                                    <h5><strong>Spell: </strong>{viewSpell.name}</h5><hr/>
                                    <p><strong>Level: </strong>{viewSpell.level}</p><hr/>
                                    <div>{viewSpell.desc}</div>
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
                                <div>
                                    Equipment from {optClass.name} <br/>
                                    Pick {equipChoiceNum} : <br/>
                                    {/*{backGroundEquipmentOptions.map((item, idx) => (
                                        <ToggleButton
                                            key={idx}
                                            id={item.name}
                                            value={item.name}
                                            type="checkbox"
                                            variant="outline-primary"
                                            checked={item.state}
                                            className="charButton"
                                            onChange={()=>{updateEquipmentChoice(item.name)}}
                                        >
                                            {item.name}
                                        </ToggleButton>
                                    ))*/}
                                    
                                </div>
                                <hr/>
                                <div>
                                    Equipment from {optBackground.name} <br/>
                                    Pick 1 : <br/>
                                    {backGroundEquipmentOptions.map((item, idx) => (
                                        <ToggleButton
                                            key={idx}
                                            id={item.name}
                                            value={item.name}
                                            type="checkbox"
                                            variant="outline-primary"
                                            checked={item.state}
                                            className="charButton"
                                            onChange={()=>{updateEquipmentChoice(item)}}
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
                                <h5><strong>Equipment: </strong></h5><hr/>
                                {/*<div>
                                     <strong>recieved from {optClass.name}: </strong>{backGroundEquipment.map((item, index)=>{
                                        return(
                                            <div key={index}> {item.name}      quantity: {item.quantity} </div>
                                        );
                                    })}
                                </div>*/}
                                <div>
                                     <strong>recieved from {optBackground.name}: </strong>{backGroundEquipment.map((item, index)=>{
                                        return(
                                            <div key={index}> {item.name}      quantity: {item.quantity} </div>
                                        );
                                    })}
                                </div>
                                <hr></hr>
                                <div>
                                     <strong>chosen equipment: </strong>{optEquipment[0].name}<p></p>
                                        {optEquipment[0].desc}
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* ----------------Save Button---------------- */}
            <p>      </p><div>                            <Button onClick={pushTofirebae}>Save</Button> </div><p>      </p>


        </>
    );
}

export default CharacterCreator;