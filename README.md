# Leardle - Educational Word Guessing Game

Leardle is a Wordle-inspired educational game that helps students learn terms and definitions in an engaging way. Input your study material and practice guessing terms based on their definitions.

## How to Use

1. Visit [leardle.github.io](https://leardle.github.io)
2. Input your terms and definitions in one of the following formats:

### JSON Format
```json
[
  {
    "term": "photosynthesis",
    "definition": "Process by which plants convert light energy into chemical energy"
  },
  {
    "term": "mitosis",
    "definition": "Cell division resulting in two identical cells"
  }
]
```

### Plain Text Format
```
photosynthesis
Process by which plants convert light energy into chemical energy
mitosis
Cell division resulting in two identical cells
```

3. Click "Start Game" to begin
4. Read the definition and try to guess the term
5. You have 5 attempts per word
6. Color feedback will help guide your guesses:
   - Green: Letter is correct and in the right position
   - Orange: Letter is in the word but wrong position
   - Red: Letter is not in the word

## Features

- Dark/Light mode toggle
- Progress tracking
- Multiple attempts per word
- Visual feedback for guesses
- Support for both JSON and plain text input
- Mobile-responsive design

## Contributing

Feel free to open issues or submit pull requests to improve the game.

## License

© 2025 Tarushv Kosgi