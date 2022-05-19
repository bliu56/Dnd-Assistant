import './CharacterCreator.css';

import './CharacterCreator.css';
import { ToggleButtonGroup,  ToggleButton, ButtonGroup, Button} from 'react-bootstrap';
function CharacterCreator(){
    return(

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