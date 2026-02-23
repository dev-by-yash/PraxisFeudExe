// Real Feud.Exe Questions - College Edition
const realQuestions = [
  // College Life Questions
  {
    id: 'q1',
    text: 'Reason students skip lectures',
    answers: [
      { text: 'Overslept', points: 45, revealed: false },
      { text: 'Boring subject', points: 35, revealed: false },
      { text: 'Assignment not done', points: 30, revealed: false },
      { text: 'Friend made a bunk plan', points: 25, revealed: false },
      { text: 'Weather', points: 20, revealed: false },
      { text: 'Attendance already safe', points: 15, revealed: false }
    ]
  },
  {
    id: 'q2',
    text: 'Most used excuse for late submission',
    answers: [
      { text: 'Internet issue', points: 45, revealed: false },
      { text: 'File corrupted', points: 40, revealed: false },
      { text: 'Health issue', points: 30, revealed: false },
      { text: 'Out of town', points: 25, revealed: false },
      { text: 'Forgot', points: 20, revealed: false },
      { text: 'System problem', points: 15, revealed: false }
    ]
  },
  {
    id: 'q3',
    text: 'Most common words in college',
    answers: [
      { text: '"Bunk?"', points: 45, revealed: false },
      { text: '"Attendance?"', points: 40, revealed: false },
      { text: '"Notes bhej"', points: 35, revealed: false },
      { text: '"Chal canteen"', points: 30, revealed: false },
      { text: '"Paper kaisa tha?"', points: 25, revealed: false },
      { text: '"Deadline kab hai?"', points: 20, revealed: false }
    ]
  },
  {
    id: 'q4',
    text: 'Something students realize in final year',
    answers: [
      { text: 'Time flew', points: 45, revealed: false },
      { text: "Should've studied", points: 40, revealed: false },
      { text: 'Friends matter', points: 35, revealed: false },
      { text: 'Skills important', points: 30, revealed: false },
      { text: 'Memories', points: 25, revealed: false },
      { text: 'College was easy', points: 20, revealed: false }
    ]
  },
  {
    id: 'q5',
    text: 'First thing students check after exam',
    answers: [
      { text: 'Answers online', points: 45, revealed: false },
      { text: "Friends' reactions", points: 40, revealed: false },
      { text: 'Passing marks', points: 35, revealed: false },
      { text: 'Mistakes', points: 30, revealed: false },
      { text: 'Result date', points: 25, revealed: false },
      { text: 'Attendance', points: 20, revealed: false }
    ]
  },
  {
    id: 'q6',
    text: 'Something students do when teacher asks questions',
    answers: [
      { text: 'Avoid eye contact', points: 45, revealed: false },
      { text: 'Look down', points: 40, revealed: false },
      { text: 'Check phone', points: 35, revealed: false },
      { text: 'Pretend to write', points: 30, revealed: false },
      { text: 'Whisper answers', points: 25, revealed: false },
      { text: 'Leave class', points: 20, revealed: false }
    ]
  },
  {
    id: 'q7',
    text: 'Name something students do instead of studying',
    answers: [
      { text: 'Using Instagram/Reels', points: 45, revealed: false },
      { text: 'Sleeping', points: 40, revealed: false },
      { text: 'Watching Netflix/YouTube', points: 35, revealed: false },
      { text: 'Gaming', points: 30, revealed: false },
      { text: 'Overthinking life', points: 25, revealed: false },
      { text: 'Eating/snacking', points: 20, revealed: false }
    ]
  },
  {
    id: 'q8',
    text: 'Name something every college student always complains about',
    answers: [
      { text: 'Exams', points: 45, revealed: false },
      { text: 'Attendance', points: 40, revealed: false },
      { text: 'Assignments', points: 35, revealed: false },
      { text: 'Professors', points: 30, revealed: false },
      { text: 'Lack of sleep', points: 25, revealed: false },
      { text: 'Food/canteen', points: 20, revealed: false }
    ]
  },
  {
    id: 'q9',
    text: "Name something you'll always find in a college student's bag",
    answers: [
      { text: 'Phone', points: 45, revealed: false },
      { text: 'Charger/earphones', points: 40, revealed: false },
      { text: 'Notebook', points: 35, revealed: false },
      { text: 'Pen (borrowed)', points: 30, revealed: false },
      { text: 'Snacks', points: 25, revealed: false },
      { text: 'ID card', points: 20, revealed: false }
    ]
  },
  {
    id: 'q10',
    text: 'Name something that gets blamed when marks are low',
    answers: [
      { text: 'Question paper', points: 45, revealed: false },
      { text: 'Professor', points: 40, revealed: false },
      { text: 'University', points: 35, revealed: false },
      { text: 'Bad luck', points: 30, revealed: false },
      { text: 'Friends', points: 25, revealed: false },
      { text: 'System/online exam', points: 20, revealed: false }
    ]
  },
  {
    id: 'q11',
    text: 'Name something students do right after saying "just 5 minutes"',
    answers: [
      { text: 'Sleep for 2 hours', points: 45, revealed: false },
      { text: 'Scroll Instagram', points: 40, revealed: false },
      { text: 'Start a movie', points: 35, revealed: false },
      { text: 'Overthink life', points: 30, revealed: false },
      { text: 'Forget work', points: 25, revealed: false },
      { text: 'Miss the lecture', points: 20, revealed: false }
    ]
  },
  {
    id: 'q12',
    text: 'Name something students judge others for (but secretly do too)',
    answers: [
      { text: 'Marks', points: 45, revealed: false },
      { text: 'Relationships', points: 40, revealed: false },
      { text: 'Dressing', points: 35, revealed: false },
      { text: 'Attendance', points: 30, revealed: false },
      { text: 'Social media posts', points: 25, revealed: false },
      { text: 'Bunking', points: 20, revealed: false }
    ]
  },
  {
    id: 'q13',
    text: 'Name something students stop caring about after first year',
    answers: [
      { text: 'Attendance', points: 45, revealed: false },
      { text: 'Dress code', points: 40, revealed: false },
      { text: 'Professors', points: 35, revealed: false },
      { text: 'Marks', points: 30, revealed: false },
      { text: 'Rules', points: 25, revealed: false },
      { text: 'Opinions', points: 20, revealed: false }
    ]
  },
  {
    id: 'q14',
    text: 'Name something students complain about but would miss',
    answers: [
      { text: 'College', points: 45, revealed: false },
      { text: 'Hostel life', points: 40, revealed: false },
      { text: 'Friends', points: 35, revealed: false },
      { text: 'Canteen food', points: 30, revealed: false },
      { text: 'Lectures', points: 25, revealed: false },
      { text: 'Campus', points: 20, revealed: false }
    ]
  },
  // Crush & Relationships
  {
    id: 'q15',
    text: 'Name something students stalk about their crush',
    answers: [
      { text: 'Instagram', points: 45, revealed: false },
      { text: 'WhatsApp DP', points: 40, revealed: false },
      { text: 'Old posts', points: 35, revealed: false },
      { text: 'Following list', points: 30, revealed: false },
      { text: 'Tagged photos', points: 25, revealed: false },
      { text: 'Last seen', points: 20, revealed: false }
    ]
  },
  {
    id: 'q16',
    text: 'Name something students overthink after texting their crush',
    answers: [
      { text: 'Typing speed', points: 45, revealed: false },
      { text: 'Emojis used', points: 40, revealed: false },
      { text: 'Message tone', points: 35, revealed: false },
      { text: 'Seen time', points: 30, revealed: false },
      { text: 'Reply length', points: 25, revealed: false },
      { text: 'Meaning', points: 20, revealed: false }
    ]
  },
  {
    id: 'q17',
    text: 'Name something that instantly ruins attraction',
    answers: [
      { text: 'Arrogance', points: 45, revealed: false },
      { text: 'Disrespect', points: 40, revealed: false },
      { text: 'Bad hygiene', points: 35, revealed: false },
      { text: 'Red flags', points: 30, revealed: false },
      { text: 'Immaturity', points: 25, revealed: false },
      { text: 'Cringe behaviour', points: 20, revealed: false }
    ]
  },
  // Exam Related
  {
    id: 'q18',
    text: 'First thought after seeing the question paper',
    answers: [
      { text: '"Yeh kya hai?"', points: 45, revealed: false },
      { text: '"Out of syllabus"', points: 40, revealed: false },
      { text: '"I\'m dead"', points: 35, revealed: false },
      { text: '"Pass ho jaunga"', points: 30, revealed: false },
      { text: '"Easy hai"', points: 25, revealed: false },
      { text: '"Bas likh dete hain"', points: 20, revealed: false }
    ]
  },
  {
    id: 'q19',
    text: 'Reason students sit in last bench',
    answers: [
      { text: 'Freedom', points: 45, revealed: false },
      { text: 'Phone use', points: 40, revealed: false },
      { text: 'Talk freely', points: 35, revealed: false },
      { text: 'Sleep', points: 30, revealed: false },
      { text: 'Avoid questions', points: 25, revealed: false },
      { text: 'Habit', points: 20, revealed: false }
    ]
  },
  {
    id: 'q20',
    text: 'Something students complain about every semester',
    answers: [
      { text: 'Timetable', points: 45, revealed: false },
      { text: 'Subjects', points: 40, revealed: false },
      { text: 'Faculty', points: 35, revealed: false },
      { text: 'Workload', points: 30, revealed: false },
      { text: 'Attendance', points: 25, revealed: false },
      { text: 'Exam pattern', points: 20, revealed: false }
    ]
  },
  // Life & Overthinking
  {
    id: 'q21',
    text: 'Something people overthink at 2 AM',
    answers: [
      { text: 'Life choices', points: 45, revealed: false },
      { text: 'One awkward moment', points: 40, revealed: false },
      { text: 'Future', points: 35, revealed: false },
      { text: 'Conversations', points: 30, revealed: false },
      { text: 'Career', points: 25, revealed: false },
      { text: '"Why am I like this"', points: 20, revealed: false }
    ]
  },
  {
    id: 'q22',
    text: 'Something people do instead of fixing problems',
    answers: [
      { text: 'Ignore', points: 45, revealed: false },
      { text: 'Sleep', points: 40, revealed: false },
      { text: 'Joke about it', points: 35, revealed: false },
      { text: 'Vent', points: 30, revealed: false },
      { text: 'Scroll', points: 25, revealed: false },
      { text: "Pretend it's fine", points: 20, revealed: false }
    ]
  },
  {
    id: 'q23',
    text: 'Something people think they\'ll fix "tomorrow"',
    answers: [
      { text: 'Sleep cycle', points: 45, revealed: false },
      { text: 'Life', points: 40, revealed: false },
      { text: 'Diet', points: 35, revealed: false },
      { text: 'Mental health', points: 30, revealed: false },
      { text: 'Career', points: 25, revealed: false },
      { text: 'Relationships', points: 20, revealed: false }
    ]
  },
  // General Life
  {
    id: 'q24',
    text: 'Name something you do before bed',
    answers: [
      { text: 'Brush teeth', points: 45, revealed: false },
      { text: 'Change clothes', points: 40, revealed: false },
      { text: 'Set alarm', points: 35, revealed: false },
      { text: 'Use phone', points: 30, revealed: false },
      { text: 'Pray', points: 25, revealed: false },
      { text: 'Read', points: 20, revealed: false }
    ]
  },
  {
    id: 'q25',
    text: 'Name a place where you have to be very quiet',
    answers: [
      { text: 'Library', points: 45, revealed: false },
      { text: 'Church / Temple', points: 40, revealed: false },
      { text: 'Movie theater', points: 35, revealed: false },
      { text: 'Hospital', points: 30, revealed: false },
      { text: 'Classroom', points: 25, revealed: false },
      { text: 'Courtroom', points: 20, revealed: false }
    ]
  },
  // Tech & Coding
  {
    id: 'q26',
    text: 'Name something people blame when their code doesn\'t work',
    answers: [
      { text: 'Bug', points: 45, revealed: false },
      { text: 'Internet', points: 40, revealed: false },
      { text: 'Laptop', points: 35, revealed: false },
      { text: 'Compiler', points: 30, revealed: false },
      { text: '"System issue"', points: 25, revealed: false },
      { text: 'Fate', points: 20, revealed: false }
    ]
  },
  {
    id: 'q27',
    text: 'Name something people check first on a new phone',
    answers: [
      { text: 'Camera', points: 45, revealed: false },
      { text: 'Storage', points: 40, revealed: false },
      { text: 'Display', points: 35, revealed: false },
      { text: 'Speed', points: 30, revealed: false },
      { text: 'Battery', points: 25, revealed: false },
      { text: 'Games', points: 20, revealed: false }
    ]
  },
  // Social Behavior
  {
    id: 'q28',
    text: 'Name something people do when they see someone they don\'t want to talk to',
    answers: [
      { text: 'Pretend busy', points: 45, revealed: false },
      { text: 'Use phone', points: 40, revealed: false },
      { text: 'Change direction', points: 35, revealed: false },
      { text: 'Fake call', points: 30, revealed: false },
      { text: 'Hide', points: 25, revealed: false },
      { text: 'Smile painfully', points: 20, revealed: false }
    ]
  },
  {
    id: 'q29',
    text: 'Name something people postpone the most',
    answers: [
      { text: 'Exercise', points: 45, revealed: false },
      { text: 'Studying', points: 40, revealed: false },
      { text: 'Cleaning', points: 35, revealed: false },
      { text: 'Replying texts', points: 30, revealed: false },
      { text: 'Doctor visit', points: 25, revealed: false },
      { text: 'Life decisions', points: 20, revealed: false }
    ]
  },
  {
    id: 'q30',
    text: 'Name something people keep reopening for no reason',
    answers: [
      { text: 'Fridge', points: 45, revealed: false },
      { text: 'Instagram', points: 40, revealed: false },
      { text: 'WhatsApp', points: 35, revealed: false },
      { text: 'YouTube', points: 30, revealed: false },
      { text: 'Email', points: 25, revealed: false },
      { text: 'Problems', points: 20, revealed: false }
    ]
  },
  // Bonus Questions from Tanmay
  {
    id: 'q31',
    text: 'Name the "Final Boss" of college life',
    answers: [
      { text: '8 AM lectures', points: 45, revealed: false },
      { text: 'Group Projects', points: 40, revealed: false },
      { text: 'The HOD', points: 35, revealed: false },
      { text: 'The Xerox shop line', points: 30, revealed: false },
      { text: 'Final exams', points: 25, revealed: false },
      { text: 'Placement interviews', points: 20, revealed: false }
    ]
  },
  {
    id: 'q32',
    text: 'Name something a student "borrows" from a classmate and never returns',
    answers: [
      { text: 'Pen', points: 45, revealed: false },
      { text: 'Charger', points: 40, revealed: false },
      { text: 'Hoodie', points: 35, revealed: false },
      { text: 'Record/Practical file', points: 30, revealed: false },
      { text: 'Money', points: 25, revealed: false },
      { text: 'Notes', points: 20, revealed: false }
    ]
  },
  {
    id: 'q33',
    text: 'Name something a student does to look "cool" when they see their campus crush walking by',
    answers: [
      { text: 'Change their walk', points: 45, revealed: false },
      { text: 'Talk louder to friends', points: 40, revealed: false },
      { text: 'Fix their hair', points: 35, revealed: false },
      { text: 'Suddenly look very busy on their phone', points: 30, revealed: false },
      { text: 'Put on sunglasses', points: 25, revealed: false },
      { text: 'Act confident', points: 20, revealed: false }
    ]
  },
  {
    id: 'q34',
    text: 'Name a place on campus where you\'re most likely to see a couple "getting cozy"',
    answers: [
      { text: 'The Garden', points: 45, revealed: false },
      { text: 'Behind the library', points: 40, revealed: false },
      { text: 'The canteen corner', points: 35, revealed: false },
      { text: 'Parking lot', points: 30, revealed: false },
      { text: 'Back stairs', points: 25, revealed: false },
      { text: 'Empty classroom', points: 20, revealed: false }
    ]
  },
  {
    id: 'q35',
    text: 'What is the most common "accidental" noise heard when a student forgets to mute during an online class?',
    answers: [
      { text: 'Toilet flush', points: 45, revealed: false },
      { text: 'Mom yelling', points: 40, revealed: false },
      { text: 'Dog barking', points: 35, revealed: false },
      { text: 'Loud chewing', points: 30, revealed: false },
      { text: 'Sibling fighting', points: 25, revealed: false },
      { text: 'TV in background', points: 20, revealed: false }
    ]
  },
  {
    id: 'q36',
    text: 'Name a reason a student might suddenly become "very religious" during finals week',
    answers: [
      { text: "Didn't study anything", points: 45, revealed: false },
      { text: 'Scared of failing', points: 40, revealed: false },
      { text: 'To get a "miracle"', points: 35, revealed: false },
      { text: "Parents' pressure", points: 30, revealed: false },
      { text: 'No other choice', points: 25, revealed: false },
      { text: 'Last hope', points: 20, revealed: false }
    ]
  },
  {
    id: 'q37',
    text: 'Name something a student stalks on their crush\'s profile to see if they\'re single',
    answers: [
      { text: 'Following list', points: 45, revealed: false },
      { text: 'Tagged photos', points: 40, revealed: false },
      { text: 'Highlights with "heart" emojis', points: 35, revealed: false },
      { text: 'Old comments', points: 30, revealed: false },
      { text: 'WhatsApp DP', points: 25, revealed: false },
      { text: 'Relationship status', points: 20, revealed: false }
    ]
  },
  {
    id: 'q38',
    text: 'Name something a student overthinks before sending a risky text',
    answers: [
      { text: 'The tone', points: 45, revealed: false },
      { text: 'Which emoji to use', points: 40, revealed: false },
      { text: 'The literal meaning', points: 35, revealed: false },
      { text: 'If it sounds too needy', points: 30, revealed: false },
      { text: 'Timing', points: 25, revealed: false },
      { text: 'Grammar', points: 20, revealed: false }
    ]
  },
  {
    id: 'q39',
    text: 'Name the "cheapest" date a college student can take someone on',
    answers: [
      { text: 'Sitting in the library', points: 45, revealed: false },
      { text: 'Walking in the garden', points: 40, revealed: false },
      { text: 'Sharing one plate of Maggi', points: 35, revealed: false },
      { text: 'A "Netflix and chill" session (using a friend\'s password)', points: 30, revealed: false },
      { text: 'College canteen', points: 25, revealed: false },
      { text: 'Chai tapri', points: 20, revealed: false }
    ]
  },
  {
    id: 'q40',
    text: 'Name something a student "borrows" from their partner and definitely never returns',
    answers: [
      { text: 'Oversized hoodie', points: 45, revealed: false },
      { text: 'Charger', points: 40, revealed: false },
      { text: 'Notes/Assignments', points: 35, revealed: false },
      { text: 'Money', points: 30, revealed: false },
      { text: 'Peace of mind', points: 25, revealed: false },
      { text: 'T-shirt', points: 20, revealed: false }
    ]
  },
  {
    id: 'q41',
    text: 'Name something people do immediately after a breakup to show they are "doing great"',
    answers: [
      { text: 'Post a "glow up" photo', points: 45, revealed: false },
      { text: 'Go to the gym', points: 40, revealed: false },
      { text: 'Party with friends', points: 35, revealed: false },
      { text: 'Delete all old photos', points: 30, revealed: false },
      { text: 'Post cryptic quotes', points: 25, revealed: false },
      { text: 'Get a haircut', points: 20, revealed: false }
    ]
  },
  {
    id: 'q42',
    text: 'Name a "classic" breakup excuse that everyone knows is fake',
    answers: [
      { text: '"It\'s not you, it\'s me"', points: 45, revealed: false },
      { text: '"I need to focus on my career/studies"', points: 40, revealed: false },
      { text: '"I\'m not ready for a relationship"', points: 35, revealed: false },
      { text: '"My parents won\'t agree"', points: 30, revealed: false },
      { text: '"We\'re better as friends"', points: 25, revealed: false },
      { text: '"Timing is wrong"', points: 20, revealed: false }
    ]
  }
];

module.exports = realQuestions;
