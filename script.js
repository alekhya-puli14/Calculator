class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.updateDisplay();
    }

    delete() {
        if (this.currentOperand === 'Error') return;
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '') {
            this.currentOperand = '0';
        }
        this.updateDisplay();
    }

    appendNumber(number) {
        if (this.currentOperand === 'Error') return;
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
        this.updateDisplay();
    }

    chooseOperation(operation) {
        if (this.currentOperand === 'Error') return;
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
        this.updateDisplay();
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev)) return;
        
        try {
            switch (this.operation) {
                case '+':
                    computation = prev + current;
                    break;
                case '−':
                    computation = prev - current;
                    break;
                case '×':
                    computation = prev * current;
                    break;
                case '÷':
                    if (current === 0) {
                        throw new Error("Division by zero");
                    }
                    computation = prev / current;
                    break;
                default:
                    return;
            }
            
            this.currentOperand = computation.toString();
            this.operation = undefined;
            this.previousOperand = '';
            this.updateDisplay();
        } catch (error) {
            this.currentOperand = 'Error';
            this.operation = undefined;
            this.previousOperand = '';
            this.updateDisplay();
        }
    }

    getDisplayNumber(number) {
        if (number === 'Error') return number;
        
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);
        
        if (this.operation != null) {
            this.previousOperandTextElement.innerText = 
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandTextElement.innerText = '';
        }
    }
}

// DOM Elements
const numberButtons = document.querySelectorAll('.number');
const operationButtons = document.querySelectorAll('.operator');
const equalsButton = document.getElementById('equals');
const deleteButton = document.getElementById('delete');
const clearButton = document.getElementById('clear');
const previousOperandTextElement = document.getElementById('previous-operand');
const currentOperandTextElement = document.getElementById('current-operand');

// Create calculator
const calculator = new Calculator(
    previousOperandTextElement,
    currentOperandTextElement
);

// Event Listeners
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.innerText);
    });
});

operationButtons.forEach(button => {
    if (button.id !== 'equals' && button.id !== 'clear' && button.id !== 'delete') {
        button.addEventListener('click', () => {
            calculator.chooseOperation(button.innerText);
        });
    }
});

equalsButton.addEventListener('click', () => {
    calculator.compute();
});

clearButton.addEventListener('click', () => {
    calculator.clear();
});

deleteButton.addEventListener('click', () => {
    calculator.delete();
});

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (e.key >= 0 && e.key <= 9) calculator.appendNumber(e.key);
    if (e.key === '.') calculator.appendNumber('.');
    if (e.key === '+') calculator.chooseOperation('+');
    if (e.key === '-') calculator.chooseOperation('−');
    if (e.key === '*') calculator.chooseOperation('×');
    if (e.key === '/') {
        e.preventDefault();
        calculator.chooseOperation('÷');
    }
    if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        calculator.compute();
    }
    if (e.key === 'Escape') calculator.clear();
    if (e.key === 'Backspace') calculator.delete();
});

