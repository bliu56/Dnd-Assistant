import { diceRoll } from "./diceRoll";

export function dropMinRoll(numDice=4, dieSize=6) {
    const rolls = [];
    const out = [];
    var min = 0;
    var result;
    //for (let index = 0; index < 6; index++) {    
    result = 0;  
    for(let i = 0; i < numDice; i ++) {
        rolls[i] = diceRoll(1, dieSize, 0);
    }
    min = rolls[0]
    for(let i = 1; i < numDice; i ++) {
        if (rolls[i] < min) {
            min = rolls[i]
        }
    }
    console.log(min);
    for (let i = 0; i < rolls.length; i++) {
        result += rolls[i];
    }
    console.log(result);
    console.log(rolls);
    result -= min;
    return result;
        //console.log(result);
        //[index] = result;
    //}
    //return out;
} 