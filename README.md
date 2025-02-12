# Leardle

An educational word-guessing game that combines learning with the fun of word puzzles. Players can input their own terms and definitions to create personalized learning experiences.

## How to Play

1. Input your terms and definitions in either JSON format:
```json
[
  {
    "term": "photosynthesis",
    "definition": "The process by which plants convert light energy into chemical energy"
  }
]
```

Or plaintext format:
```
photosynthesis
The process by which plants convert light energy into chemical energy
```

2. Click "Parse JSON" or "Parse Plaintext" to load your terms
3. Start the game and try to guess the word based on its definition
4. You have 5 attempts to guess correctly
5. Color-coded feedback will show:
   - Green: Correct letter in correct position
   - Orange: Correct letter in wrong position
   - Grey: Letter not in the word

## Features

- Light/Dark mode support
- Responsive design
- Custom terms and definitions
- Visual feedback system
- No installation required - works in any modern browser

## Contributing

Feel free to open issues or submit pull requests to improve the game.

## License

MIT License