function Random(dieSize, modifier, numDiece) {

    var randomNumber = 0;
    
    for (let i = 0; i < numDiece; i++) {
        randomNumber += Math.floor((Math.random() * dieSize) + 1);
    }

    return <div>{(randomNumber + modifier)}</div>;
}