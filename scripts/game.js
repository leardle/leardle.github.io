// Debug logging for script loading
console.log('Game.js loaded successfully');

class LeardleGame {
    constructor() {
        this.terms = [];
        this.currentTerm = null;
        this.attempts = 5;
        this.currentAttempt = 0;
        this.gameActive = false;
        this.currentTermIndex = -1;
    }

    parseInput(input) {
        // Try JSON first
        try {
            const success = this.parseJSON(input);
            if (success) {
                return { success: true, message: 'JSON parsed successfully!' };
            }
        } catch (e) {
            // JSON parsing failed, continue to plaintext
            console.log('JSON parsing failed, trying plaintext');
        }
        
        // Try plaintext
        const success = this.parsePlaintext(input);
        if (success) {
            return { success: true, message: 'Text parsed successfully!' };
        }
        
        return { success: false, message: 'Failed to parse input. Please check the format.' };
    }

    parseJSON(input) {
        try {
            const data = JSON.parse(input);
            if (Array.isArray(data)) {
                this.terms = data.map(item => ({
                    term: item.term.toLowerCase(),
                    definition: item.definition
                }));
                return true;
            }
            return false;
        } catch (e) {
            console.error('Error parsing JSON:', e);
            return false;
        }
    }

    parsePlaintext(input) {
        try {
            const lines = input.split('\n').filter(line => line.trim());
            this.terms = [];
            
            for (let i = 0; i < lines.length; i += 2) {
                if (lines[i] && lines[i + 1]) {
                    this.terms.push({
                        term: lines[i].trim().toLowerCase(),
                        definition: lines[i + 1].trim()
                    });
                }
            }
            return this.terms.length > 0;
        } catch (e) {
            console.error('Error parsing plaintext:', e);
            return false;
        }
    }

    startGame() {
        if (this.terms.length === 0) return false;
        this.currentAttempt = 0;
        this.gameActive = true;
        this.currentTermIndex = -1;
        this.nextTerm();
        return true;
    }

    nextTerm() {
        this.currentTermIndex++;
        if (this.currentTermIndex >= this.terms.length) {
            this.gameActive = false;
            return false;
        }
        this.currentTerm = this.terms[this.currentTermIndex];
        this.currentAttempt = 0;
        return true;
    }

    checkGuess(guess) {
        if (!this.gameActive || this.currentAttempt >= this.attempts) return null;
        
        guess = guess.toLowerCase();
        const correct = this.currentTerm.term;
        
        if (guess === correct) {
            const moreTerms = this.nextTerm();
            return {
                correct: true,
                feedback: Array.from(guess).map(letter => ({
                    letter,
                    status: 'correct'
                })),
                gameComplete: !moreTerms
            };
        }

        this.currentAttempt++;
        if (this.currentAttempt >= this.attempts) {
            this.gameActive = false;
        }

        const feedback = Array.from(guess).map((letter, index) => {
            if (index < correct.length && letter === correct[index]) {
                return { letter, status: 'correct' };
            } else if (correct.includes(letter)) {
                return { letter, status: 'wrong-position' };
            } else {
                return { letter, status: 'incorrect' };
            }
        });

        return {
            correct: false,
            feedback,
            gameComplete: false
        };
    }

    getGameState() {
        return {
            attemptsLeft: this.attempts - this.currentAttempt,
            gameActive: this.gameActive,
            currentDefinition: this.currentTerm?.definition || '',
            correctTerm: !this.gameActive ? this.currentTerm?.term : null,
            progress: this.currentTermIndex + 1,
            totalTerms: this.terms.length
        };
    }
}

// Initialize game
console.log('Initializing game...');
const game = new LeardleGame();

// DOM Elements
console.log('Setting up DOM elements...');
const elements = {
    termsInput: document.getElementById('termsInput'),
    startGame: document.getElementById('startGame'),
    inputSection: document.getElementById('inputSection'),
    gameSection: document.getElementById('gameSection'),
    currentDefinition: document.getElementById('currentDefinition'),
    guessInput: document.getElementById('guessInput'),
    submitGuess: document.getElementById('submitGuess'),
    guessHistory: document.getElementById('guessHistory'),
    attemptsLeft: document.getElementById('attemptsLeft'),
    feedbackMessage: document.getElementById('feedbackMessage'),
    themeToggle: document.getElementById('themeToggle'),
    progress: document.getElementById('progress')
};

// Event Listeners
console.log('Adding event listeners...');
elements.startGame.addEventListener('click', () => {
    console.log('Start game clicked'); // Debug log
    const input = elements.termsInput.value;
    if (!input.trim()) {
        elements.feedbackMessage.textContent = 'Please enter some terms and definitions first!';
        return;
    }

    const parseResult = game.parseInput(input);
    elements.feedbackMessage.textContent = parseResult.message;
    console.log('Parse result:', parseResult); // Debug log
    
    if (parseResult.success && game.startGame()) {
        elements.inputSection.classList.add('hidden');
        elements.gameSection.classList.remove('hidden');
        elements.guessHistory.innerHTML = '';
        updateGameUI();
    }
});

elements.submitGuess.addEventListener('click', () => {
    const guess = elements.guessInput.value.trim();
    if (!guess) return;
    
    const result = game.checkGuess(guess);
    if (result) {
        displayGuessResult(result);
        updateGameUI();
        elements.guessInput.value = '';
        
        if (result.correct) {
            if (result.gameComplete) {
                elements.feedbackMessage.textContent = 'Congratulations! You\'ve completed all the words!';
            } else {
                elements.guessHistory.innerHTML = ''; // Clear history for next word
                elements.feedbackMessage.textContent = 'Correct! Next word...';
            }
        }
    }
});

elements.guessInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        elements.submitGuess.click();
    }
});

elements.themeToggle.addEventListener('click', () => {
    document.documentElement.setAttribute('data-theme', 
        document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
    );
});

function displayGuessResult(result) {
    const guessDisplay = document.createElement('div');
    guessDisplay.className = 'guess-display';

    result.feedback.forEach(({ letter, status }) => {
        const letterElement = document.createElement('span');
        letterElement.className = `letter ${status}`;
        letterElement.textContent = letter;
        guessDisplay.appendChild(letterElement);
    });

    elements.guessHistory.appendChild(guessDisplay);
    
    if (!result.correct && !game.getGameState().gameActive) {
        elements.feedbackMessage.textContent = `Game Over! The word was: ${game.getGameState().correctTerm}`;
    }
}

function updateGameUI() {
    const state = game.getGameState();
    elements.currentDefinition.textContent = state.currentDefinition;
    elements.attemptsLeft.textContent = `Attempts left: ${state.attemptsLeft}`;
    elements.progress.textContent = `Word ${state.progress} of ${state.totalTerms}`;
    elements.guessInput.disabled = !state.gameActive;
    elements.submitGuess.disabled = !state.gameActive;
}

// Initialize theme
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
}