//Mateo's work
export function diceRoll(dieNumber=1, dieSize=6, rollModifier=0) {
    let result = rollModifier;
    for(let i = 0; i < dieNumber; i ++) {
        result += Math.floor(Math.random() * dieSize) + 1;
    }
    return result;
}