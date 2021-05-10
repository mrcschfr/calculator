// Global variables

let displayValue = ""; // this is the number that is being displayed
let firstOperator = 0;
let secondOperator = 0;
let currentOperation = "";

// Helper functions

function add(num1, num2) {
    return Number(num1) + Number(num2);
}

function subtract(num1, num2) {
    return Number(num1) - Number(num2);
}

function multiply(num1, num2) {
    return Number(num1) * Number(num2);
}

function divide(num1, num2) {
    return Number(num1) / Number(num2);
}

function operate(operator, num1, num2) {
    switch(operator) {
        case 'add':
            return add(num1, num2);
            break;
        case 'subtract':
            return subtract(num1, num2);
            break;
        case 'multiply':
            return multiply(num1, num2);
            break;
        case 'divide':
            return divide(num1, num2);
            break;
        default:
            break;
    }
}

function handleNumberInput(e) {
    console.debug(`A number key was clicked`);

    // We don't want the numbers to become too large for the screen
    if (displayValue.length === 9) {
        return;
    }

    // We don't want a leading zero except for floating point numbers
    if (displayValue === 0 && e.target.attributes['data-value'].value != '.') {
        displayValue = e.target.attributes['data-value'].value; 
    } else {
        displayValue += e.target.attributes['data-value'].value;
    }

    // The value that is displayed on the screen is stored in displayValue as a string
    console.log(displayValue);

    updateScreen();
}

// Will erase the current entry
function handleCE(e) {
    console.debug(`'CE' was clicked`);

    displayValue = "0";
    updateScreen();
}

// Will delete the last number
function handleC(e) {
    console.debug(`'C' was clicked`);

    displayValue = displayValue.slice(0, displayValue.length - 1);
    updateScreen();
}

function handleToggle(e) {
    document.getElementById('toggle').classList.toggle('on');
    document.getElementById('display').classList.toggle('on');

    displayValue = 0;
    updateScreen();
}

function handleOperator(e) {
    currentOperation = e.target.attributes['data-value'].value;
    console.debug(`An operator was clicked: ${currentOperation}`);

    firstOperator = Number(displayValue);
    console.debug(`First operator saved: ${firstOperator}`);

    displayValue = "";
}

function handleEqual(e) {
    console.debug(`Equal sign was clicked`);
    console.debug(`First operator saved: ${firstOperator}`);

    secondOperator = Number(displayValue);
    console.debug(`Second operator saved: ${secondOperator}`);

    let result = 0;

    switch(currentOperation) {
        case '+':
            result = add(firstOperator, secondOperator);
            break;
        case '-':
            result = subtract(firstOperator, secondOperator);
            break;
        case '*':
            result = multiply(firstOperator, secondOperator);
            break;
        case '%':
            result = divide(firstOperator, secondOperator);
            break;
        default:
            break;
    }

    displayValue = result;
    updateScreen();
}

function updateScreen() {
    document.getElementById('display').innerText = displayValue;
}

// Event handler

document.addEventListener('DOMContentLoaded', init);

function init() {
    console.log('DOMContentLoaded')

    // Power on the calculator
    document.getElementById('onoff').addEventListener('click', handleToggle);

    // Add event listeners for all numbers
    let allNumbers = document.getElementsByClassName('mid-calculator-keypad-key');

    for (let i = 0; i < allNumbers.length; i++) {
        allNumbers[i].addEventListener('click', handleNumberInput);
    }

    // Add event listeners for the control keys
    document.getElementById('ce').addEventListener('click', handleCE);
    document.getElementById('c').addEventListener('click', handleC);

    // Add event listeners for the operator keys
    let allOperators = document.getElementsByClassName('mid-calculator-keypad-operator');

    for (let i = 0; i < allOperators.length; i++) {
        allOperators[i].addEventListener('click', handleOperator);
    }

    // Add event listeners for the equals key
    document.getElementById('equals').addEventListener('click', handleEqual)
}




