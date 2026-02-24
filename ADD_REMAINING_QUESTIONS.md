# Add Remaining Questions (43-84)

## Current Status
- ✅ Questions 1-42 are already in `server/realQuestions.js`
- ⏳ Need to add questions 43-84 (42 more questions)

## How to Add Questions

### Option 1: Copy from PDF and I'll Format
Just copy-paste the questions from the PDF here in chat, and I'll format them properly into the JavaScript file.

### Option 2: Use This Template
Copy this template for each question and fill in the details:

```javascript
{
  id: 'q43',
  text: 'YOUR QUESTION HERE',
  answers: [
    { text: 'Answer 1', points: 45, revealed: false },
    { text: 'Answer 2', points: 40, revealed: false },
    { text: 'Answer 3', points: 35, revealed: false },
    { text: 'Answer 4', points: 30, revealed: false },
    { text: 'Answer 5', points: 25, revealed: false },
    { text: 'Answer 6', points: 20, revealed: false }
  ]
},
```

### Option 3: Tell Me the Questions
Just tell me:
- Question text
- 6 answers for each question
- I'll format and add them

## Question Format Rules

1. Each question needs:
   - Unique ID (q43, q44, q45, etc.)
   - Question text
   - 6 answers with points (45, 40, 35, 30, 25, 20)

2. Points are always in descending order:
   - Most popular answer: 45 points
   - Least popular answer: 20 points

3. All answers start with `revealed: false`

## Example from PDF

If your PDF has:
```
Question: Name something students do during boring lectures
1. Sleep
2. Use phone
3. Doodle
4. Daydream
5. Talk to friends
6. Leave class
```

I'll format it as:
```javascript
{
  id: 'q43',
  text: 'Name something students do during boring lectures',
  answers: [
    { text: 'Sleep', points: 45, revealed: false },
    { text: 'Use phone', points: 40, revealed: false },
    { text: 'Doodle', points: 35, revealed: false },
    { text: 'Daydream', points: 30, revealed: false },
    { text: 'Talk to friends', points: 25, revealed: false },
    { text: 'Leave class', points: 20, revealed: false }
  ]
},
```

## Ready to Add?

Just share the questions from the PDF (questions 43-84) and I'll add them all to the realQuestions.js file!
