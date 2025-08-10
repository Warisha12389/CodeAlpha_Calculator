document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display');
    const buttons = document.querySelectorAll('.calc-button');
    let currentInput = '';
    let operator = '';
    let previousInput = '';
    let isResult = false;

    // Function to update the display
    function updateDisplay(value) {
        display.value = value;
    }

    // Function to handle button clicks
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.dataset.value;

            if (value >= '0' && value <= '9' || value === '.') {
                // If a new number is pressed after an equals, start a new calculation
                if (isResult) {
                    currentInput = value === '.' ? '0.' : value;
                    isResult = false;
                } else {
                    // Don't allow multiple decimal points
                    if (value === '.' && currentInput.includes('.')) return;
                    // Remove leading zero if it's the only character
                    if (currentInput === '0' && value !== '.') {
                        currentInput = value;
                    } else {
                        currentInput += value;
                    }
                }
                updateDisplay(currentInput);
            } else if (['+', '-', '*', '/'].includes(value)) {
                // Handle operator clicks
                if (currentInput === '') return;
                if (previousInput !== '' && operator !== '') {
                     // If there's a previous operation, calculate the intermediate result
                     try {
                         previousInput = eval(`${previousInput}${operator}${currentInput}`);
                         currentInput = '';
                     } catch(error) {
                         updateDisplay('Error');
                         currentInput = '';
                         previousInput = '';
                         operator = '';
                         isResult = true;
                         return;
                     }
                } else {
                    previousInput = currentInput;
                    currentInput = '';
                }
                operator = value;
                isResult = false;
                updateDisplay(previousInput); // Show the previous result or number
            } else if (value === '=') {
                // Handle equals
                if (previousInput === '' || currentInput === '' || operator === '') return;
                try {
                    // Using eval() is not recommended for production due to security risks.
                    // A more robust solution would involve parsing the expression.
                    const result = eval(`${previousInput}${operator}${currentInput}`);
                    updateDisplay(result);
                    currentInput = result.toString();
                    previousInput = '';
                    operator = '';
                    isResult = true;
                } catch (error) {
                    updateDisplay('Error');
                    currentInput = '';
                    previousInput = '';
                    operator = '';
                    isResult = true;
                }
            } else if (value === 'C') {
                // Clear all
                currentInput = '';
                operator = '';
                previousInput = '';
                isResult = false;
                updateDisplay('0');
            } else if (value === 'backspace') {
                // Backspace functionality
                if (currentInput.length > 0) {
                     currentInput = currentInput.slice(0, -1);
                     if (currentInput === '') {
                         updateDisplay('0');
                     } else {
                         updateDisplay(currentInput);
                     }
                }
            }
        });
    });
});
