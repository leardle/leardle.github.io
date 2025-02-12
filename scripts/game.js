class LeardleGame {
    constructor() {
        this.terms = [];
        this.currentTerm = null;
        this.attempts = 5;
        this.currentAttempt = 0;
        this.gameActive = false;
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
        this.selectRandomTerm();
        return true;
    }

    selectRandomTerm() {
        const randomIndex = Math.floor(Math.random() * this.terms.length);
        this.currentTerm = this.terms[randomIndex];
    }

    checkGuess(guess) {
        if (!this.gameActive || this.currentAttempt >= this.attempts) return null;
        
        guess = guess.toLowerCase();
        const correct = this.currentTerm.term;
        
        if (guess === correct) {
            this.gameActive = false;
            return {
                correct: true,
                feedback: Array.from(guess).map(letter => ({
                    letter,
                    status: 'correct'
                }))
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
            feedback
        };
    }

    getGameState() {
        return {
            attemptsLeft: this.attempts - this.currentAttempt,
            gameActive: this.gameActive,
            currentDefinition: this.currentTerm?.definition || '',
            correctTerm: !this.gameActive ? this.currentTerm?.term : null
        };
    }
}

// Initialize game
const game = new LeardleGame();

// DOM Elements
const elements = {
    termsInput: document.getElementById('termsInput'),
    parseJSON: document.getElementById('parseJSON'),
    parsePlaintext: document.getElementById('parsePlaintext'),
    startGame: document.getElementById('startGame'),
    inputSection: document.getElementById('inputSection'),
    gameSection: document.getElementById('gameSection'),
    currentDefinition: document.getElementById('currentDefinition'),
    guessInput: document.getElementById('guessInput'),
    submitGuess: document.getElementById('submitGuess'),
    guessHistory: document.getElementById('guessHistory'),
    attemptsLeft: document.getElementById('attemptsLeft'),
    feedbackMessage: document.getElementById('feedbackMessage'),
    themeToggle: document.getElementById('themeToggle')
};

// Event Listeners
elements.parseJSON.addEventListener('click', () => {
    const success = game.parseJSON(elements.termsInput.value);
    elements.feedbackMessage.textContent = success ? 'JSON parsed successfully!' : 'Invalid JSON format';
});

elements.parsePlaintext.addEventListener('click', () => {
    const success = game.parsePlaintext(elements.termsInput.value);
    elements.feedbackMessage.textContent = success ? 'Text parsed successfully!' : 'Invalid text format';
});

elements.startGame.addEventListener('click', () => {
    if (game.startGame()) {
        elements.inputSection.classList.add('hidden');
        elements.gameSection.classList.remove('hidden');
        updateGameUI();
    } else {
        elements.feedbackMessage.textContent = 'Please add some terms first!';
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

    if (result.correct) {
        elements.feedbackMessage.textContent = 'Congratulations! You found the word!';
    } else if (!game.getGameState().gameActive) {
        elements.feedbackMessage.textContent = `Game Over! The word was: ${game.getGameState().correctTerm}`;
    }
}

function updateGameUI() {
    const state = game.getGameState();
    elements.currentDefinition.textContent = state.currentDefinition;
    elements.attemptsLeft.textContent = `Attempts left: ${state.attemptsLeft}`;
    elements.guessInput.disabled = !state.gameActive;
    elements.submitGuess.disabled = !state.gameActive;
}

// Initialize theme
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
}