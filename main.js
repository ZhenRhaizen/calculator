// DOM Elements
const previousOperandElement = document.getElementById('previousOperand');
const currentOperandElement = document.getElementById('currentOperand');
const numberButtons = document.querySelectorAll('button:not(.operation):not(.equals):not(.accent)');
const operationButtons = document.querySelectorAll('.operation');
const equalsButton = document.querySelector('.equals');
const allClearButton = document.getElementById('allClear');
const deleteButton = document.getElementById('delete');
const themeToggle = document.getElementById('themeToggle');

// Calculator state
let currentOperand = '0';
let previousOperand = '';
let operation = undefined;
let resetScreen = false;

// Constants
const DEFAULT_FONT_SIZE = '2.5rem';
const SMALL_FONT_SIZE = '2rem';
const MAX_LENGTH = 9;

// Update display
function updateDisplay() {
    currentOperandElement.innerText = currentOperand;
    currentOperandElement.style.fontSize = currentOperand.length > MAX_LENGTH ? SMALL_FONT_SIZE : DEFAULT_FONT_SIZE;

    previousOperandElement.innerText = operation && !resetScreen
        ? `${previousOperand} ${getOperationSymbol(operation)}`
        : '';
}

// Get operation symbol for display
function getOperationSymbol(op) {
    const symbols = { '+': '+', '-': '−', '×': '×', '÷': '÷', '%': '%' };
    return symbols[op] || op;
}

// Append number or decimal
function appendNumber(number) {
    if (resetScreen || currentOperand === '0') {
        currentOperand = number;
        resetScreen = false;
    } else {
        currentOperand += number;
    }
}

// Add decimal point
function addDecimal() {
    if (resetScreen) {
        currentOperand = '0.';
        resetScreen = false;
    } else if (!currentOperand.includes('.')) {
        currentOperand += '.';
    }
}

// Choose math operation
function chooseOperation(op) {
    if (currentOperand === '') return;
    if (previousOperand !== '') compute();
    operation = op;
    previousOperand = currentOperand;
    resetScreen = true;
}

// Compute result
function compute() {
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);
    if (isNaN(prev) || isNaN(current)) return;

    let computation;
    switch (operation) {
        case '+': computation = prev + current; break;
        case '−':
        case '-': computation = prev - current; break;
        case '×': computation = prev * current; break;
        case '÷': computation = prev / current; break;
        case '%': computation = prev % current; break;
        default: return;
    }

    currentOperand = computation.toString();
    operation = undefined;
    previousOperand = '';
    resetScreen = true;

    // Format long result
    if (currentOperand.length > 10) {
        currentOperand = parseFloat(currentOperand).toExponential(4);
    }
}

// Delete last character
function deleteNumber() {
    if (resetScreen || currentOperand === '0') return;

    if (currentOperand.length === 1 || (currentOperand.length === 2 && currentOperand.startsWith('-'))) {
        currentOperand = '0';
    } else {
        currentOperand = currentOperand.slice(0, -1);
    }
}

// Clear everything
function clearAll() {
    currentOperand = '0';
    previousOperand = '';
    operation = undefined;
    resetScreen = false;
}

// Handle number and decimal clicks
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (button.innerText === '.') {
            addDecimal();
        } else {
            appendNumber(button.innerText);
        }
        updateDisplay();
    });
});

// Handle operation buttons
operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        chooseOperation(button.innerText);
        updateDisplay();
    });
});

// Handle equals
equalsButton.addEventListener('click', () => {
    compute();
    updateDisplay();
});

// Handle clear
allClearButton.addEventListener('click', () => {
    clearAll();
    updateDisplay();
});

// Handle delete
deleteButton.addEventListener('click', () => {
    deleteNumber();
    updateDisplay();
});

// Keyboard support
document.addEventListener('keydown', (e) => {
    const key = e.key;

    if (!isNaN(key)) {
        appendNumber(key);
    } else if (key === '.') {
        addDecimal();
    } else if (key === '=' || key === 'Enter') {
        compute();
    } else if (key === 'Backspace') {
        deleteNumber();
    } else if (key === 'Escape') {
        clearAll();
    } else if (['+', '-', '*', '/', '%'].includes(key)) {
        const opMap = { '*': '×', '/': '÷' };
        chooseOperation(opMap[key] || key);
    } else {
        return;
    }
    updateDisplay();
});

// Theme toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const theme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
    localStorage.setItem('theme', theme);
});

// Load saved theme
if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-mode');
}

// Initialize UI
updateDisplay();