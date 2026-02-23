# Question Selection Feature Implementation

## Server Changes (✅ DONE)
1. Modified `createGame()` to create empty rounds
2. Added `getAllQuestions()` function
3. Added `load_all_questions` message handler
4. Added `select_questions` message handler
5. Added `questionsSelected` flag to game state

## Host Page Changes (TODO)
1. Add state for available questions
2. Add state for selected questions per round
3. Add "Select Questions" button
4. Create question selection modal with:
   - List of all 42 questions
   - Ability to select 3 for Round 1
   - Ability to select 3 for Round 2
   - Ability to select 3 for Round 3
   - Confirm button to save selection
5. Disable "Start Game" until questions are selected
6. Send selected questions to server

## UI Flow
1. Host creates game
2. Host clicks "Select Questions" button
3. Modal opens showing all questions
4. Host selects 3 questions for Round 1
5. Host selects 3 questions for Round 2
6. Host selects 3 questions for Round 3
7. Host clicks "Confirm Selection"
8. Questions are sent to server and saved
9. "Start Game" button becomes enabled
10. Game proceeds normally

This is a significant UI change that requires careful implementation to maintain good UX.
