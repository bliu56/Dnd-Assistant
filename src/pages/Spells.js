import {useState, useEffect} from "react";
import Axios from 'axios';
import Select from 'react-select';
import { Button, Popover, OverlayTrigger } from "react-bootstrap";

import * as GiIcon from "react-icons/gi";
import './Spells.css';

function Spells(){
  
  const [selected, setSelect] = useState("acid-arrow"); //Holds the item to search
  
  const [returnSearch, setSearch] = useState([]); //Holds the searched item
  
  const [damageType, setDamageType] = useState(); //Holds the damage type of the selected spell

  const [doesDamage, setDoesDamage] = useState(true); //Bool that states whether the spell does damage or not

  const [classes, setClasses] = useState(""); //Holds what classes can use this spell

  const [hasConcentration, setConcentration] = useState("") //Holds whether spell is a concentration or not
  
  const [hasHigherLevel, setHigherLevel] = useState(true); //Holds whether they have a different effect when used at a higher level

  const [collection, setCollection] = useState([]); //Adds the spell to a list that they can go back to later

  const [bardSpells, setBardSpells] = useState([]); //array that holds all bard spells
  const [clericSpells, setClericSpells] = useState([]); //array that holds all cleric spells
  const [druidSpells, setDruidSpells] = useState([]); //array that holds all druid spells
  const [paladinSpells, setPaladinSpells] = useState([]); //array that holds all paladin spells
  const [rangerSpells, setRangerSpells] = useState([]); //array that holds all ranger spells
  const [sorcererSpells, setSorcererSpells] = useState([]); //array that holds all sorcerer spells
  const [warlockSpells, setWarlockSpells] = useState([]); //array that holds all warlock spells
  const [wizardSpells, setWizardSpells] = useState([]); //array that holds all wizard spells

  const [options, setOption] = useState([]); //holds all list of spells
  const [detailedOptions, setDetailedOptions] = useState([]); //always a detailed list of all spells

  const [filteredOptions, setFilteredOptions] = useState([]); //holds all the spells with the filter applied

  const [spellClasses, setSpellClasses] = useState([ //Holds an array containing all classes that can have spells and if they were selected
    {class:'bard', display: 'Bard', state: false}, 
    {class:'cleric', display: 'Cleric', state: false}, 
    {class: 'druid', display: 'Druid',state: false},
    {class: 'paladin', display: 'Paladin',state: false},
    {class: 'ranger', display: 'Ranger',state: false},
    {class: 'sorcerer', display: 'Sorcerer',state: false},
    {class: 'warlock', display: 'Warlock',state: false},
    {class: 'wizard', display: 'Wizard',state: false}
  ]);

  const [filteredClass, setFilteredClass] = useState([]); //Holds the classes that were selected

  const [spellLevel, setSpellLevel] = useState([ //Holds an array containing all the spell levels and if they were selected
    {level: 0, display: "Cantrip", state: false},
    {level: 1, display: "1st", state: false},
    {level: 2, display: "2nd", state: false},
    {level: 3, display: "3rd", state: false},
    {level: 4, display: "4th", state: false},
    {level: 5, display: "5th", state: false},
    {level: 6, display: "6th", state: false},
    {level: 7, display: "7th", state: false},
    {level: 8, display: "8th", state: false},
    {level: 9, display: "9th", state: false},
  ]);

  const [filteredLevel, setFilteredLevel] = useState([]); //Holds the levels that were selected

  const [filteredConcentration, setFilteredConcentration] = useState(0); //Whether concentration is selected for filter; -1 = false | 0 = nothing | 1 = true
  const [filteredRitual, setFilteredRitual] = useState(0); //Whether ritual is selected for filter; -1 = false | 0 = nothing | 1 = true

  const [trigger, setTrigger] = useState(0); //for useEffect so useEffect knows when to trigger for filtering

  const popoverCollection = (
    <Popover id="popover-collection">
    <Popover.Header as="h3">Help</Popover.Header>
    <Popover.Body>
      Click "Add to Collection" to save a spell to come back to later. <br/>
      Double click the spell's name to bring up the spell's information. <br/>
      Click the X by the spell's name to remove from the collection. <br/>
      Click "Clear All" to remove all spells from the collection.
    </Popover.Body>
    </Popover>
  );

  const popoverSearch = (
    <Popover id="popover-search">
    <Popover.Header as="h3">Help</Popover.Header>
    <Popover.Body>
      Type or scroll to search for a spell then press the "Search" button on the right to search the spell information. <br/>
      Click on the checkboxes to limit the list of spells then press "Apply Filter" button to limit the avalible spells <br/>
      Click "Clear Filter" to remove all the limiters. This will not uncheck the boxes.
    </Popover.Body>
    </Popover>
  );

  //---------------Collection------------------------------------------------------------------------

  //Adds to the Collection
  const handleCollection = () => {
    setCollection((prevSpell) => [...prevSpell, {name: selected},]);
  }

  //Removes item from Collection
  const removeItemFromCollection = e => {
    setCollection(collection.filter(spell => spell.name !== e));
  }

  //Clears the collection
  const clearCollection = () => {
    setCollection([]);
  }

  //Clicking spells on collection to pull it up
  const returnCollection = e => {
    setSelect(e);
    search();
  }

  //---------------Searchbar------------------------------------------------------------------------

  //Saves the value of selected dropdown item
  const handleVal = e => {
    setSelect(e.value);
  }

  //puts entire list of spells into the drop down list once when the page is loaded
  useEffect( () => {
    pushSpells(true); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  //helper function that pushes the spells into the options array. 
  //if e is true then a more detailed spell array is created and individual class spell arrays are created.
  const pushSpells = e => {
    setOption([]);
    var temp;
    Axios.get("https://www.dnd5eapi.co/api/spells/").then(
        (r) => {
          for(var q=0; q<r.data.results.length; q++)
          {
            temp = JSON.parse(JSON.stringify(r.data.results[q]));
            setOption((prevOption) => [...prevOption, {value: temp.index, label: temp.name}]);
            if(e === true){
                pushHelper(temp.index, temp.name);
            }
          }
        }
      );
  }

  //loops through every spell and creates various arrays. 
  const pushHelper = (index, name) => {
    Axios.get("https://www.dnd5eapi.co/api/spells/" + index).then(
      (response) => {
        var temp = JSON.parse(JSON.stringify(response.data));
        
        //creates arrays that holds spells that belong to a particular class
        for(var q=0; q<temp.classes.length; q++)
        { 
          var classname = temp.classes[q].name;
          if(classname === "Bard"){
            setBardSpells((p) => [...p, {value: index, label: name, level: temp.level, ritual: temp.ritual, concentration: temp.concentration}]);
          }
          if(classname === "Cleric"){
            setClericSpells((p) => [...p, {value: index, label: name, level: temp.level, ritual: temp.ritual, concentration: temp.concentration}]);
          }
          if(classname === "Druid"){
            setDruidSpells((p) => [...p, {value: index, label: name, level: temp.level, ritual: temp.ritual, concentration: temp.concentration}]);
          }
          if(classname === "Paladin"){
            setPaladinSpells((p) => [...p, {value: index, label: name, level: temp.level, ritual: temp.ritual, concentration: temp.concentration}]);
          }
          if(classname === "Ranger"){
            setRangerSpells((p) => [...p, {value: index, label: name, level: temp.level, ritual: temp.ritual, concentration: temp.concentration}]);
          }
          if(classname === "Sorcerer"){
            setSorcererSpells((p) => [...p, {value: index, label: name, level: temp.level, ritual: temp.ritual, concentration: temp.concentration}]);
          }
          if(classname === "Warlock"){
            setWarlockSpells((p) => [...p, {value: index, label: name, level: temp.level, ritual: temp.ritual, concentration: temp.concentration}]);
          }
          if(classname === "Wizard"){
            setWizardSpells((p) => [...p, {value: index, label: name, level: temp.level, ritual: temp.ritual, concentration: temp.concentration}]);
          }
        }

        //create a detailed array
        setDetailedOptions((p) => [...p, {value: index, label: name, level: temp.level, ritual: temp.ritual, concentration: temp.concentration}]);
    })
  }

  //Handles the actual searching
  const search = () => {
    Axios.get("https://www.dnd5eapi.co/api/spells/" + selected).then(
      (response) => {
        var tempA = JSON.parse(JSON.stringify(response.data));
        //Higher Level
        if(tempA.higher_level.length === 0){
          setHigherLevel(false);
        }

        setConcentration(tempA.concentration.toString());

        //Damage
        try{ 
          var tempADamage = JSON.parse(JSON.stringify(response.data.damage)); 
          setDamageType(tempADamage.damage_type.name);
        }//Parse damage into readable list
        catch(err){
          setDoesDamage(false);
        }
        
        //Ritual
        tempA.ritual = tempA.ritual.toString(); //Change ritual from a bool into a string to display

        //Classes
        var classList = "";
        var classname = "";
        for(var q=0; q<tempA.classes.length; q++)
        { 
          classname = tempA.classes[q].name;
          if(q === 0)
          {
            classList = classname;
          }
          else
          {
            classList = classname + ", " + classList;
          }
        }
        setClasses(classList);
        setSearch(tempA);
      }
    );
  };

  //-----------------Filter--------------------------------------------------------------------
  
  //Adds the selected class into an array that holds what class spells to keep. 
  //It changes the class inside the array to true or false
  const changeClassState = e => {
    var curState = false;

    spellClasses.map((curClass) => curClass.class === e ? curState = curClass.state : curState);

    curState = !curState;

    setSpellClasses(
      spellClasses.map( (prevClass) => 
        prevClass.class === e ? {...prevClass, state: curState} : {...prevClass}
      )
    );
  }

  //Adds the selected spell level into an array that holds what class spells to keep
  //It changes the level inside the array to true or false
  const changeLevelState = e => {
    var curLevel = false;
    
    spellLevel.map((curSpellLevel) => curSpellLevel.level === e ? curLevel = curSpellLevel.state : curLevel);

    curLevel = !curLevel;

    setSpellLevel(
      spellLevel.map( (prevLevel) => 
        prevLevel.level === e ? {...prevLevel, state: curLevel} : {...prevLevel}
      )
    );
  }

  //Handles concentration filter. -1 = false | 0 = neutral | 1 = true
  const handleConcentration = e => {
    setFilteredConcentration(e);
  }

  //Handles ritual filter. -1 = false | 0 = neutral | 1 = true
  const handleRitual = e => {
    setFilteredRitual(e);
  }

  //If the class was selected, then it gets put into an array of selected classes
  useEffect(() => {
    setFilteredClass([]);

    spellClasses.map( (curClass) =>
      curClass.state === true ? setFilteredClass((prevfClass) => [...prevfClass, curClass.class]) : []
    );
  }, [spellClasses]);

  //If the level was NOT selected, then it gets put into an array of seleceted levels
  useEffect(() => {
    setFilteredLevel([]);
    
    spellLevel.map( (curLevel) =>
      curLevel.state === false ? setFilteredLevel((prevfLevel) => [...prevfLevel, curLevel.level] ) : []
    );
  }, [spellLevel]);

  //Takes in an array and adds all the elements into a new one that will then be pushed into a useState while skipping over the dupplicates
  const removeDupSpells = (arrayDup) => {
    var arrayUnique = [];
    var uniqueSpell = arrayDup[0].value;
    arrayUnique.push(arrayDup[0]);
    
    for(var q = 1; q < arrayDup.length; q++){
      var curSpell = arrayDup[q].value;
      if(curSpell !== uniqueSpell)
      {
        arrayUnique.push(arrayDup[q]);
        uniqueSpell = curSpell;
      }
    }
    return(arrayUnique);
  }
  
  //Filter search - Combines the arrays of the selected classes then if anything else was selected, remove the unseleceted
  const FilterSearch = () => {
    
    var combinedOption = [];
    //goes through an array which holds all the classes that are selected, then combines all the class arrays that were selected
    if(filteredClass.length === 0) {
      combinedOption = detailedOptions;
    }
    for(var q=0; q<filteredClass.length; q++){
      if(filteredClass[q] === "bard"){
        combinedOption = combinedOption.concat(bardSpells);
      }
      if(filteredClass[q] === "cleric"){
        combinedOption = combinedOption.concat(clericSpells);
      }
      if(filteredClass[q] === "druid"){
        combinedOption = combinedOption.concat(druidSpells);
      }
      if(filteredClass[q] === "paladin"){
        combinedOption = combinedOption.concat(paladinSpells);
      }
      if(filteredClass[q] === "ranger"){
        combinedOption = combinedOption.concat(rangerSpells);
      }
      if(filteredClass[q] === "sorcerer"){
        combinedOption = combinedOption.concat(sorcererSpells);
      }
      if(filteredClass[q] === "warlock"){
        combinedOption = combinedOption.concat(warlockSpells);
      }
      if(filteredClass[q] === "wizard"){
        combinedOption = combinedOption.concat(wizardSpells);
      }
    }
    
    //sorts the list alphabetically 
    combinedOption.sort(function(a,b){
      if(a.label < b.label){return -1;}
      if(a.label > b.label){return 1;}
      return 0;
    });
    
    //remove all the duplicated spells
    combinedOption = removeDupSpells(combinedOption);

    //loop through all the spells and apply the level, concentration, and ritual filters
    for(var w=0; w<combinedOption.length; w++){
      //loops through all the non-seleceted levels and if the spells is one of those unselected spell, remove it
      if(filteredLevel.length !== 10){
        for(var e=0; e<filteredLevel.length; e++){
          if(combinedOption[w].level === filteredLevel[e]){
            combinedOption.splice(w, 1);
            w=0; //DOESNT CHECK THE FIRST ONE AFTER REMOVING ONE
          }
        }
      }

      //check for concentration
      //if concentration is true then we loop through and remove all the spells where concentration is false. Then we will check the opposite.
      if((combinedOption[w].concentration === true && filteredConcentration === -1) || (combinedOption[w].concentration === false && filteredConcentration === 1)){
        combinedOption.splice(w, 1);
        w=0;
      }

      //check for ritual
      //if ritual is true then we loop through and remove all the spells where ritual is false. Then we check the opposite.
      if((combinedOption[w].ritual === true && filteredRitual === -1) || (combinedOption[w].ritual === false && filteredRitual === 1)){
        combinedOption.splice(w, 1);
        w=0;
      }
    }

    //Because the loop doesn't reach the first element in the array if the first element is spliced, we have to check the first element once more
    //check for level
    if(filteredLevel.length !== 10){
      for(var r=0; r<filteredLevel.length; r++){
        if(combinedOption[0].level === filteredLevel[r]){
          combinedOption.splice(0, 1);
        }
      }
    }

    //check for concentration at the first slot because the first element can get skipped over
    if((filteredConcentration === -1 && combinedOption[0].concentration === true) || (filteredConcentration === 1 && combinedOption[0].concentration === false)){
      combinedOption.splice(0,1);
    }

    //check for ritual at the first slot because the first element can get skipped over
    if((filteredRitual === -1 && combinedOption[0].ritual === true) || (filteredRitual === 1 && combinedOption[0].ritual === false)){
      combinedOption.splice(0,1);
    }

    setFilteredOptions(combinedOption);

    //trigers the push to options
    setTrigger(Math.random());
  }

  //When trigger is used at the end of the filtered search, it causes the useEffect to activate which pushes the filtered spells into the options list
  useEffect(() => {
    setOption(filteredOptions); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);
//-------------------------------------------Return----------------------------------------------------------------------------------

  return( 
    <div className="spell-wrapper">
      {/* Push all the spells into the searchbar list */}
      {/* {PushList()} */}
      {/* {UpdateOptions()} */}

      {/*------------------- Information Display -----------------------------------*/}
      <div className="display">
        <div className="display-list">
          <div className="display-name">Name: </div> {returnSearch.name}
        </div>
        <div className="display-list">
          <div className="display-name">Description: </div> {returnSearch.desc}
        </div>
        <div className="display-list">
          <div className="display-name">Level: </div> {returnSearch.level === 0? <>Cantrip</>:<>{returnSearch.level}</>}
        </div>
        <div className="display-list">
          <div className="display-name">Range: </div> {returnSearch.range}
        </div>
        <div className="display-list">
          <div className="display-name">Casting Time: </div> {returnSearch.casting_time}
        </div>
        <div className="display-list">
          <div className="display-name">Duration: </div> {returnSearch.duration}
        </div>
        <div className="display-list">
          <div className="display-name">Concentration: </div> {hasConcentration}
        </div>
        <div className="display-list">
          { doesDamage === true? <> <div className="display-name">Damage Type: </div> {damageType} </>: <>Damage Type: None</> }
        </div>
        <div className="display-list">
          { hasHigherLevel === true?  <> <div className="display-name">Higher Level: </div> {returnSearch.higher_level} </> : <>Higher Level: Nothing</>}
        </div>
        <div className="display-list">
          <div className="display-name">Ritual: </div> {returnSearch.ritual}
        </div>
        <div className="display-list">
          <div className="display-name">Components: </div> {returnSearch.components}
        </div>
        <div className="display-list">
          <div className="display-name">Classes: </div> {classes}
        </div>
      </div>

      {/*---------------------------- Collection ---------------------------------*/}
      <div className="collection-col">
        <div className="collection">
          <div className="collection-header">
            Collection
          </div>
          <ul>
            {collection.map( (spell, index) => (
              <div key={index} className='collection-list'>
                <div name = {spell.name} onClick={() => {returnCollection(spell.name);}}>  
                  {spell.name}  
                </div>
                <div name = {spell.name} onClick={() => {removeItemFromCollection(spell.name);}}>
                  <GiIcon.GiCancel/> 
                </div>
              </div>
            ))}
          </ul>
        </div>
              
        <div className="collection-buttons">
          <Button variant="primary" onClick={() => {handleCollection();}}>Add to Collection</Button>
          <OverlayTrigger trigger="click" placement="bottom" overlay={popoverCollection}>
            <Button variant="info">Help</Button>
          </OverlayTrigger>
          <Button variant="danger" onClick={() => {clearCollection(); search();}}>Clear All</Button>
        </div>
        
      </div>

      {/*---------------------------- Search Dropdown Bar ----------------------------------------------------------*/}
      <div className="search-col">
        <div className='search'>
          <div className="search-header">
            <Select options={options} className="search-bar" 
              onChange={handleVal}
              placeholder="Type or press the dropdown arrow"
            />
            <button onClick={() => {search();}} className="searchButton">Search</button>
          </div>

          <div className='search-list'> {/*-------------------------------------------------------------------Class Select----------------------------------------------*/}
              Class:
                {spellClasses.map((spell, index) => (
                  <div key={index} className="search-class">
                    <input type='checkbox' className='checkbox' onChange={() => {changeClassState(spell.class); }}/> {spell.display}
                    {/* {HandleFilteredClass()} */}
                  </div>
                ))}
          </div>

          <div className="search-list"> {/*-------------------------------------------------------------------Level Select----------------------------------------------*/}
            Level:
              {spellLevel.map((spell, index) => (
                <div key={index} className="search-class">
                  <input type='checkbox' onChange={() => {changeLevelState(spell.level)}}/> {spell.display}
                  {/* {HandleFilteredLevel()} */}
                </div>
              ))}
          </div>

          <div className='search-list'> {/*-------------------------------------------------------------------Concentration---------------------------------------------*/}
            Concentration:
              <div>
                <form className='search-class'>
                  <div className='search-class'>
                    <label>
                      <input type='radio'  value="yes" id="yes" name="concentration" onChange={() => {handleConcentration(1)}}/> Yes
                    </label> 
                  </div>

                  <div className='search-class'>
                    <label>
                      <input type='radio'  value="both" id="both" name="concentration" onChange={() => {handleConcentration(0)}}/> Both
                    </label> 
                  </div>

                  <div className='search-class'>
                    <label>
                      <input type='radio'  value="no" id="no" name="concentration" onChange={() => {handleConcentration(-1)}}/> No
                    </label> 
                  </div>
                </form>
              </div>
          </div>

          <div className='search-list'> {/*----------------------------------------------------------------------Ritual-------------------------------------------------*/}
            Ritual:
            <div>
                <form className='search-class'>
                  <div className='search-class'>
                    <label>
                      <input type='radio'  value="yes" id="yes" name="ritual" onChange={() => {handleRitual(1)}}/> Yes
                    </label> 
                  </div>

                  <div className='search-class'>
                    <label>
                      <input type='radio'  value="both" id="both" name="ritual" onChange={() => {handleRitual(0)}}/> Both
                    </label> 
                  </div>

                  <div className='search-class'>
                    <label>
                      <input type='radio'  value="no" id="no" name="ritual" onChange={() => {handleRitual(-1)}}/> No
                    </label> 
                  </div>
                </form>
              </div>
          </div>
        </div>

        <div className="filter-buttons">
          <Button variant="success" onClick={() => {FilterSearch();}}>Apply Filter</Button>
          <OverlayTrigger trigger="click" placement="bottom" overlay={popoverSearch}>
            <Button variant="info">Help</Button>
          </OverlayTrigger>
          <Button variant="danger" onClick={() => {pushSpells(false);}}>Clear Filter</Button>
        </div>
      </div>

    </div>
  );
}

export default Spells;