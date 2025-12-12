// AI Practice Test Engine JavaScript

let currentTest = null;
let userAnswers = {};
let testTimer = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Toggle time limit input visibility
    document.getElementById('enable-timer').addEventListener('change', (e) => {
        const timeLimitDiv = document.getElementById('time-limit-div');
        if (e.target.checked) {
            timeLimitDiv.classList.remove('hidden');
        } else {
            timeLimitDiv.classList.add('hidden');
        }
    });
});

// Generate Test
async function generateTest() {
    const testType = document.getElementById('test-type').value;
    const subject = document.getElementById('subject').value;
    const difficulty = document.getElementById('difficulty').value;
    const numQuestions = parseInt(document.getElementById('num-questions').value);
    const showExplanations = document.getElementById('show-explanations').checked;
    const strictFormat = document.getElementById('strict-format').checked;
    const enableTimer = document.getElementById('enable-timer').checked;
    const timeLimit = parseInt(document.getElementById('time-limit').value);
    
    // Get selected question types
    const questionTypes = Array.from(document.querySelectorAll('.question-type:checked'))
        .map(cb => cb.value);
    
    if (questionTypes.length === 0) {
        showToast('Please select at least one question type', 'error');
        return;
    }
    
    // Build AI prompt
    const prompt = buildTestGenerationPrompt(testType, subject, difficulty, numQuestions, questionTypes, strictFormat);
    
    // Show loading
    showLoading('setup-panel');
    
    try {
        // Make API request
        const response = await makeAPIRequest(prompt);
        
        // Parse response
        currentTest = parseTestResponse(response, {
            testType,
            subject,
            difficulty,
            numQuestions,
            showExplanations,
            strictFormat,
            enableTimer,
            timeLimit
        });
        
        // Display test
        displayTest(currentTest);
        
        // Hide setup panel, show test panel
        document.getElementById('setup-panel').classList.add('hidden');
        document.getElementById('test-panel').classList.remove('hidden');
        
        // Start timer if enabled
        if (enableTimer && timeLimit > 0) {
            startTimer(timeLimit * 60);
        }
        
        showToast('Test generated successfully!', 'success');
    } catch (error) {
        console.error('Error generating test:', error);
        showToast('Failed to generate test. Please check your API key and try again.', 'error');
        hideLoading('setup-panel');
    }
}

// Build Test Generation Prompt
function buildTestGenerationPrompt(testType, subject, difficulty, numQuestions, questionTypes, strictFormat) {
    let prompt = `Generate a ${difficulty} difficulty ${testType} practice test for ${subject}.\n\n`;
    prompt += `Requirements:\n`;
    prompt += `- Generate exactly ${numQuestions} questions\n`;
    prompt += `- Question types: ${questionTypes.join(', ')}\n`;
    
    if (strictFormat) {
        prompt += `- Follow the official ${testType} format exactly\n`;
    }
    
    prompt += `\nFor each question, provide:\n`;
    prompt += `1. The question text\n`;
    prompt += `2. Answer choices (A, B, C, D for multiple choice)\n`;
    prompt += `3. The correct answer\n`;
    prompt += `4. A brief explanation of why the answer is correct\n`;
    
    prompt += `\nFormat your response as JSON with this structure:\n`;
    prompt += `{\n`;
    prompt += `  "questions": [\n`;
    prompt += `    {\n`;
    prompt += `      "id": 1,\n`;
    prompt += `      "type": "multiple_choice",\n`;
    prompt += `      "question": "Question text here",\n`;
    prompt += `      "choices": ["A. Choice 1", "B. Choice 2", "C. Choice 3", "D. Choice 4"],\n`;
    prompt += `      "correct": "A",\n`;
    prompt += `      "explanation": "Explanation here"\n`;
    prompt += `    }\n`;
    prompt += `  ]\n`;
    prompt += `}\n\n`;
    
    prompt += `Ensure all questions are accurate, educationally valuable, and appropriate for ${difficulty} difficulty level.`;
    
    return prompt;
}

// Parse Test Response
function parseTestResponse(response, metadata) {
    try {
        // Extract JSON from response
        let jsonText = response.choices?.[0]?.text || response.text || '';
        
        // Try to find JSON in the response
        const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            jsonText = jsonMatch[0];
        }
        
        const data = JSON.parse(jsonText);
        
        return {
            test_id: generateId(),
            ...metadata,
            questions: data.questions || [],
            created_at: new Date().toISOString()
        };
    } catch (error) {
        console.error('Error parsing test response:', error);
        // Return sample test if parsing fails
        return createSampleTest(metadata);
    }
}

// Create Sample Test (fallback)
function createSampleTest(metadata) {
    return {
        test_id: generateId(),
        ...metadata,
        questions: [
            {
                id: 1,
                type: 'multiple_choice',
                question: 'What is 2 + 2?',
                choices: ['A. 3', 'B. 4', 'C. 5', 'D. 6'],
                correct: 'B',
                explanation: '2 + 2 equals 4, which is basic addition.'
            },
            {
                id: 2,
                type: 'multiple_choice',
                question: 'Which planet is closest to the Sun?',
                choices: ['A. Venus', 'B. Earth', 'C. Mercury', 'D. Mars'],
                correct: 'C',
                explanation: 'Mercury is the closest planet to the Sun.'
            }
        ],
        created_at: new Date().toISOString()
    };
}

// Display Test
function displayTest(test) {
    // Set test title and info
    document.getElementById('test-title').textContent = `${test.testType} - ${test.subject}`;
    document.getElementById('test-info').textContent = `${test.numQuestions} questions | ${test.difficulty} difficulty`;
    
    // Clear previous content
    const questionsContainer = document.getElementById('questions-container');
    const questionNav = document.getElementById('question-nav');
    questionsContainer.innerHTML = '';
    questionNav.innerHTML = '';
    userAnswers = {};
    
    // Render questions
    test.questions.forEach((question, index) => {
        renderQuestion(question, index, questionsContainer);
        renderNavButton(question, index, questionNav);
    });
}

// Render Question
function renderQuestion(question, index, container) {
    const questionDiv = document.createElement('div');
    questionDiv.id = `question-${index}`;
    questionDiv.className = 'question-card';
    
    let html = `
        <div class="mb-4">
            <div class="flex items-center justify-between mb-2">
                <span class="font-bold text-lg">Question ${index + 1}</span>
                <span class="badge badge-primary">${question.type.replace('_', ' ')}</span>
            </div>
            <p class="text-lg">${question.question}</p>
        </div>
    `;
    
    if (question.type === 'multiple_choice') {
        html += `<div class="space-y-2">`;
        question.choices.forEach((choice, choiceIndex) => {
            const choiceLetter = choice.charAt(0);
            html += `
                <button class="choice-button" onclick="selectAnswer(${index}, '${choiceLetter}')" id="choice-${index}-${choiceIndex}">
                    ${choice}
                </button>
            `;
        });
        html += `</div>`;
    } else if (question.type === 'short_answer' || question.type === 'fill_blank') {
        html += `
            <div class="mt-4">
                <input type="text" class="glass-input" placeholder="Enter your answer" 
                    onchange="selectAnswer(${index}, this.value)" id="answer-${index}">
            </div>
        `;
    } else if (question.type === 'free_response') {
        html += `
            <div class="mt-4">
                <textarea class="glass-input" rows="6" placeholder="Type your response here" 
                    onchange="selectAnswer(${index}, this.value)" id="answer-${index}"></textarea>
            </div>
        `;
    }
    
    questionDiv.innerHTML = html;
    container.appendChild(questionDiv);
}

// Render Navigation Button
function renderNavButton(question, index, container) {
    const button = document.createElement('button');
    button.id = `nav-${index}`;
    button.className = 'glass-button p-2 rounded hover-scale text-sm';
    button.textContent = index + 1;
    button.onclick = () => scrollToQuestion(index);
    container.appendChild(button);
}

// Select Answer
function selectAnswer(questionIndex, answer) {
    userAnswers[questionIndex] = answer;
    
    // Update UI
    const question = currentTest.questions[questionIndex];
    if (question.type === 'multiple_choice') {
        // Remove selected class from all choices
        document.querySelectorAll(`#question-${questionIndex} .choice-button`).forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Add selected class to chosen answer
        const buttons = document.querySelectorAll(`#question-${questionIndex} .choice-button`);
        buttons.forEach(btn => {
            if (btn.textContent.startsWith(answer)) {
                btn.classList.add('selected');
            }
        });
    }
    
    // Update nav button
    const navButton = document.getElementById(`nav-${questionIndex}`);
    if (navButton) {
        navButton.classList.add('badge-primary');
    }
}

// Scroll to Question
function scrollToQuestion(index) {
    const element = document.getElementById(`question-${index}`);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Start Timer
function startTimer(seconds) {
    const timerBar = document.getElementById('timer-bar');
    const timerBarFill = document.getElementById('timer-bar-fill');
    const timerDisplay = document.getElementById('timer-display');
    
    timerBar.classList.remove('hidden');
    
    testTimer = new Timer(
        seconds,
        (remaining) => {
            const percentage = (remaining / seconds) * 100;
            timerBarFill.style.width = `${percentage}%`;
            timerDisplay.textContent = testTimer.getFormatted();
            
            // Change color based on time remaining
            if (percentage < 25) {
                timerBarFill.style.background = 'linear-gradient(90deg, var(--error), var(--warning))';
            } else if (percentage < 50) {
                timerBarFill.style.background = 'linear-gradient(90deg, var(--warning), var(--success))';
            }
        },
        () => {
            showToast('Time is up!', 'warning');
            submitTest();
        }
    );
    
    testTimer.start();
}

// Submit Test
function submitTest() {
    if (testTimer) {
        testTimer.stop();
    }
    
    // Calculate results
    let correct = 0;
    const results = currentTest.questions.map((question, index) => {
        const userAnswer = userAnswers[index];
        const isCorrect = userAnswer === question.correct;
        if (isCorrect) correct++;
        
        return {
            questionIndex: index,
            question: question.question,
            userAnswer: userAnswer || 'No answer',
            correctAnswer: question.correct,
            isCorrect,
            explanation: question.explanation
        };
    });
    
    const total = currentTest.questions.length;
    const percentage = Math.round((correct / total) * 100);
    
    // Display results
    displayResults(correct, total, percentage, results);
    
    // Hide test panel, show results panel
    document.getElementById('test-panel').classList.add('hidden');
    document.getElementById('results-panel').classList.remove('hidden');
    document.getElementById('timer-bar').classList.add('hidden');
}

// Display Results
function displayResults(correct, total, percentage, results) {
    document.getElementById('score-display').textContent = `${correct}/${total}`;
    document.getElementById('percentage-display').textContent = `${percentage}% Correct`;
    
    const detailedResults = document.getElementById('detailed-results');
    detailedResults.innerHTML = '';
    
    results.forEach((result, index) => {
        const resultDiv = document.createElement('div');
        resultDiv.className = `glass-card p-4 rounded-xl ${result.isCorrect ? 'border-green-500/50' : 'border-red-500/50'}`;
        
        resultDiv.innerHTML = `
            <div class="flex items-start justify-between mb-2">
                <span class="font-bold">Question ${index + 1}</span>
                <span class="badge ${result.isCorrect ? 'badge-success' : 'badge-error'}">
                    ${result.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                </span>
            </div>
            <p class="text-purple-200 mb-2">${result.question}</p>
            <div class="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                    <span class="text-purple-400">Your Answer:</span>
                    <span class="font-semibold">${result.userAnswer}</span>
                </div>
                <div>
                    <span class="text-purple-400">Correct Answer:</span>
                    <span class="font-semibold text-green-400">${result.correctAnswer}</span>
                </div>
            </div>
            ${currentTest.showExplanations ? `
                <div class="mt-3 pt-3 border-t border-white/10">
                    <p class="text-sm text-purple-300"><strong>Explanation:</strong> ${result.explanation}</p>
                </div>
            ` : ''}
        `;
        
        detailedResults.appendChild(resultDiv);
    });
}

// Review Answers
function reviewAnswers() {
    document.getElementById('results-panel').classList.add('hidden');
    document.getElementById('test-panel').classList.remove('hidden');
    
    // Show correct/incorrect styling
    currentTest.questions.forEach((question, index) => {
        const userAnswer = userAnswers[index];
        const isCorrect = userAnswer === question.correct;
        
        if (question.type === 'multiple_choice') {
            const buttons = document.querySelectorAll(`#question-${index} .choice-button`);
            buttons.forEach(btn => {
                const choiceLetter = btn.textContent.charAt(0);
                if (choiceLetter === question.correct) {
                    btn.classList.add('correct');
                } else if (choiceLetter === userAnswer && !isCorrect) {
                    btn.classList.add('incorrect');
                }
            });
        }
    });
}

// Reset Test
function resetTest() {
    if (testTimer) {
        testTimer.stop();
        testTimer = null;
    }
    
    currentTest = null;
    userAnswers = {};
    
    document.getElementById('results-panel').classList.add('hidden');
    document.getElementById('test-panel').classList.add('hidden');
    document.getElementById('setup-panel').classList.remove('hidden');
    document.getElementById('timer-bar').classList.add('hidden');
}
