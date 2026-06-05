const display = document.getElementById('display');
let currentInput = '';
let shouldResetDisplay = false;

function appendNumber(number) {
    // Don't allow multiple decimals
    if (number === '.' && currentInput.includes('.')) return;
    
    if (display.innerText === '0' || shouldResetDisplay) {
        display.innerText = number;
        shouldResetDisplay = false;
    } else {
        display.innerText += number;
    }
    currentInput = display.innerText;
}

function appendOperator(operator) {
    const lastChar = display.innerText.slice(-1);
    
    // Prevent starting with operators or doubling them up
    if (display.innerText === '0' && operator !== '-') return;
    if (['+', '-', '*', '/'].includes(lastChar)) {
        display.innerText = display.innerText.slice(0, -1) + operator;
        return;
    }
    
    display.innerText += operator;
    shouldResetDisplay = false;
}

function clearDisplay() {
    display.innerText = '0';
    currentInput = '';
}

function calculate() {
    try {
        // Basic Error Handling (e.g., Division by zero checks or incomplete inputs)
        if (display.innerText.includes('/0')) {
            display.innerText = "Error: Div by 0";
            shouldResetDisplay = true;
            return;
        }

        // Safely parse math equations using Function constructor (cleaner alternatives to eval)
        let result = new Function('return ' + display.innerText)();
        
        // Format decimals to avoid crazy JS float numbers (e.g. 0.1 + 0.2)
        if (result % 1 !== 0) {
            result = parseFloat(result.toFixed(4));
        }

        display.innerText = result;
        currentInput = result;
        shouldResetDisplay = true;
    } catch (error) {
        display.innerText = "Syntax Error";
        shouldResetDisplay = true;
    }
}

/* Keyboard Support Option */
window.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9' || e.key === '.') {
        appendNumber(e.key);
    } else if (['+', '-', '*', '/'].includes(e.key)) {
        appendOperator(e.key);
    } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        calculate();
    } else if (e.key === 'Backspace' || e.key === 'Escape') {
        clearDisplay();
    }
});