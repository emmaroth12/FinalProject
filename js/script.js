// Quiz Questions
const quizQuestions = [
    {
        question: "What does WCAG stand for?",
        options: [
            "Web Content Accessibility Guidelines",
            "Web Compliance Accessibility Guide",
            "Web Component Accessibility Guidelines",
            "Web Content Access Governance"
        ],
        correctAnswer: 0,
        explanation: "WCAG stands for Web Content Accessibility Guidelines, which are developed by the W3C to provide a standard for web accessibility."
    },
    {
        question: "Which of these is NOT a WCAG principle?",
        options: [
            "Perceivable",
            "Operable",
            "Understandable",
            "Clickable"
        ],
        correctAnswer: 3,
        explanation: "The four WCAG principles are Perceivable, Operable, Understandable, and Robust (POUR). 'Clickable' is not a principle."
    },
    {
        question: "What is the minimum contrast ratio required for normal text under WCAG AA?",
        options: [
            "3:1",
            "4.5:1",
            "7:1",
            "2:1"
        ],
        correctAnswer: 1,
        explanation: "WCAG AA requires a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text."
    },
    {
        question: "Which ARIA attribute should be used to indicate that a button opens a modal dialog?",
        options: [
            "aria-pressed",
            "aria-haspopup",
            "aria-expanded",
            "aria-modal"
        ],
        correctAnswer: 1,
        explanation: "The aria-haspopup attribute indicates that activating the button will display a popup, such as a dialog."
    },
    {
        question: "What is the purpose of alt text for images?",
        options: [
            "To improve SEO",
            "To provide a text alternative for screen readers",
            "To display when images fail to load",
            "All of the above"
        ],
        correctAnswer: 3,
        explanation: "Alt text serves multiple purposes: it helps with SEO, provides accessibility for screen readers, and appears when images don't load."
    },
    {
        question: "Which HTML element is most appropriate for a main navigation menu?",
        options: [
            "<div>",
            "<nav>",
            "<menu>",
            "<section>"
        ],
        correctAnswer: 1,
        explanation: "The <nav> element is the semantic HTML element designed for navigation menus."
    },
    {
        question: "What does the 'skip to content' link help with?",
        options: [
            "Keyboard navigation",
            "Screen reader users",
            "Both of the above",
            "Neither of the above"
        ],
        correctAnswer: 2,
        explanation: "Skip links help both keyboard users (who can tab to it) and screen reader users (who can navigate directly to main content)."
    },
    {
        question: "Which of these is NOT a recommended practice for accessible forms?",
        options: [
            "Using <label> elements for all form controls",
            "Grouping related form elements with <fieldset>",
            "Using color alone to indicate required fields",
            "Providing clear error messages"
        ],
        correctAnswer: 2,
        explanation: "Using color alone to indicate required fields is not accessible - this information should be conveyed through text or icons as well."
    },
    {
        question: "What is the purpose of the aria-live attribute?",
        options: [
            "To indicate interactive elements",
            "To announce dynamic content changes to screen readers",
            "To improve mobile responsiveness",
            "To validate form inputs"
        ],
        correctAnswer: 1,
        explanation: "The aria-live attribute tells screen readers to announce updates to content within the element."
    },
    {
        question: "Which of these techniques helps make complex data tables accessible?",
        options: [
            "Using colspan and rowspan attributes",
            "Associating header cells with data cells using scope or headers attributes",
            "Providing a summary or caption",
            "All of the above"
        ],
        correctAnswer: 3,
        explanation: "All of these techniques contribute to making complex data tables more accessible."
    }
];


// DOM Elements
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultsScreen = document.getElementById('results-screen');
const startBtn = document.getElementById('start-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const submitBtn = document.getElementById('submit-btn');
const restartBtn = document.getElementById('restart-btn');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const progressText = document.getElementById('progress');
const timerText = document.getElementById('timer');
const scoreContainer = document.getElementById('score-container');
const feedbackContainer = document.getElementById('feedback-container');
const progressBar = document.getElementById('progress-bar');
const darkModeToggle = document.createElement('button'); // Dark mode toggle button

// Add dark mode toggle button to the header
darkModeToggle.textContent = "Toggle Dark Mode";
darkModeToggle.id = "dark-mode-toggle";
darkModeToggle.classList.add('btn');
document.querySelector('header').appendChild(darkModeToggle);

// Quiz State
let currentQuestionIndex = 0;
let userAnswers = Array(quizQuestions.length).fill(null);
let score = 0;
let timeLeft = 300; // 5 minutes in seconds
let timerInterval;

// Initialize the quiz
function initQuiz() {
    startScreen.classList.remove('hidden');
    quizScreen.classList.add('hidden');
    resultsScreen.classList.add('hidden');
    currentQuestionIndex = 0;
    userAnswers = Array(quizQuestions.length).fill(null);
    score = 0;
    timeLeft = 300;
    clearInterval(timerInterval);
    updateProgressBar();
}

// Start the quiz
function startQuiz() {
    startScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    quizScreen.classList.add('fade-in'); // Add fade-in animation
    startTimer();
    showQuestion();
}

// Timer function
function startTimer() {
    updateTimerDisplay();
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            submitQuiz();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerText.textContent = `Time remaining: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    if (timeLeft <= 30) {
        timerText.classList.add('warning'); // Add warning style
    } else {
        timerText.classList.remove('warning');
    }
}

// Display question
function showQuestion() {
    const question = quizQuestions[currentQuestionIndex];
    
    // Update progress
    progressText.textContent = `Question ${currentQuestionIndex + 1} of ${quizQuestions.length}`;
    updateProgressBar();
    
    // Set question text
    questionText.textContent = question.question;
    
    // Clear previous options
    optionsContainer.innerHTML = '';
    
    // Create options
    question.options.forEach((option, index) => {
        const optionElement = document.createElement('button');
        optionElement.classList.add('option');
        optionElement.textContent = option;
        optionElement.setAttribute('role', 'radio');
        optionElement.setAttribute('aria-checked', userAnswers[currentQuestionIndex] === index ? 'true' : 'false');
        optionElement.setAttribute('tabindex', userAnswers[currentQuestionIndex] === index ? '0' : '-1');
        
        if (userAnswers[currentQuestionIndex] === index) {
            optionElement.classList.add('selected');
        }
        
        optionElement.addEventListener('click', () => selectOption(index));
        optionElement.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selectOption(index);
            }
        });
        
        optionsContainer.appendChild(optionElement);
    });
    
    // Update button states
    prevBtn.disabled = currentQuestionIndex === 0;
    nextBtn.disabled = false;
    submitBtn.classList.add('hidden');
    
    if (currentQuestionIndex === quizQuestions.length - 1) {
        nextBtn.classList.add('hidden');
        submitBtn.classList.remove('hidden');
    } else {
        nextBtn.classList.remove('hidden');
        submitBtn.classList.add('hidden');
    }
    
    // Focus on first option for keyboard users
    if (optionsContainer.firstChild) {
        optionsContainer.firstChild.focus();
    }
}

// Update progress bar
function updateProgressBar() {
    const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
    progressBar.style.width = `${progress}%`;
}

// Select an option
function selectOption(optionIndex) {
    userAnswers[currentQuestionIndex] = optionIndex;
    showQuestion();
}

// Navigate to previous question
function prevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showQuestion();
    }
}

// Navigate to next question
function nextQuestion() {
    if (currentQuestionIndex < quizQuestions.length - 1) {
        currentQuestionIndex++;
        showQuestion();
    }
}

// Submit the quiz
function submitQuiz() {
    clearInterval(timerInterval);
    
    // Calculate score
    score = 0;
    quizQuestions.forEach((question, index) => {
        if (userAnswers[index] === question.correctAnswer) {
            score++;
        }
    });
    
    // Show results
    quizScreen.classList.add('hidden');
    resultsScreen.classList.remove('hidden');
    resultsScreen.classList.add('fade-in'); // Add fade-in animation
    
    // Display score
    const percentage = Math.round((score / quizQuestions.length) * 100);
    scoreContainer.textContent = `You scored ${score} out of ${quizQuestions.length} (${percentage}%)`;
    
    // Display feedback
    feedbackContainer.innerHTML = '';
    quizQuestions.forEach((question, index) => {
        const feedbackItem = document.createElement('div');
        feedbackItem.classList.add('feedback-item');
        
        const questionText = document.createElement('p');
        questionText.textContent = question.question;
        questionText.style.fontWeight = 'bold';
        
        const userAnswer = document.createElement('p');
        const isCorrect = userAnswers[index] === question.correctAnswer;
        userAnswer.textContent = `Your answer: ${question.options[userAnswers[index]] || 'Not answered'}`;
        userAnswer.style.color = isCorrect ? 'var(--success-color)' : 'var(--accent-color)';
        
        const correctAnswer = document.createElement('p');
        correctAnswer.textContent = `Correct answer: ${question.options[question.correctAnswer]}`;
        
        const explanation = document.createElement('p');
        explanation.textContent = question.explanation;
        explanation.style.fontStyle = 'italic';
        
        feedbackItem.appendChild(questionText);
        feedbackItem.appendChild(userAnswer);
        if (!isCorrect) {
            feedbackItem.appendChild(correctAnswer);
        }
        feedbackItem.appendChild(explanation);
        
        feedbackContainer.appendChild(feedbackItem);
    });
    
    // Focus on results for screen readers
    resultsScreen.setAttribute('tabindex', '-1');
    resultsScreen.focus();
}

// Toggle dark mode
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}

// Event Listeners
startBtn.addEventListener('click', startQuiz);
prevBtn.addEventListener('click', prevQuestion);
nextBtn.addEventListener('click', nextQuestion);
submitBtn.addEventListener('click', submitQuiz);
restartBtn.addEventListener('click', initQuiz);
darkModeToggle.addEventListener('click', toggleDarkMode);

// Initialize the quiz
initQuiz();