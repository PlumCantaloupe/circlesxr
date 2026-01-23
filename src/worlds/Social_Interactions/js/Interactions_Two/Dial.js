//class for dial's info
class counterInfo {
    constructor(counterID, counterTextID, requiredNumber, currentNumber, isAtCorrectNumber) {
        this.counterID = counterID;
        this.counterTextID = counterTextID;
        this.requiredNumber = requiredNumber;
        this.currentNumber = currentNumber;
        this.isAtCorrectNumber = isAtCorrectNumber;
    }
}

//dial object info. Ensure that objectId matches entity id so that references work
const counter_01 = new counterInfo("counterOne", "counterOneNumber", 2, 0, false);
const counter_02 = new counterInfo("counterTwo", "counterTwoNumber", 5, 0, false);
const counter_03 = new counterInfo("counterThree", "counterThreeNumber", 9, 0, false);


//array of objects
let counterObjects = [counter_01, counter_02, counter_03];

function increaseNumber(objectcounterID) { // increase the number of the interacted dial
    let counterInfoIndex = null;
    for (let i = 0; counterObjects.length > i; i++) {
        if (counterObjects[i].counterID == objectcounterID) {
            counterInfoIndex = i;
            break;
        }
    }
    // console.log(counterInfoIndex);
    if (counterInfoIndex != null) {
        counterObjects[counterInfoIndex].currentNumber += 1;
        updateVariable(counterInfoIndex); // this updates the currentNumber and checks to see if it is at the correct number
    }
}

function decreaseNumber(objectcounterID) { // decrease the number of the interacted dial
    let counterInfoIndex = null;
    for (let i = 0; counterObjects.length > i; i++) {
        if (counterObjects[i].counterID == objectcounterID) {
            counterInfoIndex = i;
            break;
        }
    }
    // console.log(counterInfoIndex);
    if (counterInfoIndex != null) {
        counterObjects[counterInfoIndex].currentNumber -= 1;
        updateVariable(counterInfoIndex); // this updates the currentNumber and checks to see if it is at the correct number
    }
}

function updateVariable(index) { // updateVariable ensures the correct number is display to the players and makes sure the numbers that can be displayed are between [0, 9]
    if (counterObjects[index].currentNumber >= 10) {
        counterObjects[index].currentNumber = 0;
    }
    if (counterObjects[index].currentNumber <= -1) {
        counterObjects[index].currentNumber = 9;
    }
    if (counterObjects[index].currentNumber == counterObjects[index].requiredNumber) {
        counterObjects[index].isAtCorrectNumber = true;
    } else {
        counterObjects[index].isAtCorrectNumber = false;
    }
    // console.log(counterObjects[index]);
    let text = document.getElementById(counterObjects[index].counterTextID);
    text.setAttribute('text', 'value', String(counterObjects[index].currentNumber));
}

function checkIfCorrectCode() { // checks all dial objects
    for (let i = 0; counterObjects.length > i; i++) {
        if (counterObjects[i].isAtCorrectNumber == false) {
            return false;
        }
    }
    return true;
}

function getCurrentNumber(){ // for syncing
    let currentNumberArray = new Array();
    for (let i = 0; counterObjects.length > i; i++) {
        currentNumberArray.push(counterObjects[i].currentNumber);
    }
    return currentNumberArray;
}

function setCurrentNumber(numberArray){ // for syncing
    for (let i = 0; counterObjects.length > i; i++) {
        counterObjects[i].currentNumber = numberArray[i];
        updateVariable(i);
    }
}

function puzzleComboAlreadySolved() { // Force set all counterObjects[i].isAtCorrectNumber to be true since puzzle is solved
    for (let i = 0; counterObjects.length > i; i++) {
        counterObjects[i].isAtCorrectNumber = true;

    }
}

