// MemorEASE Main JavaScript
// Core functionality and utilities

// Global Configuration
const CONFIG = {
    apiUrl: 'https://api.featherless.ai/v1',
    defaultModel: 'Qwen/Qwen3-8B',
    maxTokens: 2000,
    theme: localStorage.getItem('theme') || 'dark'
};

// Theme Management
function initTheme() {
    const theme = CONFIG.theme;
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeButton();
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    CONFIG.theme = newTheme;
    localStorage.setItem('theme', newTheme);
    updateThemeButton();
}

function updateThemeButton() {
    const themeButton = document.getElementById('theme-toggle');
    if (themeButton) {
        themeButton.textContent = CONFIG.theme === 'dark' ? '☀️' : '🌙';
    }
}

// Smooth Scrolling
function scrollToFeatures() {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
}

function scrollToModules() {
    document.getElementById('modules')?.scrollIntoView({ behavior: 'smooth' });
}

// API Helper Functions
async function makeAPIRequest(prompt, model = CONFIG.defaultModel) {
    const apiKey = localStorage.getItem('featherless_api_key');
    
    if (!apiKey) {
        throw new Error('API key not found. Please set your Featherless API key in settings.');
    }
    
    const requestBody = {
        model: model,
        prompt: prompt,
        max_tokens: CONFIG.maxTokens
    };
    
    try {
        const response = await fetch(`${CONFIG.apiUrl}/completions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
            throw new Error(`API request failed: ${response.statusText}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
}

// Loading State Management
function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `
            <div class="flex items-center justify-center py-8">
                <div class="spinner"></div>
                <span class="ml-4 text-purple-300">Processing...</span>
            </div>
        `;
    }
}

function hideLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = '';
    }
}

// Toast Notifications
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container') || createToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `glass-card p-4 rounded-lg mb-2 fade-in ${getToastClass(type)}`;
    toast.innerHTML = `
        <div class="flex items-center space-x-3">
            <span class="text-2xl">${getToastIcon(type)}</span>
            <span>${message}</span>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'fixed top-20 right-4 z-50 max-w-md';
    document.body.appendChild(container);
    return container;
}

function getToastClass(type) {
    const classes = {
        success: 'border-green-500/50',
        error: 'border-red-500/50',
        warning: 'border-yellow-500/50',
        info: 'border-purple-500/50'
    };
    return classes[type] || classes.info;
}

function getToastIcon(type) {
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    return icons[type] || icons.info;
}

// Modal Management
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = 'auto';
    }
}

// Form Validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validateRequired(value) {
    return value && value.trim().length > 0;
}

// Local Storage Helpers
function saveToLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
    }
}

function loadFromLocalStorage(key) {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : null;
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        return null;
    }
}

// Timer Utility
class Timer {
    constructor(duration, onTick, onComplete) {
        this.duration = duration;
        this.remaining = duration;
        this.onTick = onTick;
        this.onComplete = onComplete;
        this.intervalId = null;
    }
    
    start() {
        this.intervalId = setInterval(() => {
            this.remaining--;
            this.onTick(this.remaining);
            
            if (this.remaining <= 0) {
                this.stop();
                this.onComplete();
            }
        }, 1000);
    }
    
    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
    
    reset() {
        this.stop();
        this.remaining = this.duration;
    }
    
    getFormatted() {
        const hours = Math.floor(this.remaining / 3600);
        const minutes = Math.floor((this.remaining % 3600) / 60);
        const seconds = this.remaining % 60;
        
        if (hours > 0) {
            return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }
        return `${minutes}:${String(seconds).padStart(2, '0')}`;
    }
}

// Progress Tracking
function updateProgress(current, total, elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        const percentage = (current / total) * 100;
        element.style.width = `${percentage}%`;
    }
}

// Debounce Function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Format Number
function formatNumber(num) {
    return new Intl.NumberFormat().format(num);
}

// Format Date
function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(new Date(date));
}

// Copy to Clipboard
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showToast('Copied to clipboard!', 'success');
        return true;
    } catch (error) {
        console.error('Copy failed:', error);
        showToast('Failed to copy', 'error');
        return false;
    }
}

// Download as File
function downloadAsFile(content, filename, type = 'text/plain') {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Generate Unique ID
function generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Shuffle Array
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Mobile Menu Toggle
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    if (menu) {
        menu.classList.toggle('hidden');
    }
}

// Initialize on DOM Load
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    
    // Add animation classes to elements as they come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.glass-card').forEach(card => {
        observer.observe(card);
    });
});

// Handle window resize
window.addEventListener('resize', debounce(() => {
    // Handle responsive adjustments
    const isMobile = window.innerWidth < 768;
    document.body.classList.toggle('mobile', isMobile);
}, 250));

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        makeAPIRequest,
        showLoading,
        hideLoading,
        showToast,
        openModal,
        closeModal,
        Timer,
        saveToLocalStorage,
        loadFromLocalStorage,
        copyToClipboard,
        downloadAsFile,
        generateId,
        shuffleArray
    };
}
