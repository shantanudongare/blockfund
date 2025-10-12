// Utility functions for the application

function formatDate(timestamp) {
    return new Date(timestamp * 1000).toLocaleString();
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Form validation
function validateForm(formId) {
    const form = document.getElementById(formId);
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    
    for (let input of inputs) {
        if (!input.value.trim()) {
            alert(`Please fill in ${input.id}`);
            return false;
        }
    }
    return true;
}

// Enhanced notification system with icons
function showNotification(message, type = 'info') {
    const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️',
        warning: '⚠️'
    };
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span style="font-size: 20px; margin-right: 10px;">${icons[type]}</span>
        <span>${message}</span>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Confetti effect for successful donations
function triggerConfetti() {
    const colors = ['#ff6b6b', '#4CAF50', '#2196F3', '#FFD700', '#ff9ff3'];
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 2 + 's';
            document.body.appendChild(confetti);
            setTimeout(() => confetti.remove(), 3000);
        }, i * 30);
    }
}

// Progress counter animation
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = Math.round(target);
            clearInterval(timer);
        } else {
            element.textContent = Math.round(start);
        }
    }, 16);
}

// Interactive tooltip helper
function addTooltip(element, text) {
    const tooltip = document.createElement('span');
    tooltip.className = 'tooltiptext';
    tooltip.textContent = text;
    element.classList.add('tooltip');
    element.appendChild(tooltip);
}

// Loading spinner
function showLoading() {
    const spinner = document.createElement('div');
    spinner.className = 'spinner';
    spinner.id = 'loading-spinner';
    document.body.appendChild(spinner);
}

function hideLoading() {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) spinner.remove();
}

// Interactive blockchain visualizer
function createBlockchainAnimation(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.style.position = 'relative';
    
    const blocks = container.querySelectorAll('.block-card');
    blocks.forEach((block, index) => {
        block.style.opacity = '0';
        block.style.transform = 'translateX(-50px)';
        
        setTimeout(() => {
            block.style.transition = 'all 0.5s ease-out';
            block.style.opacity = '1';
            block.style.transform = 'translateX(0)';
        }, index * 200);
    });
}

// Real-time progress updater
function updateProgress(elementId, current, target) {
    const progressBar = document.getElementById(elementId);
    if (!progressBar) return;
    
    const percentage = Math.min((current / target) * 100, 100);
    progressBar.style.setProperty('--progress-width', percentage + '%');
    progressBar.style.width = percentage + '%';
    
    // Add text overlay
    if (percentage > 10) {
        progressBar.innerHTML = `<span style="position: absolute; left: 50%; transform: translateX(-50%); color: white; font-weight: bold; font-size: 12px;">${Math.round(percentage)}%</span>`;
    }
}

// Copy to clipboard with feedback
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Copied to clipboard!', 'success');
    });
}

// Format numbers with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Calculate time remaining
function getTimeRemaining(deadline) {
    const now = new Date();
    const end = new Date(deadline);
    const diff = end - now;
    
    if (diff <= 0) return 'Campaign ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} days remaining`;
    return `${hours} hours remaining`;
}


// Number formatting
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}
// Enhanced Theme Management
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 BlockFund Platform Enhanced');
    initializeTheme();
    initializeAnimations();
    addThemeToggle();
});

function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

function addThemeToggle() {
    // Add theme toggle button to navbar if it doesn't exist
    const navbar = document.querySelector('.navbar .nav-links');
    if (navbar && !document.getElementById('theme-toggle')) {
        const themeToggle = document.createElement('button');
        themeToggle.id = 'theme-toggle';
        themeToggle.className = 'btn btn-small';
        themeToggle.innerHTML = '🌙 Theme';
        themeToggle.onclick = toggleTheme;
        navbar.insertBefore(themeToggle, navbar.firstChild);
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.innerHTML = newTheme === 'dark' ? '🌙 Theme' : '☀️ Theme';
    }
    
    showNotification(`Switched to ${newTheme} theme`, 'info');
}

// Enhanced Animation System
function initializeAnimations() {
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            }
        });
    }, observerOptions);
    
    // Observe campaign cards and feature cards
    document.querySelectorAll('.campaign-card, .feature-card, .block-card').forEach(card => {
        observer.observe(card);
    });
    
    // Initialize progress bars with animation
    document.querySelectorAll('.progress-bar').forEach(progressBar => {
        const progressFill = progressBar.querySelector('.progress-fill');
        if (progressFill) {
            const width = progressFill.style.width;
            progressFill.style.width = '0%';
            setTimeout(() => {
                progressFill.style.transition = 'width 1.5s ease-out';
                progressFill.style.width = width;
            }, 500);
        }
    });
}

// Enhanced Wallet Features
function updateWalletDisplay(balance, element) {
    if (!element) return;
    
    const currentBalance = parseFloat(element.textContent.replace(/[^\d.]/g, '')) || 0;
    const difference = balance - currentBalance;
    
    // Animate balance change
    animateCounter(element, balance);
    
    // Show change indicator
    if (difference !== 0) {
        const indicator = document.createElement('span');
        indicator.textContent = difference > 0 ? ` (+${difference})` : ` (${difference})`;
        indicator.style.color = difference > 0 ? '#10b981' : '#ef4444';
        indicator.style.fontSize = '0.8em';
        indicator.style.opacity = '0';
        indicator.style.transition = 'opacity 0.3s ease';
        
        element.appendChild(indicator);
        setTimeout(() => indicator.style.opacity = '1', 100);
        setTimeout(() => indicator.remove(), 3000);
    }
}

// Campaign Status Badges
function addCampaignBadges() {
    document.querySelectorAll('.campaign-card').forEach(card => {
        const progressBar = card.querySelector('.progress-fill');
        if (progressBar) {
            const width = parseFloat(progressBar.style.width) || 0;
            const badgeContainer = card.querySelector('.campaign-header') || card;
            
            // Remove existing badges
            badgeContainer.querySelectorAll('.badge').forEach(badge => badge.remove());
            
            // Add appropriate badges
            if (width >= 100) {
                addBadge(badgeContainer, 'Funded', 'badge-verified');
            } else if (width >= 80) {
                addBadge(badgeContainer, 'Almost There!', 'badge-almost-funded');
            } else if (isNewCampaign(card)) {
                addBadge(badgeContainer, 'New', 'badge-new');
            }
            
            if (isTrendingCampaign(card)) {
                addBadge(badgeContainer, 'Trending', 'badge-trending');
            }
        }
    });
}

function addBadge(container, text, className) {
    const badge = document.createElement('span');
    badge.className = `badge ${className}`;
    badge.textContent = text;
    container.appendChild(badge);
}

function isNewCampaign(card) {
    // Check if campaign was created in the last 7 days
    const createdDate = card.dataset.created;
    if (!createdDate) return false;
    
    const now = new Date();
    const created = new Date(createdDate);
    const daysDiff = (now - created) / (1000 * 60 * 60 * 24);
    
    return daysDiff <= 7;
}

function isTrendingCampaign(card) {
    // Simple trending logic - campaigns with high donation velocity
    const donationCount = card.dataset.donations || 0;
    return donationCount > 10;
}

// Enhanced Form Handling
function enhanceFormValidation() {
    document.querySelectorAll('form').forEach(form => {
        const inputs = form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateInput(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateInput(this);
                }
            });
        });
    });
}

function validateInput(input) {
    const value = input.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (input.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Email validation
    if (input.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // Number validation
    if (input.type === 'number' && value) {
        const num = parseFloat(value);
        const min = parseFloat(input.min);
        const max = parseFloat(input.max);
        
        if (isNaN(num)) {
            isValid = false;
            errorMessage = 'Please enter a valid number';
        } else if (min !== undefined && num < min) {
            isValid = false;
            errorMessage = `Value must be at least ${min}`;
        } else if (max !== undefined && num > max) {
            isValid = false;
            errorMessage = `Value must be no more than ${max}`;
        }
    }
    
    // Update UI
    if (isValid) {
        input.classList.remove('error');
        removeErrorMessage(input);
    } else {
        input.classList.add('error');
        showErrorMessage(input, errorMessage);
    }
    
    return isValid;
}

function showErrorMessage(input, message) {
    removeErrorMessage(input);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: var(--error-color);
        font-size: 0.875rem;
        margin-top: 0.25rem;
    `;
    
    input.parentNode.appendChild(errorDiv);
}

function removeErrorMessage(input) {
    const errorMessage = input.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// Real-time Updates
function startRealTimeUpdates() {
    // Update campaign progress every 30 seconds
    setInterval(updateCampaignProgress, 30000);
    
    // Update blockchain info every 60 seconds
    setInterval(updateBlockchainInfo, 60000);
}

function updateCampaignProgress() {
    // This would typically fetch from an API
    document.querySelectorAll('.campaign-card').forEach(card => {
        const progressBar = card.querySelector('.progress-fill');
        if (progressBar) {
            // Simulate small progress updates
            const currentWidth = parseFloat(progressBar.style.width) || 0;
            const newWidth = Math.min(currentWidth + Math.random() * 2, 100);
            progressBar.style.width = newWidth + '%';
        }
    });
}

function updateBlockchainInfo() {
    // Update blockchain statistics
    const chainLength = document.querySelector('[data-chain-length]');
    if (chainLength) {
        const current = parseInt(chainLength.textContent) || 0;
        chainLength.textContent = current + Math.floor(Math.random() * 3);
    }
}

// Search and Filter Functionality
function addSearchFilter() {
    const campaignGrid = document.querySelector('.campaign-grid');
    if (!campaignGrid) return;
    
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.style.cssText = `
        margin-bottom: 2rem;
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
        align-items: center;
    `;
    
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search campaigns...';
    searchInput.className = 'search-input';
    searchInput.style.cssText = `
        flex: 1;
        min-width: 250px;
        padding: 12px 16px;
        border: 1px solid var(--border-color);
        border-radius: 12px;
        background: var(--bg-secondary);
        color: var(--text-primary);
    `;
    
    const filterSelect = document.createElement('select');
    filterSelect.className = 'filter-select';
    filterSelect.style.cssText = searchInput.style.cssText;
    filterSelect.innerHTML = `
        <option value="">All Categories</option>
        <option value="technology">Technology</option>
        <option value="art">Art & Creative</option>
        <option value="social">Social Impact</option>
        <option value="business">Business</option>
    `;
    
    searchContainer.appendChild(searchInput);
    searchContainer.appendChild(filterSelect);
    campaignGrid.parentNode.insertBefore(searchContainer, campaignGrid);
    
    // Add event listeners
    searchInput.addEventListener('input', filterCampaigns);
    filterSelect.addEventListener('change', filterCampaigns);
}

function filterCampaigns() {
    const searchTerm = document.querySelector('.search-input')?.value.toLowerCase() || '';
    const category = document.querySelector('.filter-select')?.value || '';
    
    document.querySelectorAll('.campaign-card').forEach(card => {
        const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
        const description = card.querySelector('p')?.textContent.toLowerCase() || '';
        const cardCategory = card.dataset.category || '';
        
        const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);
        const matchesCategory = !category || cardCategory === category;
        
        if (matchesSearch && matchesCategory) {
            card.style.display = 'block';
            card.style.animation = 'fadeInUp 0.3s ease';
        } else {
            card.style.display = 'none';
        }
    });
}

// Initialize enhanced features
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        addCampaignBadges();
        enhanceFormValidation();
        addSearchFilter();
        startRealTimeUpdates();
    }, 1000);
});

// Add CSS animations
const enhancedStyles = document.createElement('style');
enhancedStyles.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .error {
        border-color: var(--error-color) !important;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
    }
    
    .search-container {
        animation: fadeInUp 0.6s ease;
    }
`;
document.head.appendChild(enhancedStyles);