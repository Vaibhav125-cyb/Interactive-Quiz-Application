 // Quiz questions by category
        const quizQuestions = {
            general: [
                {
                    question: "What is the capital of France?",
                    options: ["London", "Berlin", "Paris", "Madrid"],
                    correctAnswer: 2
                },
                {
                    question: "Which planet is known as the Red Planet?",
                    options: ["Venus", "Mars", "Jupiter", "Saturn"],
                    correctAnswer: 1
                },
                {
                    question: "What is the largest mammal in the world?",
                    options: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
                    correctAnswer: 1
                },
                {
                    question: "Which element has the chemical symbol 'O'?",
                    options: ["Gold", "Oxygen", "Osmium", "Oganesson"],
                    correctAnswer: 1
                },
                {
                    question: "Who painted the Mona Lisa?",
                    options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
                    correctAnswer: 2
                }
            ],
            science: [
                {
                    question: "What is the chemical symbol for gold?",
                    options: ["Go", "Gd", "Au", "Ag"],
                    correctAnswer: 2
                },
                {
                    question: "Which gas do plants absorb from the atmosphere?",
                    options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
                    correctAnswer: 2
                },
                {
                    question: "What is the hardest natural substance on Earth?",
                    options: ["Gold", "Iron", "Diamond", "Platinum"],
                    correctAnswer: 2
                },
                {
                    question: "What is the smallest unit of life?",
                    options: ["Atom", "Cell", "Molecule", "Organelle"],
                    correctAnswer: 1
                },
                {
                    question: "Which planet has the most moons?",
                    options: ["Jupiter", "Saturn", "Uranus", "Neptune"],
                    correctAnswer: 1
                }
            ],
            history: [
                {
                    question: "Which year did World War II end?",
                    options: ["1943", "1945", "1947", "1950"],
                    correctAnswer: 1
                },
                {
                    question: "Who was the first President of the United States?",
                    options: ["Thomas Jefferson", "John Adams", "George Washington", "Benjamin Franklin"],
                    correctAnswer: 2
                },
                {
                    question: "The ancient city of Rome was built on how many hills?",
                    options: ["5", "7", "9", "12"],
                    correctAnswer: 1
                },
                {
                    question: "Who was the first woman to win a Nobel Prize?",
                    options: ["Marie Curie", "Rosalind Franklin", "Florence Nightingale", "Jane Addams"],
                    correctAnswer: 0
                },
                {
                    question: "Which ancient civilization built the Machu Picchu?",
                    options: ["Aztec", "Maya", "Inca", "Olmec"],
                    correctAnswer: 2
                }
            ],
            geography: [
                {
                    question: "What is the largest ocean on Earth?",
                    options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
                    correctAnswer: 3
                },
                {
                    question: "Which country has the largest land area?",
                    options: ["United States", "China", "Russia", "Canada"],
                    correctAnswer: 2
                },
                {
                    question: "What is the longest river in the world?",
                    options: ["Amazon", "Nile", "Mississippi", "Yangtze"],
                    correctAnswer: 1
                },
                {
                    question: "Which desert is the largest in the world?",
                    options: ["Gobi", "Sahara", "Arabian", "Antarctic"],
                    correctAnswer: 3
                },
                {
                    question: "Which mountain range separates Europe from Asia?",
                    options: ["Alps", "Andes", "Himalayas", "Urals"],
                    correctAnswer: 3
                }
            ]
        };

        // DOM Elements
        const welcomeScreen = document.querySelector('.welcome-screen');
        const quizScreen = document.querySelector('.quiz-screen');
        const resultsScreen = document.querySelector('.results-screen');
        const startBtn = document.querySelector('.start-btn');
        const nextBtn = document.querySelector('.next-btn');
        const restartBtn = document.querySelector('.restart-btn');
        const questionNumber = document.querySelector('.question-number');
        const questionElement = document.querySelector('.question');
        const optionsElement = document.querySelector('.options');
        const feedbackElement = document.querySelector('.feedback');
        const progressBar = document.querySelector('.progress-bar');
        const scoreValue = document.querySelector('.score-value');
        const categorySelect = document.getElementById('category');
        const timerElement = document.getElementById('time');

        // Quiz state variables
        let currentQuestionIndex = 0;
        let score = 0;
        let answeredQuestions = 0;
        let timer;
        let timeLeft;
        let currentQuestions = [];

        // Initialize the quiz
        function initQuiz() {
            const category = categorySelect.value;
            currentQuestions = [...quizQuestions[category]];
            currentQuestionIndex = 0;
            score = 0;
            answeredQuestions = 0;
            loadQuestion();
            updateProgressBar();
            startTimer();
        }

        // Load question
        function loadQuestion() {
            const currentQuestion = currentQuestions[currentQuestionIndex];
            questionNumber.textContent = `Question ${currentQuestionIndex + 1} of ${currentQuestions.length}`;
            questionElement.textContent = currentQuestion.question;
            
            // Clear previous options
            optionsElement.innerHTML = '';
            
            // Add new options
            currentQuestion.options.forEach((option, index) => {
                const li = document.createElement('li');
                li.classList.add('option');
                
                const optionIcon = document.createElement('span');
                optionIcon.classList.add('option-icon');
                optionIcon.textContent = String.fromCharCode(65 + index); // A, B, C, D
                
                li.appendChild(optionIcon);
                li.appendChild(document.createTextNode(option));
                li.setAttribute('data-index', index);
                li.addEventListener('click', selectOption);
                optionsElement.appendChild(li);
            });
            
            // Reset UI state
            feedbackElement.style.display = 'none';
            feedbackElement.className = 'feedback';
            nextBtn.style.display = 'none';
            
            // Reset and start timer
            resetTimer();
            startTimer();
        }

        // Select option
        function selectOption(e) {
            // If already answered, do nothing
            if (feedbackElement.style.display === 'block') return;
            
            const selectedOption = e.target.closest('.option');
            const selectedAnswer = parseInt(selectedOption.getAttribute('data-index'));
            const correctAnswer = currentQuestions[currentQuestionIndex].correctAnswer;
            
            // Mark all options as not selected
            document.querySelectorAll('.option').forEach(option => {
                option.classList.remove('selected');
            });
            
            // Mark selected option
            selectedOption.classList.add('selected');
            
            // Check if answer is correct
            const isCorrect = selectedAnswer === correctAnswer;
            
            // Show feedback
            feedbackElement.textContent = isCorrect 
                ? "Correct! Well done." 
                : `Incorrect. The correct answer is: ${currentQuestions[currentQuestionIndex].options[correctAnswer]}`;
            
            feedbackElement.classList.add(isCorrect ? 'correct' : 'incorrect');
            feedbackElement.style.display = 'block';
            
            // Update score if correct
            if (isCorrect) {
                score++;
            }
            
            // Show next button
            nextBtn.style.display = 'block';
            
            // Disable further selections
            document.querySelectorAll('.option').forEach(option => {
                option.removeEventListener('click', selectOption);
            });
            
            answeredQuestions++;
            
            // Stop timer
            clearInterval(timer);
        }

        // Next question
        function nextQuestion() {
            currentQuestionIndex++;
            
            if (currentQuestionIndex < currentQuestions.length) {
                loadQuestion();
                updateProgressBar();
            } else {
                showResults();
            }
        }

        // Update progress bar
        function updateProgressBar() {
            const progress = ((currentQuestionIndex) / currentQuestions.length) * 100;
            progressBar.style.width = `${progress}%`;
        }

        // Show results
        function showResults() {
            quizScreen.classList.remove('active');
            resultsScreen.classList.add('active');
            scoreValue.textContent = `${score}/${currentQuestions.length}`;
            
            // Custom message based on score
            const message = document.querySelector('.message');
            if (score === currentQuestions.length) {
                message.textContent = "Perfect! You're a quiz master!";
                celebratePerfectScore();
            } else if (score >= currentQuestions.length * 0.7) {
                message.textContent = "Great job! You know your stuff!";
            } else if (score >= currentQuestions.length * 0.5) {
                message.textContent = "Good effort! Try again to improve your score.";
            } else {
                message.textContent = "Keep learning and try again soon!";
            }
        }

        // Celebration for perfect score
        function celebratePerfectScore() {
            // Add animation class to score value
            scoreValue.classList.add('perfect-score');
            
            // Create confetti
            for (let i = 0; i < 50; i++) {
                createConfetti();
            }
            
            // Create stars
            for (let i = 0; i < 10; i++) {
                createStar();
            }
        }
        
        function createConfetti() {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = '-10px';
            confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
            document.querySelector('.container').appendChild(confetti);
            
            // Animate confetti
            confetti.style.animation = `confettiFall ${1 + Math.random() * 2}s linear forwards`;
            
            // Remove after animation
            setTimeout(() => {
                confetti.remove();
            }, 3000);
        }
        
        function createStar() {
            const star = document.createElement('div');
            star.classList.add('star');
            star.innerHTML = '<i class="fas fa-star"></i>';
            star.style.left = '50%';
            star.style.top = '50%';
            document.querySelector('.container').appendChild(star);
            
            // Set random translation values
            const tx = (Math.random() - 0.5) * 200 + 'px';
            const ty = (Math.random() - 0.5) * 100 + 'px';
            star.style.setProperty('--tx', tx);
            star.style.setProperty('--ty', ty);
            
            // Animate star
            star.style.animation = `starAnimation ${1 + Math.random() * 1}s ease-out forwards`;
            
            // Remove after animation
            setTimeout(() => {
                star.remove();
            }, 2000);
        }

        // Timer functions
        function startTimer() {
            timeLeft = 30;
            timerElement.textContent = timeLeft;
            
            timer = setInterval(() => {
                timeLeft--;
                timerElement.textContent = timeLeft;
                
                if (timeLeft <= 0) {
                    clearInterval(timer);
                    // Auto-select no answer and move to next question
                    feedbackElement.textContent = "Time's up! The correct answer was: " + 
                        currentQuestions[currentQuestionIndex].options[currentQuestions[currentQuestionIndex].correctAnswer];
                    feedbackElement.classList.add('incorrect');
                    feedbackElement.style.display = 'block';
                    nextBtn.style.display = 'block';
                    
                    // Disable further selections
                    document.querySelectorAll('.option').forEach(option => {
                        option.removeEventListener('click', selectOption);
                    });
                    
                    answeredQuestions++;
                }
            }, 1000);
        }
        
        function resetTimer() {
            clearInterval(timer);
            timeLeft = 30;
            timerElement.textContent = timeLeft;
        }
        // Start quiz
        startBtn.addEventListener('click', () => {
            welcomeScreen.classList.remove('active');
            quizScreen.classList.add('active');
            initQuiz();
        });

        // Next button
        nextBtn.addEventListener('click', nextQuestion);

        // Restart quiz
        restartBtn.addEventListener('click', () => {
            resultsScreen.classList.remove('active');
            welcomeScreen.classList.add('active');
            scoreValue.classList.remove('perfect-score');
        });