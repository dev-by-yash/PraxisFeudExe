// Real Feud.Exe Questions - College Edition
const realQuestions = [
  // Question 1
  {
    id: 'q1',
    text: 'Reason students skip lectures',
    answers: [
      { text: 'Overslept', points: 45, revealed: false },
      { text: 'Boring subject', points: 40, revealed: false },
      { text: 'Assignment not done', points: 35, revealed: false },
      { text: 'Friend made a bunk plan', points: 30, revealed: false },
      { text: 'Weather', points: 25, revealed: false },
      { text: 'Attendance already safe', points: 20, revealed: false }
    ]
  },
  // Question 2
  {
    id: 'q2',
    text: 'Most used excuse for late submission',
    answers: [
      { text: 'Internet issue', points: 45, revealed: false },
      { text: 'File corrupted', points: 40, revealed: false },
      { text: 'Health issue', points: 35, revealed: false },
      { text: 'Out of town', points: 30, revealed: false },
      { text: 'Forgot', points: 25, revealed: false },
      { text: 'System problem', points: 20, revealed: false }
    ]
  },
  // Question 3
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
  // Question 4
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
  // Question 5
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
  // Question 6
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
  // Question 7
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
  // Question 8
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
  // Question 9
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
  // Question 10
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
  // Question 11
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
  // Question 12
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
  // Question 13
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
  // Question 14
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
  // Question 15
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
  // Question 16
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
  // Question 17
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
  // Question 18
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
  // Question 19
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
  // Question 20
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
  // Question 21
  {
    id: 'q21',
    text: 'Something students do when semester starts',
    answers: [
      { text: 'Act motivated', points: 45, revealed: false },
      { text: 'Buy new notebooks', points: 40, revealed: false },
      { text: 'Promise consistency', points: 35, revealed: false },
      { text: 'Sit front bench', points: 30, revealed: false },
      { text: 'Set goals', points: 25, revealed: false },
      { text: 'Give up later', points: 20, revealed: false }
    ]
  },
  // Question 22
  {
    id: 'q22',
    text: 'Something students do when teacher asks for doubts',
    answers: [
      { text: 'Stay silent', points: 45, revealed: false },
      { text: 'Avoid eye contact', points: 40, revealed: false },
      { text: 'Shake head', points: 35, revealed: false },
      { text: 'Pretend understanding', points: 30, revealed: false },
      { text: 'Ask random doubt', points: 25, revealed: false },
      { text: 'Look at friends', points: 20, revealed: false }
    ]
  },
  // Question 23
  {
    id: 'q23',
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
  // Question 24
  {
    id: 'q24',
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
  // Question 25
  {
    id: 'q25',
    text: "Something people think they'll fix 'tomorrow'",
    answers: [
      { text: 'Sleep cycle', points: 45, revealed: false },
      { text: 'Life', points: 40, revealed: false },
      { text: 'Diet', points: 35, revealed: false },
      { text: 'Mental health', points: 30, revealed: false },
      { text: 'Career', points: 25, revealed: false },
      { text: 'Relationships', points: 20, revealed: false }
    ]
  },
  // Question 26
  {
    id: 'q26',
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
  // Question 27
  {
    id: 'q27',
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
  // Question 28
  {
    id: 'q28',
    text: 'Name something people complain about at restaurants',
    answers: [
      { text: 'Food quality', points: 45, revealed: false },
      { text: 'Slow service', points: 40, revealed: false },
      { text: 'Price', points: 35, revealed: false },
      { text: 'Cleanliness', points: 30, revealed: false },
      { text: 'Portion size', points: 25, revealed: false },
      { text: 'Staff behaviour', points: 20, revealed: false }
    ]
  },
  // Question 29
  {
    id: 'q29',
    text: 'Name something people buy during a sale',
    answers: [
      { text: 'Clothes', points: 45, revealed: false },
      { text: 'Shoes', points: 40, revealed: false },
      { text: 'Electronics', points: 35, revealed: false },
      { text: 'Accessories', points: 30, revealed: false },
      { text: 'Home items', points: 25, revealed: false },
      { text: 'Beauty products', points: 20, revealed: false }
    ]
  },
  // Question 30
  {
    id: 'q30',
    text: "Name something people do when they're stressed",
    answers: [
      { text: 'Sleep', points: 45, revealed: false },
      { text: 'Eat', points: 40, revealed: false },
      { text: 'Listen to music', points: 35, revealed: false },
      { text: 'Talk to someone', points: 30, revealed: false },
      { text: 'Scroll phone', points: 25, revealed: false },
      { text: 'Exercise', points: 20, revealed: false }
    ]
  },
  // Question 31
  {
    id: 'q31',
    text: 'Name something people check before buying online',
    answers: [
      { text: 'Price', points: 45, revealed: false },
      { text: 'Reviews', points: 40, revealed: false },
      { text: 'Brand', points: 35, revealed: false },
      { text: 'Quality', points: 30, revealed: false },
      { text: 'Delivery time', points: 25, revealed: false },
      { text: 'Return policy', points: 20, revealed: false }
    ]
  },
  // Question 32
  {
    id: 'q32',
    text: 'Name something people keep beside their bed',
    answers: [
      { text: 'Phone', points: 45, revealed: false },
      { text: 'Charger', points: 40, revealed: false },
      { text: 'Water bottle', points: 35, revealed: false },
      { text: 'Alarm clock', points: 30, revealed: false },
      { text: 'Book', points: 25, revealed: false },
      { text: 'Glasses', points: 20, revealed: false }
    ]
  },
  // Question 33
  {
    id: 'q33',
    text: 'Name something people lie about on their resume',
    answers: [
      { text: 'Skills', points: 45, revealed: false },
      { text: 'Experience', points: 40, revealed: false },
      { text: 'Salary', points: 35, revealed: false },
      { text: 'Responsibilities', points: 30, revealed: false },
      { text: 'Job title', points: 25, revealed: false },
      { text: 'Reason for leaving', points: 20, revealed: false }
    ]
  },
  // Question 34
  {
    id: 'q34',
    text: "Name something people blame when they're late",
    answers: [
      { text: 'Traffic', points: 45, revealed: false },
      { text: 'Alarm', points: 40, revealed: false },
      { text: 'Weather', points: 35, revealed: false },
      { text: 'Transport', points: 30, revealed: false },
      { text: 'Someone else', points: 25, revealed: false },
      { text: 'Destiny', points: 20, revealed: false }
    ]
  },
  // Question 35
  {
    id: 'q35',
    text: 'Name something people check after posting a photo',
    answers: [
      { text: 'Likes', points: 45, revealed: false },
      { text: 'Views', points: 40, revealed: false },
      { text: 'Comments', points: 35, revealed: false },
      { text: 'Who saw it', points: 30, revealed: false },
      { text: 'Notifications', points: 25, revealed: false },
      { text: 'Still looks good', points: 20, revealed: false }
    ]
  },
  // Question 36
  {
    id: 'q36',
    text: "Name something people do when they see someone they don't want to talk to",
    answers: [
      { text: 'Pretend busy', points: 45, revealed: false },
      { text: 'Use phone', points: 40, revealed: false },
      { text: 'Change direction', points: 35, revealed: false },
      { text: 'Fake call', points: 30, revealed: false },
      { text: 'Hide', points: 25, revealed: false },
      { text: 'Smile painfully', points: 20, revealed: false }
    ]
  },
  // Question 37
  {
    id: 'q37',
    text: "Name something people blame when their code doesn't work",
    answers: [
      { text: 'Bug', points: 45, revealed: false },
      { text: 'Internet', points: 40, revealed: false },
      { text: 'Laptop', points: 35, revealed: false },
      { text: 'Compiler', points: 30, revealed: false },
      { text: '"System issue"', points: 25, revealed: false },
      { text: 'Fate', points: 20, revealed: false }
    ]
  },
  // Question 38
  {
    id: 'q38',
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
  // Question 39
  {
    id: 'q39',
    text: 'Name something people lie about in tech interviews',
    answers: [
      { text: 'Skill level', points: 45, revealed: false },
      { text: 'Experience', points: 40, revealed: false },
      { text: 'Projects', points: 35, revealed: false },
      { text: 'Confidence', points: 30, revealed: false },
      { text: 'Understanding', points: 25, revealed: false },
      { text: 'Debugging ability', points: 20, revealed: false }
    ]
  },
  // Question 40
  {
    id: 'q40',
    text: 'Name something people do when storage is full',
    answers: [
      { text: 'Delete photos', points: 45, revealed: false },
      { text: 'Delete apps', points: 40, revealed: false },
      { text: 'Panic', points: 35, revealed: false },
      { text: 'Buy cloud storage', points: 30, revealed: false },
      { text: 'Transfer files', points: 25, revealed: false },
      { text: 'Ignore warning', points: 20, revealed: false }
    ]
  },
  // Question 41
  {
    id: 'q41',
    text: 'Name something people dislike about app updates',
    answers: [
      { text: 'New layout', points: 45, revealed: false },
      { text: 'Bugs', points: 40, revealed: false },
      { text: 'More ads', points: 35, revealed: false },
      { text: 'App slower', points: 30, revealed: false },
      { text: 'Storage use', points: 25, revealed: false },
      { text: 'Forced update', points: 20, revealed: false }
    ]
  },
  // Question 42
  {
    id: 'q42',
    text: 'Name something people never read on apps',
    answers: [
      { text: 'Terms & conditions', points: 45, revealed: false },
      { text: 'Privacy policy', points: 40, revealed: false },
      { text: 'Update notes', points: 35, revealed: false },
      { text: 'Permissions text', points: 30, revealed: false },
      { text: 'Warnings', points: 25, revealed: false },
      { text: 'FAQs', points: 20, revealed: false }
    ]
  },
  // Question 43
  {
    id: 'q43',
    text: 'Name something people say as excuses during online classes/meetings',
    answers: [
      { text: 'Network issues', points: 45, revealed: false },
      { text: 'Audio problems', points: 40, revealed: false },
      { text: 'Camera glitches', points: 35, revealed: false },
      { text: 'Lag', points: 30, revealed: false },
      { text: 'App crashes', points: 25, revealed: false },
      { text: 'Background noise', points: 20, revealed: false }
    ]
  },
  // Question 44
  {
    id: 'q44',
    text: 'Name something people do when phone is about to die',
    answers: [
      { text: 'Stop using it', points: 45, revealed: false },
      { text: 'Reduce brightness', points: 40, revealed: false },
      { text: 'Close apps', points: 35, revealed: false },
      { text: 'Look for charger', points: 30, revealed: false },
      { text: 'Screenshot battery', points: 25, revealed: false },
      { text: 'Pray', points: 20, revealed: false }
    ]
  },
  // Question 45
  {
    id: 'q45',
    text: 'Name something people complain about in theaters',
    answers: [
      { text: 'Expensive snacks', points: 45, revealed: false },
      { text: 'Talking audience', points: 40, revealed: false },
      { text: 'Dirty seats', points: 35, revealed: false },
      { text: 'AC too cold', points: 30, revealed: false },
      { text: 'Late show start', points: 25, revealed: false },
      { text: 'Phone screens', points: 20, revealed: false }
    ]
  },
  // Question 46
  {
    id: 'q46',
    text: 'Name something people do when a romantic scene comes with parents',
    answers: [
      { text: 'Look at phone', points: 45, revealed: false },
      { text: 'Fake cough', points: 40, revealed: false },
      { text: 'Act uninterested', points: 35, revealed: false },
      { text: 'Change channel', points: 30, revealed: false },
      { text: 'Leave room', points: 25, revealed: false },
      { text: 'Die inside', points: 20, revealed: false }
    ]
  },
  // Question 47
  {
    id: 'q47',
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
  // Question 48
  {
    id: 'q48',
    text: "Name something people complain about but won't fix",
    answers: [
      { text: 'Sleep schedule', points: 45, revealed: false },
      { text: 'Health', points: 40, revealed: false },
      { text: 'Job/college', points: 35, revealed: false },
      { text: 'Habits', points: 30, revealed: false },
      { text: 'Screen time', points: 25, revealed: false },
      { text: 'Life', points: 20, revealed: false }
    ]
  },
  // Question 49
  {
    id: 'q49',
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
  // Question 50
  {
    id: 'q50',
    text: 'Name something that makes people say "Bas ab aur nahi"',
    answers: [
      { text: 'Assignments', points: 45, revealed: false },
      { text: 'Family functions', points: 40, revealed: false },
      { text: 'Office calls', points: 35, revealed: false },
      { text: 'Group chats', points: 30, revealed: false },
      { text: 'Exams', points: 25, revealed: false },
      { text: 'Responsibilities', points: 20, revealed: false }
    ]
  },
  // Question 51
  {
    id: 'q51',
    text: 'Name something people check even though they know nothing changed',
    answers: [
      { text: 'Phone', points: 45, revealed: false },
      { text: 'Marks portal', points: 40, revealed: false },
      { text: 'Messages', points: 35, revealed: false },
      { text: 'Bank balance', points: 30, revealed: false },
      { text: 'Tracking app', points: 25, revealed: false },
      { text: 'Life', points: 20, revealed: false }
    ]
  },
  // Question 52
  {
    id: 'q52',
    text: "Name something people swear they'll fix 'from tomorrow'",
    answers: [
      { text: 'Sleep schedule', points: 45, revealed: false },
      { text: 'Diet', points: 40, revealed: false },
      { text: 'Attendance', points: 35, revealed: false },
      { text: 'Fitness', points: 30, revealed: false },
      { text: 'Screen time', points: 25, revealed: false },
      { text: 'Life', points: 20, revealed: false }
    ]
  },
  // Question 53
  {
    id: 'q53',
    text: 'Name something people miss about childhood',
    answers: [
      { text: 'No stress', points: 45, revealed: false },
      { text: 'Free time', points: 40, revealed: false },
      { text: 'Afternoon naps', points: 35, revealed: false },
      { text: 'Cartoon network', points: 30, revealed: false },
      { text: 'Zero responsibility', points: 25, revealed: false },
      { text: 'Happiness', points: 20, revealed: false }
    ]
  },
  // Question 54
  {
    id: 'q54',
    text: 'Name something that feels longer than it actually is',
    answers: [
      { text: '5 minutes waiting', points: 45, revealed: false },
      { text: 'Last lecture', points: 40, revealed: false },
      { text: 'Buffering', points: 35, revealed: false },
      { text: 'Awkward silence', points: 30, revealed: false },
      { text: 'Exam time', points: 25, revealed: false },
      { text: 'Mondays', points: 20, revealed: false }
    ]
  },
  // Question 55
  {
    id: 'q55',
    text: 'Name something people immediately regret',
    answers: [
      { text: 'Sending a text', points: 45, revealed: false },
      { text: 'Ordering too much food', points: 40, revealed: false },
      { text: 'Staying up late', points: 35, revealed: false },
      { text: 'Oversharing', points: 30, revealed: false },
      { text: 'Saying yes', points: 25, revealed: false },
      { text: 'Trusting "trust me"', points: 20, revealed: false }
    ]
  },
  // Question 56
  {
    id: 'q56',
    text: 'Name something people forget during exams',
    answers: [
      { text: 'Formula', points: 45, revealed: false },
      { text: 'Pen', points: 40, revealed: false },
      { text: 'Hall ticket', points: 35, revealed: false },
      { text: 'Confidence', points: 30, revealed: false },
      { text: 'Time', points: 25, revealed: false },
      { text: 'Everything', points: 20, revealed: false }
    ]
  },
  // Question 57
  {
    id: 'q57',
    text: 'Name something people collect digitally',
    answers: [
      { text: 'Screenshots', points: 45, revealed: false },
      { text: 'Memes', points: 40, revealed: false },
      { text: 'Stickers', points: 35, revealed: false },
      { text: 'Playlists', points: 30, revealed: false },
      { text: 'Notes', points: 25, revealed: false },
      { text: 'Photos', points: 20, revealed: false }
    ]
  },
  // Question 58
  {
    id: 'q58',
    text: 'Name something you open in the morning',
    answers: [
      { text: 'Eyes', points: 45, revealed: false },
      { text: 'Door', points: 40, revealed: false },
      { text: 'Curtains', points: 35, revealed: false },
      { text: 'Fridge', points: 30, revealed: false },
      { text: 'Newspaper', points: 25, revealed: false },
      { text: 'Email', points: 20, revealed: false }
    ]
  },
  // Question 59
  {
    id: 'q59',
    text: 'Name something people put in their coffee',
    answers: [
      { text: 'Sugar', points: 45, revealed: false },
      { text: 'Milk', points: 40, revealed: false },
      { text: 'Cream', points: 35, revealed: false },
      { text: 'Sweetener', points: 30, revealed: false },
      { text: 'Ice', points: 25, revealed: false },
      { text: 'Flavor syrup', points: 20, revealed: false }
    ]
  },
  // Question 60
  {
    id: 'q60',
    text: 'Name something you might keep in your wallet',
    answers: [
      { text: 'Cash', points: 45, revealed: false },
      { text: 'Credit card', points: 40, revealed: false },
      { text: 'ID', points: 35, revealed: false },
      { text: "Driver's license", points: 30, revealed: false },
      { text: 'Photos', points: 25, revealed: false },
      { text: 'Receipts', points: 20, revealed: false }
    ]
  },
  // Question 61
  {
    id: 'q61',
    text: "Name something that's hard to share",
    answers: [
      { text: 'Food', points: 45, revealed: false },
      { text: 'Money', points: 40, revealed: false },
      { text: 'Bed', points: 35, revealed: false },
      { text: 'Blanket', points: 30, revealed: false },
      { text: 'Remote', points: 25, revealed: false },
      { text: 'Secrets', points: 20, revealed: false }
    ]
  },
  // Question 62
  {
    id: 'q62',
    text: "Name something people do when they're home alone",
    answers: [
      { text: 'Sing', points: 45, revealed: false },
      { text: 'Dance', points: 40, revealed: false },
      { text: 'Eat junk food', points: 35, revealed: false },
      { text: 'Watch TV', points: 30, revealed: false },
      { text: 'Invite friends over', points: 25, revealed: false },
      { text: 'Talk to themselves', points: 20, revealed: false }
    ]
  },
  // Question 63
  {
    id: 'q63',
    text: 'Name something you keep by your bed',
    answers: [
      { text: 'Phone', points: 45, revealed: false },
      { text: 'Lamp', points: 40, revealed: false },
      { text: 'Water', points: 35, revealed: false },
      { text: 'Glasses', points: 30, revealed: false },
      { text: 'Alarm clock', points: 25, revealed: false },
      { text: 'Book', points: 20, revealed: false }
    ]
  },
  // Question 64
  {
    id: 'q64',
    text: 'Name something siblings fight over',
    answers: [
      { text: 'Remote', points: 45, revealed: false },
      { text: 'Food', points: 40, revealed: false },
      { text: 'Attention', points: 35, revealed: false },
      { text: 'Clothes', points: 30, revealed: false },
      { text: 'Phone/computer', points: 25, revealed: false },
      { text: 'Bathroom', points: 20, revealed: false }
    ]
  },
  // Question 65
  {
    id: 'q65',
    text: 'Name something that makes you nervous at College',
    answers: [
      { text: 'Exam', points: 45, revealed: false },
      { text: 'Presentation', points: 40, revealed: false },
      { text: 'Teacher calling your name', points: 35, revealed: false },
      { text: 'Results', points: 30, revealed: false },
      { text: 'Principal', points: 25, revealed: false },
      { text: 'Crush', points: 20, revealed: false }
    ]
  },
  // Question 66
  {
    id: 'q66',
    text: 'Name something people lie about on dating profiles',
    answers: [
      { text: 'Age', points: 45, revealed: false },
      { text: 'Height', points: 40, revealed: false },
      { text: 'Job', points: 35, revealed: false },
      { text: 'Photos', points: 30, revealed: false },
      { text: 'Interests', points: 25, revealed: false },
      { text: 'Relationship goals', points: 20, revealed: false }
    ]
  },
  // Question 67
  {
    id: 'q67',
    text: 'Name something people complain about on flights',
    answers: [
      { text: 'Legroom', points: 45, revealed: false },
      { text: 'Food', points: 40, revealed: false },
      { text: 'Delay', points: 35, revealed: false },
      { text: 'Crying baby', points: 30, revealed: false },
      { text: 'Turbulence', points: 25, revealed: false },
      { text: 'Price', points: 20, revealed: false }
    ]
  },
  // Question 68
  {
    id: 'q68',
    text: 'Name something you hide when guests come over',
    answers: [
      { text: 'Laundry', points: 45, revealed: false },
      { text: 'Dishes', points: 40, revealed: false },
      { text: 'Trash', points: 35, revealed: false },
      { text: 'Shoes', points: 30, revealed: false },
      { text: 'Messy room', points: 25, revealed: false },
      { text: 'Valuables', points: 20, revealed: false }
    ]
  },
  // Question 69
  {
    id: 'q69',
    text: 'Name something people always misplace',
    answers: [
      { text: 'Remote', points: 45, revealed: false },
      { text: 'Glasses', points: 40, revealed: false },
      { text: 'Car keys', points: 35, revealed: false },
      { text: 'Wallet', points: 30, revealed: false },
      { text: 'Phone', points: 25, revealed: false },
      { text: 'TV remote batteries', points: 20, revealed: false }
    ]
  },
  // Question 70
  {
    id: 'q70',
    text: 'Name something people pretend they knew all along',
    answers: [
      { text: 'Exam answer', points: 45, revealed: false },
      { text: 'Breaking news', points: 40, revealed: false },
      { text: 'Plot twist', points: 35, revealed: false },
      { text: 'Stock rise', points: 30, revealed: false },
      { text: 'Sports result', points: 25, revealed: false },
      { text: 'Trend', points: 20, revealed: false }
    ]
  },
  // Question 71
  {
    id: 'q71',
    text: 'Name something people check before taking a selfie',
    answers: [
      { text: 'Hair', points: 45, revealed: false },
      { text: 'Teeth', points: 40, revealed: false },
      { text: 'Lighting', points: 35, revealed: false },
      { text: 'Background', points: 30, revealed: false },
      { text: 'Outfit', points: 25, revealed: false },
      { text: 'Camera lens', points: 20, revealed: false }
    ]
  },
  // Question 72
  {
    id: 'q72',
    text: 'Name something people lie about on resumes',
    answers: [
      { text: 'Skills', points: 45, revealed: false },
      { text: 'Experience', points: 40, revealed: false },
      { text: 'Leadership', points: 35, revealed: false },
      { text: 'Salary expectations', points: 30, revealed: false },
      { text: 'Role', points: 25, revealed: false },
      { text: 'Achievements', points: 20, revealed: false }
    ]
  },
  // Question 73
  {
    id: 'q73',
    text: "Name something that's scary in the dark",
    answers: [
      { text: 'Shadow', points: 45, revealed: false },
      { text: 'Basement', points: 40, revealed: false },
      { text: 'Closet', points: 35, revealed: false },
      { text: 'Backyard', points: 30, revealed: false },
      { text: 'Alley', points: 25, revealed: false },
      { text: 'Mirror', points: 20, revealed: false }
    ]
  },
  // Question 74
  {
    id: 'q74',
    text: 'Name something people triple-check',
    answers: [
      { text: 'Door lock', points: 45, revealed: false },
      { text: 'Stove', points: 40, revealed: false },
      { text: 'Alarm', points: 35, revealed: false },
      { text: 'Email', points: 30, revealed: false },
      { text: 'Ticket', points: 25, revealed: false },
      { text: 'Address', points: 20, revealed: false }
    ]
  },
  // Question 75
  {
    id: 'q75',
    text: 'Name something that makes you walk faster',
    answers: [
      { text: 'Dark alley', points: 45, revealed: false },
      { text: 'Late for class', points: 40, revealed: false },
      { text: 'Someone calling your name', points: 35, revealed: false },
      { text: 'Rain', points: 30, revealed: false },
      { text: 'Dog chasing', points: 25, revealed: false },
      { text: 'Closing elevator', points: 20, revealed: false }
    ]
  },
  // Question 76
  {
    id: 'q76',
    text: 'Name something that makes you jump',
    answers: [
      { text: 'Loud bang', points: 45, revealed: false },
      { text: 'Scary movie', points: 40, revealed: false },
      { text: 'Thunder', points: 35, revealed: false },
      { text: 'Prank', points: 30, revealed: false },
      { text: 'Fireworks', points: 25, revealed: false },
      { text: 'Sudden touch', points: 20, revealed: false }
    ]
  },
  // Question 77
  {
    id: 'q77',
    text: 'Name something people keep refreshing online',
    answers: [
      { text: 'Exam results', points: 45, revealed: false },
      { text: 'Tracking order', points: 40, revealed: false },
      { text: 'Crypto price', points: 35, revealed: false },
      { text: 'Scoreboard', points: 30, revealed: false },
      { text: 'Instagram likes', points: 25, revealed: false },
      { text: 'Email', points: 20, revealed: false }
    ]
  },
  // Question 78
  {
    id: 'q78',
    text: 'Name something that stops working during a fest',
    answers: [
      { text: 'Mic', points: 45, revealed: false },
      { text: 'Speakers', points: 40, revealed: false },
      { text: 'Projector', points: 35, revealed: false },
      { text: 'WiFi', points: 30, revealed: false },
      { text: 'Lights', points: 25, revealed: false },
      { text: 'QR scanner', points: 20, revealed: false }
    ]
  },
  // Question 79
  {
    id: 'q79',
    text: 'Name something printed on every fest poster',
    answers: [
      { text: 'Big title', points: 45, revealed: false },
      { text: 'Date', points: 40, revealed: false },
      { text: 'Venue', points: 35, revealed: false },
      { text: 'Sponsor logos', points: 30, revealed: false },
      { text: '"Limited seats"', points: 25, revealed: false },
      { text: 'QR code', points: 20, revealed: false }
    ]
  },
  // Question 80
  {
    id: 'q80',
    text: 'Name something that becomes viral in college',
    answers: [
      { text: 'Meme page post', points: 45, revealed: false },
      { text: 'Confession post', points: 40, revealed: false },
      { text: 'Fight video', points: 35, revealed: false },
      { text: 'Proposal video', points: 30, revealed: false },
      { text: 'Fest reel', points: 25, revealed: false },
      { text: 'Placement news', points: 20, revealed: false }
    ]
  },
  // Question 81
  {
    id: 'q81',
    text: 'Name something students hide from parents',
    answers: [
      { text: 'Backlogs', points: 45, revealed: false },
      { text: 'Low attendance', points: 40, revealed: false },
      { text: 'Fest expenses', points: 35, revealed: false },
      { text: 'Failed test', points: 30, revealed: false },
      { text: 'Bunking', points: 25, revealed: false },
      { text: 'Relationship', points: 20, revealed: false }
    ]
  },
  // Question 82
  {
    id: 'q82',
    text: 'Name something that spreads fast in college',
    answers: [
      { text: 'Rumors', points: 45, revealed: false },
      { text: 'Notes PDF', points: 40, revealed: false },
      { text: 'Meme', points: 35, revealed: false },
      { text: 'Fight news', points: 30, revealed: false },
      { text: 'Crush news', points: 25, revealed: false },
      { text: 'Internship info', points: 20, revealed: false }
    ]
  },
  // Question 83
  {
    id: 'q83',
    text: 'Name something that teams do before every match in sports week',
    answers: [
      { text: 'Warm-up', points: 45, revealed: false },
      { text: 'Team huddle', points: 40, revealed: false },
      { text: 'Pep talk', points: 35, revealed: false },
      { text: 'Stretching', points: 30, revealed: false },
      { text: 'Coin toss', points: 25, revealed: false },
      { text: 'Selfie', points: 20, revealed: false }
    ]
  },
  // Question 84
  {
    id: 'q84',
    text: 'Name something that becomes intense in finals during sports week',
    answers: [
      { text: 'Competition', points: 45, revealed: false },
      { text: 'Crowd', points: 40, revealed: false },
      { text: 'Security', points: 35, revealed: false },
      { text: 'Pressure', points: 30, revealed: false },
      { text: 'Arguments', points: 25, revealed: false },
      { text: 'Celebrations', points: 20, revealed: false }
    ]
  },
  // Question 85
  {
    id: 'q85',
    text: 'Name something people do in the last 5 minutes',
    answers: [
      { text: 'Write anything', points: 45, revealed: false },
      { text: 'Underline answers', points: 40, revealed: false },
      { text: 'Fill blanks', points: 35, revealed: false },
      { text: 'Pray', points: 30, revealed: false },
      { text: 'Count pages', points: 25, revealed: false },
      { text: 'Sign', points: 20, revealed: false }
    ]
  },
  // Question 86
  {
    id: 'q86',
    text: 'Name something written on project cover page',
    answers: [
      { text: 'Title', points: 45, revealed: false },
      { text: 'Name', points: 40, revealed: false },
      { text: 'Roll number', points: 35, revealed: false },
      { text: 'Guide name', points: 30, revealed: false },
      { text: 'Subject', points: 25, revealed: false },
      { text: 'College name', points: 20, revealed: false }
    ]
  },
  // Question 87
  {
    id: 'q87',
    text: 'Name something students google before exams',
    answers: [
      { text: 'Important questions', points: 45, revealed: false },
      { text: 'Previous papers', points: 40, revealed: false },
      { text: 'Definitions', points: 35, revealed: false },
      { text: 'Short notes', points: 30, revealed: false },
      { text: 'Quick revision', points: 25, revealed: false },
      { text: 'Pass strategy', points: 20, revealed: false }
    ]
  },
  // Extra Questions from Tanmay
  // Question 88
  {
    id: 'q88',
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
  // Question 89
  {
    id: 'q89',
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
  // Question 90
  {
    id: 'q90',
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
  // Question 91
  {
    id: 'q91',
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
  // Question 92
  {
    id: 'q92',
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
  // Question 93
  {
    id: 'q93',
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
  // Question 94
  {
    id: 'q94',
    text: "Name something a student stalks on their crush's profile to see if they're single",
    answers: [
      { text: 'Following list', points: 45, revealed: false },
      { text: 'Tagged photos', points: 40, revealed: false },
      { text: 'Highlights with "heart" emojis', points: 35, revealed: false },
      { text: 'Old comments', points: 30, revealed: false },
      { text: 'WhatsApp DP', points: 25, revealed: false },
      { text: 'Relationship status', points: 20, revealed: false }
    ]
  },
  // Question 95
  {
    id: 'q95',
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
  // Question 96
  {
    id: 'q96',
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
  // Question 97
  {
    id: 'q97',
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
  // Question 98
  {
    id: 'q98',
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
  // Question 99
  {
    id: 'q99',
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
