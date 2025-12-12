# MemorEASE

**AI-Powered Learning Platform** by Astroyds

MemorEASE is a comprehensive, feature-rich learning platform designed to make education more accessible, personalized, and effective for all types of learners. Built with modern web technologies and powered by AI, it provides tools for practice tests, guided learning, coding assignments, and much more.

## 🌟 Features

### Core Modules

1. **AI Practice Test Engine**
   - Generate practice tests for SAT, ACT, AP, IB, GED, and custom exams
   - Multiple question types (multiple choice, short answer, free response)
   - Instant grading with detailed explanations
   - Timer functionality and question navigator

2. **Guided Learning Engine**
   - Step-by-step lessons with AI tutoring
   - Personalized learning paths
   - Interactive workspace for practice
   - Real-time AI tutor chat support
   - Knowledge gap detection

3. **AI Coding Assignments**
   - Auto-generated programming tasks
   - Support for Python, JavaScript, Java, C++, and more
   - Built-in code editor with syntax highlighting
   - Test case validation
   - AI-powered feedback

4. **Language Practice**
   - Support for Spanish, French, German, Mandarin
   - Vocabulary and conjugation practice
   - Translation exercises
   - Interactive dialogues

5. **Math Walkthrough Engine**
   - Step-by-step problem solving
   - Visual explanations
   - Adaptive difficulty
   - Problem generation

6. **Career Readiness Suite**
   - AI résumé generator (HTML/ATS-friendly)
   - Reference letter generator
   - College essay grader
   - General essay grader with custom rubrics

7. **Email Writer & Checker**
   - Professional email composition
   - Grammar and tone checking
   - Multiple tone options

## 🚀 Technology Stack

- **Frontend**: HTML5, Tailwind CSS (CDN), Vanilla JavaScript
- **Backend**: PHP
- **Storage**: JSON files (no database required)
- **AI**: Featherless API integration
- **Design**: Modern glassmorphism with neon accents

## 📁 Project Structure

```
/memorease
  /assets
     /css
       styles.css          # Custom glassmorphism styles
     /js
       main.js             # Core utilities
       test_engine.js      # Test engine logic
       guided_learning.js  # Learning engine logic
       coding_assignments.js # Coding module logic
     /img
  /data
     user_profiles.json    # User data
     lessons.json          # Lesson templates
     tests.json            # Test templates
  /modules
     test_engine.html      # Practice test UI
     guided_learning.html  # Learning engine UI
     coding_assignments.html # Coding UI
     language_practice.html
     math_practice.html
     career_readiness.html
     email_tools.html
     ai_test_engine.php    # Test API backend
     guided_learning.php   # Learning API backend
  index.html              # Landing page
  dashboard.html          # Main dashboard
  README.md
```

## ⚙️ Setup Instructions

### Prerequisites

- Web server with PHP support (Apache, Nginx, or built-in PHP server)
- Featherless API key (get one at https://featherless.ai)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/FoundationINCCorporateTeam/MemorEASE.git
cd MemorEASE
```

2. Start a local server:
```bash
# Using PHP built-in server
php -S localhost:8000

# Or using Python
python3 -m http.server 8000
```

3. Open your browser and navigate to:
```
http://localhost:8000
```

4. Click "Get Started" and configure your API key in Settings

### Configuration

1. Go to Dashboard → Settings
2. Enter your Featherless API key
3. Select your preferred AI model (Qwen 3 8B recommended)
4. Choose theme (Dark/Light)
5. Click "Save Settings"

## 🎨 Design Philosophy

MemorEASE follows these core principles:

- **Personalization**: Adapts to each learner's pace, style, and goals
- **Inclusivity**: Designed for struggling students, gifted learners, and everyone in between
- **Efficiency**: Minimizes busywork, maximizes learning
- **Modern UX**: Beautiful glassmorphism design with smooth animations
- **AI as Mentor**: Uses AI to enhance learning, not replace human understanding

## 🔧 Customization

### Styling

All custom styles are in `assets/css/styles.css`. Key features:
- CSS variables for easy color customization
- Glassmorphism effects
- Neon text and glow effects
- Responsive design (mobile-first)
- Dark/Light mode support

### AI Models

Supported models:
- Qwen/Qwen3-8B (Recommended)
- meta-llama/Llama-3-8B
- mistralai/Mixtral-8x7B

Change model in Settings or update `CONFIG.defaultModel` in `assets/js/main.js`

## 📚 Usage Guide

### Creating a Practice Test

1. Go to Dashboard → AI Practice Tests
2. Select test type (SAT, ACT, AP, etc.)
3. Choose subject and difficulty
4. Set number of questions
5. Click "Generate Practice Test"
6. Complete test and submit for instant grading

### Starting a Guided Lesson

1. Go to Dashboard → Guided Learning
2. Choose subject and skill level
3. Describe what you want to learn
4. Select learning style preference
5. Click "Create My Learning Path"
6. Work through steps with AI tutor support

### Generating Coding Assignments

1. Go to Dashboard → Coding Assignments
2. Select programming language
3. Choose skill level
4. Describe the concept you're learning
5. Click "Generate Assignment"
6. Write code, run tests, get AI feedback

## 🤝 Contributing

This project is part of the Astroyds educational initiative. Contributions are welcome!

## 📄 License

© 2024 MemorEASE by Astroyds. All rights reserved.

## 🆘 Support

For issues, questions, or feature requests, please open an issue on GitHub.

## 🎯 Roadmap

- [ ] PDF export for résumés and essays
- [ ] More AI models integration
- [ ] User authentication system
- [ ] Progress analytics dashboard
- [ ] Mobile app version
- [ ] Offline mode support
- [ ] Collaborative learning features

## ✨ Acknowledgments

Built with modern web technologies and powered by the Featherless AI API.