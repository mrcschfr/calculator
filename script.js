'use strict'

// ----------------
// Global variables
// ----------------

let history = []; // Will serve as a history of either results or full numbers (not single digits)
let lastAction = null; // Will contain the last action, e.g. 'num' or 'ops' or 'equ'
let currentOperation = null; // Will contain the last operation, e.g. '+' or '*'
let userInput = 0; // Will holds the user's direct input
let hasUserTyped = false; // Will be used to track whether the user is currently typing in digits

// ----------------
// Helper functions
// ----------------

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
    if (num2 === 0) {
        return 'Game over'
    } else {
        return Number(num1) / Number(num2);
    }
}

function calculateResult(firstOperand, secondOperand) {
    let result = 0;

    if (currentOperation != "") {
        switch(currentOperation) {
            case '+':
                result = add(firstOperand, secondOperand);
                break;
            case '-':
                result = subtract(firstOperand, secondOperand);
                break;
            case '*':
                result = multiply(firstOperand, secondOperand);
                break;
            case '/':
                result = divide(firstOperand, secondOperand);
                break;
            default:
                console.warn('Calculate result has been called without currentOperation being set')
                break;
        }
    }

    return result;
}

// Update the display with the latest displayValue
function updateScreen(number) {
    document.getElementById('display').innerText = number;
}

function fitNumber(number) {
    if (number.toString().length > 9) {
        let split = number.toString().split('.');
        if (split[0].length > 9) {
            return 'Too large';
        } else {
            let diff = 9 - split[0].length;
            return Number(number.toFixed(diff));
        }
    } else {
        return Number(number);
    }
}

// -----------------------
// Event handler functions
// -----------------------

// Is called when the user puts in a digit
function handleNumberInput(e) {
    // The user is typing
    hasUserTyped = true;

    // We don't want the numbers to become too large for the screen
    if (userInput.toString().length === 9) {
        return;
    }

    // If it's already a floating point number ...
    if (userInput.toString().includes('.') && e.target.attributes['data-value'].value === '.') {
        return;
    }

    // We don't want a leading zero except for floating point numbers
    if (userInput === 0 && e.target.attributes['data-value'].value != '.') {
        userInput = e.target.attributes['data-value'].value; 
    } else {
        userInput += e.target.attributes['data-value'].value;
    }

    // The last action was a number input
    lastAction = "num";

    updateScreen(Number(userInput));
}

// Will erase the current entry and selected operators
function handleCE(e) {
    // Resets all global variables, i.e. 'the state'
    history = [];
    lastAction = null;
    currentOperation = null;
    userInput = 0; // this variable always holds the user's direct input
    hasUserTyped = false;

    updateScreen(Number(userInput));
}

function handleDivisionByZero(msg) {
    updateScreen(msg);
    
    history = [];
    lastAction = null;
    currentOperation = null;
    userInput = 0; // this variable always holds the user's direct input
    hasUserTyped = false;   
}

// Will delete the last number that the user has put in
function handleBack(e) {
    // If the user is not typing, do not delete anything
    if (!hasUserTyped) {
        return;
    }

    // Slice off the last input
    if (userInput.toString().length === 1) {
        // We do not delete everything - if the last input is deleted, display 0
        userInput = 0;
    } else {
        // Otherwise slice the last input off
        userInput = userInput.toString().slice(0, userInput.toString().length - 1);
    }
    
    updateScreen(Number(userInput));
}

// Will be called when the calculator is switched on/ off
function handleToggle(e) {
    document.getElementById('toggle').classList.toggle('on');
    document.getElementById('display').classList.toggle('on');

    handleCE();
}

// Will be called when the user puts in an operator
function handleOperator(e) {
    let result = 0;
    
    // Check whether the previous input was also an operator
    if (lastAction != null) {
        // Nothing happens if it's just operator after operator
        if (lastAction === 'ops') {           
            return;
        }
    } else {
        return;
    }

    lastAction = 'ops';

    // If the user has put in digits, push the whole number to the history
    if (hasUserTyped) {
        history.push(Number(userInput));
    }

    // If an operations has been selected, calculate the proper result
    if (currentOperation != null) {
        // It's always the last and second-to-last element of the history array
        result = calculateResult(history[history.length - 2], history[history.length - 1]);
        result = fitNumber(result);

        if (isNaN(result)) {
            handleDivisionByZero(result);
            return;
        }

        history.push(result);
    }

    // Get the operator that was selected 
    currentOperation = e.target.attributes['data-value'].value;

    updateScreen(Number(history[history.length - 1]));

    // Reset the display value without updating the screen, so this happens as soon as a new number key is pressed
    userInput = 0;
    hasUserTyped = false;
}

// Will be called when the user presses on the equal button
function handleEqual(e) {
    let result = 0;    
    
    // Check whether the previous input was also an equal button or an operator
    if (lastAction != null) {
        // Nothing happens if it's just equal button after operator or equal button after equal button
        if (lastAction === 'ops' || lastAction === 'equ') {           
            return;
        }
    } else {
        return;
    }


    lastAction = 'equ';

    // If the user has put in digits, push the whole number to the history
    if (hasUserTyped) {
        history.push(Number(userInput));
    }

    // If an operations has been selected, calculate the proper result
    if (currentOperation != null) {
        // It's always the last and second-to-last element of the history array
        let result = calculateResult(history[history.length - 2], history[history.length - 1]);
        result = fitNumber(result);

        if (isNaN(result)) {
            handleDivisionByZero(result);
            return;
        }

        history.push(result);
    }
    
    currentOperation = null;
    
    updateScreen(Number(history[history.length - 1]));

    // Reset the display value without updating the screen, so this happens as soon as a new number key is pressed
    userInput = 0;
    hasUserTyped = false;
}

// Provide (German) keyboard support by calling the respective click function on keydown
function handleKeydown(e) {
    console.log(`e.code: ${e.code}`);
    console.log(`e.key: ${e.key}`);


    switch (e.key) {
        case '0':
            document.querySelector('[data-value="0"]').click();
            break;
        case '1':
            document.querySelector('[data-value="1"]').click();
            break;
        case '2':
            document.querySelector('[data-value="2"]').click();
            break;
        case '3':
            document.querySelector('[data-value="3"]').click();
            break;
        case '4':
            document.querySelector('[data-value="4"]').click();
            break;
        case '5':
            document.querySelector('[data-value="5"]').click();
            break;
        case '6':
            document.querySelector('[data-value="6"]').click();
            break;
        case '7':
            document.querySelector('[data-value="7"]').click();
            break;
        case '8':
            document.querySelector('[data-value="8"]').click();
            break;
        case '9':
            document.querySelector('[data-value="9"]').click();
            break;
        case '+':
            document.querySelector('[data-value="+"]').click();
            break;
        case '*':
            document.querySelector('[data-value="*"]').click();
            break;
        case '-':
            document.querySelector('[data-value="-"]').click();
            break;
        case '/':
            document.querySelector('[data-value="/"]').click();
            break;
        case '.':
            document.querySelector('[data-value="."]').click();
            break;
        case 'Enter':
            document.querySelector('[data-value="="]').click();
            break;
        case 'Escape':
            document.getElementById('ce').click();
            break;
        case 'Backspace':
            document.getElementById('b').click();
            break;
    }
}

// ------------------
// Add event handlers
// ------------------

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
    document.getElementById('b').addEventListener('click', handleBack);

    // Add event listeners for the operator keys
    let allOperators = document.getElementsByClassName('mid-calculator-keypad-operator');

    for (let i = 0; i < allOperators.length; i++) {
        allOperators[i].addEventListener('click', handleOperator);
    }

    // Add event listeners for the equals key
    document.getElementById('equals').addEventListener('click', handleEqual)

    // Add event listeners for keyboard
    document.addEventListener('keydown', handleKeydown);
}


// TODO

// DONE --------------------------------------- 1. Make operators behave like a plus sign, when the first operator is logged in (i.e. allow the user to string operations together)
// DONE  -------------------------------------- 2. Make the keyboard work
// DONE  -------------------------------------- 3. Swap the keys (% and =)
// 4. Set up the desktop view
// DONE  -------------------------------------- 5. Add "Power" on top of toggle
// DONE  -------------------------------------- 6. Make display not disappear when the last sign is deleted
// 7. Shorten the possible floating point numbers
// DONE  -------------------------------------- 8. "Forget" everything once shut off
// DONE  -------------------------------------- 9. Slicing off ("backspace") does not work when result is a number
// DONE  -------------------------------------- 10. Display a snarky error message if the user tries to divide by 0… don’t let it crash your calculator!


