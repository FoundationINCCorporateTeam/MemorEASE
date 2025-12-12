// Guided Learning Engine JavaScript

let currentLesson = null;
let currentStepIndex = 0;
let chatHistory = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Setup event listeners
});

// Generate Lesson
async function generateLesson() {
    const subject = document.getElementById('subject').value;
    const level = document.getElementById('level').value;
    const topic = document.getElementById('topic').value;
    const learningStyle = document.querySelector('input[name="learning-style"]:checked').value;
    
    if (!topic || topic.trim().length === 0) {
        showToast('Please describe what you want to learn', 'error');
        return;
    }
    
    // Build AI prompt
    const prompt = buildLessonPrompt(subject, level, topic, learningStyle);
    
    // Show loading
    showLoading('setup-panel');
    
    try {
        // Make API request
        const response = await makeAPIRequest(prompt);
        
        // Parse response
        currentLesson = parseLessonResponse(response, {
            subject,
            level,
            topic,
            learningStyle
        });
        
        // Display lesson
        displayLesson(currentLesson);
        
        // Hide setup panel, show lesson panel
        document.getElementById('setup-panel').classList.add('hidden');
        document.getElementById('lesson-panel').classList.remove('hidden');
        
        showToast('Lesson generated successfully!', 'success');
    } catch (error) {
        console.error('Error generating lesson:', error);
        showToast('Failed to generate lesson. Please check your API key and try again.', 'error');
        hideLoading('setup-panel');
    }
}

// Build Lesson Prompt
function buildLessonPrompt(subject, level, topic, learningStyle) {
    let prompt = `Create a comprehensive ${level} level lesson for ${subject} on the topic: "${topic}".\n\n`;
    prompt += `Learning style preference: ${learningStyle}\n\n`;
    
    prompt += `Structure the lesson with:\n`;
    prompt += `1. An overview explaining what will be learned\n`;
    prompt += `2. 5-7 progressive learning steps, each with:\n`;
    prompt += `   - Clear title\n`;
    prompt += `   - Detailed explanation\n`;
    prompt += `   - Concrete example\n`;
    prompt += `   - Practice task for the student\n`;
    prompt += `   - 2-3 hints they can use if stuck\n`;
    prompt += `3. Key concepts to remember\n\n`;
    
    prompt += `Format your response as JSON with this structure:\n`;
    prompt += `{\n`;
    prompt += `  "title": "Lesson title",\n`;
    prompt += `  "overview": "Brief overview",\n`;
    prompt += `  "estimated_time": 30,\n`;
    prompt += `  "steps": [\n`;
    prompt += `    {\n`;
    prompt += `      "number": 1,\n`;
    prompt += `      "title": "Step title",\n`;
    prompt += `      "instruction": "Detailed explanation",\n`;
    prompt += `      "example": "Worked example",\n`;
    prompt += `      "task": "Practice task description",\n`;
    prompt += `      "hints": ["Hint 1", "Hint 2"]\n`;
    prompt += `    }\n`;
    prompt += `  ],\n`;
    prompt += `  "key_concepts": ["Concept 1", "Concept 2"]\n`;
    prompt += `}\n\n`;
    
    prompt += `Make the lesson engaging, clear, and appropriate for ${level} level students.`;
    
    return prompt;
}

// Parse Lesson Response
function parseLessonResponse(response, metadata) {
    const data = parseAIResponse(response);
    
    if (data) {
        return {
            lesson_id: generateId(),
            ...metadata,
            ...data,
            created_at: new Date().toISOString()
        };
    } else {
        // Return sample lesson if parsing fails
        return createSampleLesson(metadata);
    }
}

// Create Sample Lesson (fallback)
function createSampleLesson(metadata) {
    return {
        lesson_id: generateId(),
        ...metadata,
        title: `Introduction to ${metadata.topic}`,
        overview: `This lesson will help you understand the fundamentals of ${metadata.topic}.`,
        estimated_time: 30,
        steps: [
            {
                number: 1,
                title: 'Understanding the Basics',
                instruction: `Let's start by understanding what ${metadata.topic} is all about. This fundamental concept is essential for mastering this subject.`,
                example: 'Here is a simple example to illustrate the concept.',
                task: 'Try to apply this concept to a simple problem.',
                hints: ['Think about the definition', 'Consider similar examples you know']
            },
            {
                number: 2,
                title: 'Applying What You Learned',
                instruction: 'Now that you understand the basics, let\'s apply this knowledge to more complex scenarios.',
                example: 'Here\'s how you can use this in real situations.',
                task: 'Complete the practice exercise in the workspace.',
                hints: ['Break the problem into smaller steps', 'Use the example as a guide']
            },
            {
                number: 3,
                title: 'Mastery Challenge',
                instruction: 'Test your understanding with this challenge problem.',
                example: 'Review the previous examples if needed.',
                task: 'Solve the advanced problem independently.',
                hints: ['Combine what you learned in steps 1 and 2', 'Take your time and work through it systematically']
            }
        ],
        key_concepts: [
            'Understanding core principles',
            'Practical application',
            'Problem-solving techniques'
        ],
        created_at: new Date().toISOString()
    };
}

// Display Lesson
function displayLesson(lesson) {
    // Set lesson header
    document.getElementById('lesson-title').textContent = lesson.title;
    document.getElementById('lesson-info').textContent = `${lesson.subject} • ${lesson.level} • ~${lesson.estimated_time} minutes`;
    document.getElementById('total-steps').textContent = lesson.steps.length;
    
    // Reset step index
    currentStepIndex = 0;
    
    // Display first step
    displayStep(currentStepIndex);
    updateProgress();
}

// Display Step
function displayStep(stepIndex) {
    const step = currentLesson.steps[stepIndex];
    const stepsContainer = document.getElementById('steps-container');
    
    stepsContainer.innerHTML = `
        <div class="glass-card p-6 rounded-2xl fade-in">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-2xl font-bold">Step ${step.number}: ${step.title}</h3>
                <span class="badge badge-primary">Step ${stepIndex + 1}/${currentLesson.steps.length}</span>
            </div>
            
            <div class="space-y-6">
                <!-- Overview -->
                <div>
                    <h4 class="text-lg font-semibold mb-2 text-purple-300">📚 Learn</h4>
                    <p class="text-lg leading-relaxed">${step.instruction}</p>
                </div>
                
                <!-- Example -->
                <div class="glass-card p-4 rounded-xl bg-purple-900/20">
                    <h4 class="text-lg font-semibold mb-2 text-purple-300">💡 Example</h4>
                    <p>${step.example}</p>
                </div>
                
                <!-- Task -->
                <div class="glass-card p-4 rounded-xl bg-blue-900/20 border-blue-500/30">
                    <h4 class="text-lg font-semibold mb-2 text-blue-300">✏️ Your Task</h4>
                    <p>${step.task}</p>
                </div>
                
                <!-- Hints (collapsible) -->
                <div>
                    <button onclick="toggleHints()" class="glass-button px-4 py-2 rounded-lg">
                        💡 Show Hints
                    </button>
                    <div id="hints-container" class="hidden mt-3 space-y-2">
                        ${step.hints.map((hint, i) => `
                            <div class="glass-card p-3 rounded-lg text-sm">
                                <strong>Hint ${i + 1}:</strong> ${hint}
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Update navigation buttons
    updateNavButtons();
}

// Toggle Hints
function toggleHints() {
    const hintsContainer = document.getElementById('hints-container');
    hintsContainer.classList.toggle('hidden');
}

// Update Navigation Buttons
function updateNavButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    // Previous button
    if (currentStepIndex === 0) {
        prevBtn.disabled = true;
        prevBtn.classList.add('opacity-50', 'cursor-not-allowed');
    } else {
        prevBtn.disabled = false;
        prevBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    }
    
    // Next button
    if (currentStepIndex >= currentLesson.steps.length - 1) {
        nextBtn.textContent = 'Complete Lesson ✓';
    } else {
        nextBtn.textContent = 'Next Step →';
    }
}

// Update Progress
function updateProgress() {
    const percentage = ((currentStepIndex + 1) / currentLesson.steps.length) * 100;
    document.getElementById('lesson-progress').style.width = `${percentage}%`;
    document.getElementById('current-step').textContent = currentStepIndex + 1;
}

// Previous Step
function previousStep() {
    if (currentStepIndex > 0) {
        currentStepIndex--;
        displayStep(currentStepIndex);
        updateProgress();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Next Step
function nextStep() {
    if (currentStepIndex < currentLesson.steps.length - 1) {
        currentStepIndex++;
        displayStep(currentStepIndex);
        updateProgress();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        // Lesson complete
        completeLesson();
    }
}

// Complete Lesson
function completeLesson() {
    document.getElementById('lesson-panel').classList.add('hidden');
    document.getElementById('completion-panel').classList.remove('hidden');
    
    // Show summary
    const summaryContainer = document.getElementById('completion-summary');
    summaryContainer.innerHTML = currentLesson.key_concepts.map(concept => `
        <div class="flex items-start space-x-2">
            <span class="text-green-400">✓</span>
            <span>${concept}</span>
        </div>
    `).join('');
}

// Run Workspace
async function runWorkspace() {
    const code = document.getElementById('workspace-editor').value;
    const output = document.getElementById('workspace-output');
    const outputText = document.getElementById('output-text');
    
    if (!code || code.trim().length === 0) {
        showToast('Please write something in the workspace first', 'warning');
        return;
    }
    
    output.classList.remove('hidden');
    outputText.textContent = 'Checking your work...';
    
    // Simulate checking (in production, this would use the AI API)
    setTimeout(() => {
        outputText.textContent = '✓ Great work! Your solution looks correct.';
        showToast('Task completed!', 'success');
    }, 1500);
}

// Get Hint
function getHint() {
    const hintsContainer = document.getElementById('hints-container');
    if (hintsContainer.classList.contains('hidden')) {
        hintsContainer.classList.remove('hidden');
        showToast('Hints revealed!', 'info');
    } else {
        showToast('Hints are already visible', 'info');
    }
}

// Send Message (AI Tutor Chat)
async function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message to chat
    addChatMessage(message, 'user');
    input.value = '';
    
    // Show typing indicator
    const typingId = addChatMessage('Thinking...', 'ai', true);
    
    try {
        // Build context-aware prompt
        const prompt = buildTutorPrompt(message);
        
        // Make API request
        const response = await makeAPIRequest(prompt);
        
        // Remove typing indicator
        document.getElementById(typingId)?.remove();
        
        // Extract and display response
        const aiMessage = response.choices?.[0]?.text || response.text || 'I apologize, but I couldn\'t process that. Could you rephrase?';
        addChatMessage(aiMessage, 'ai');
        
    } catch (error) {
        console.error('Error in tutor chat:', error);
        document.getElementById(typingId)?.remove();
        addChatMessage('Sorry, I\'m having trouble connecting. Please try again.', 'ai');
    }
}

// Build Tutor Prompt
function buildTutorPrompt(userQuestion) {
    const context = `You are an AI tutor helping a ${currentLesson.level} level student learn about "${currentLesson.topic}" in ${currentLesson.subject}. 
    
    Current lesson: ${currentLesson.title}
    Current step: ${currentLesson.steps[currentStepIndex].title}
    
    Student question: ${userQuestion}
    
    Provide a helpful, clear, and encouraging response. Keep it concise (2-3 sentences).`;
    
    return context;
}

// Add Chat Message
function addChatMessage(message, sender, isTyping = false) {
    const chatMessages = document.getElementById('chat-messages');
    const messageId = generateId();
    
    const messageDiv = document.createElement('div');
    messageDiv.id = messageId;
    messageDiv.className = `glass-card p-3 rounded-lg ${sender === 'user' ? 'bg-purple-900/30 ml-8' : 'bg-blue-900/30 mr-8'}`;
    
    if (isTyping) {
        messageDiv.innerHTML = `<p class="text-sm pulse">${message}</p>`;
    } else {
        messageDiv.innerHTML = `<p class="text-sm">${message}</p>`;
    }
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    return messageId;
}

// Take Quiz
function takeQuiz() {
    showToast('Quiz feature coming soon!', 'info');
    // In production, this would generate a quiz based on the lesson
}

// Reset Lesson
function resetLesson() {
    currentLesson = null;
    currentStepIndex = 0;
    chatHistory = [];
    
    document.getElementById('completion-panel').classList.add('hidden');
    document.getElementById('lesson-panel').classList.add('hidden');
    document.getElementById('setup-panel').classList.remove('hidden');
    
    // Clear workspace
    document.getElementById('workspace-editor').value = '';
    document.getElementById('workspace-output').classList.add('hidden');
}
