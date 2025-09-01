class PasswordGeneratorApp {
    constructor() {
        this.currentPassword = '';
        this.currentSiteName = '';
        this.isMobile = this.detectMobile();
        this.isTouch = this.detectTouch();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateLengthDisplay();
        this.loadSavedPasswords();
        this.setupResponsiveFeatures();
        this.setupAccessibility();
    }

    detectMobile() {
        return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    detectTouch() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }

    setupResponsiveFeatures() {
        // Handle orientation changes
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleOrientationChange();
            }, 100);
        });

        // Handle window resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });

        // Optimize for mobile
        if (this.isMobile) {
            this.optimizeForMobile();
        }
    }

    setupAccessibility() {
        // Update slider aria attributes
        const slider = document.getElementById('password-length');
        slider.addEventListener('input', () => {
            slider.setAttribute('aria-valuenow', slider.value);
        });

        // Add keyboard navigation for custom elements
        document.querySelectorAll('.option-card').forEach(card => {
            card.setAttribute('tabindex', '0');
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    card.click();
                }
            });
        });
    }

    handleOrientationChange() {
        // Adjust layout for orientation changes
        const isLandscape = window.innerHeight < window.innerWidth;
        document.body.classList.toggle('landscape', isLandscape);
        
        // Scroll to top on orientation change
        window.scrollTo(0, 0);
    }

    handleResize() {
        const wasMobile = this.isMobile;
        this.isMobile = this.detectMobile();
        
        // Re-optimize if device type changed
        if (wasMobile !== this.isMobile) {
            if (this.isMobile) {
                this.optimizeForMobile();
            } else {
                this.optimizeForDesktop();
            }
        }
    }

    optimizeForMobile() {
        // Add mobile-specific optimizations
        document.body.classList.add('mobile-device');
        
        // Prevent zoom on input focus
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', this.preventZoom);
            input.addEventListener('blur', this.allowZoom);
        });

        // Add touch feedback
        this.addTouchFeedback();
    }

    optimizeForDesktop() {
        document.body.classList.remove('mobile-device');
        
        // Remove mobile-specific event listeners
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.removeEventListener('focus', this.preventZoom);
            input.removeEventListener('blur', this.allowZoom);
        });
    }

    preventZoom() {
        const viewport = document.querySelector('meta[name=viewport]');
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }

    allowZoom() {
        const viewport = document.querySelector('meta[name=viewport]');
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes');
    }

    addTouchFeedback() {
        // Add haptic feedback for supported devices
        const buttons = document.querySelectorAll('.cyber-button, .icon-button, .tab-button');
        buttons.forEach(button => {
            button.addEventListener('touchstart', () => {
                if (navigator.vibrate) {
                    navigator.vibrate(10); // Short vibration
                }
                button.classList.add('touch-active');
            });
            
            button.addEventListener('touchend', () => {
                setTimeout(() => {
                    button.classList.remove('touch-active');
                }, 150);
            });
        });
    }

    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Password length slider
        const lengthSlider = document.getElementById('password-length');
        lengthSlider.addEventListener('input', () => this.updateLengthDisplay());

        // Form submission
        document.getElementById('password-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.generatePassword();
        });

        // Copy button
        document.getElementById('copy-btn').addEventListener('click', () => this.copyPassword());

        // Save button
        document.getElementById('save-btn').addEventListener('click', () => this.savePassword());
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        document.getElementById(`${tabName}-tab`).classList.add('active');

        // Load saved passwords when switching to saved tab
        if (tabName === 'saved') {
            this.loadSavedPasswords();
        }
    }

    updateLengthDisplay() {
        const slider = document.getElementById('password-length');
        const display = document.getElementById('length-value');
        display.textContent = slider.value;

        // Update slider background gradient
        const percentage = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
        slider.style.background = `linear-gradient(to right, #00d4ff 0%, #00d4ff ${percentage}%, #374151 ${percentage}%, #374151 100%)`;
    }

    async generatePassword() {
        const length = parseInt(document.getElementById('password-length').value);
        const options = {
            uppercase: document.getElementById('uppercase').checked,
            lowercase: document.getElementById('lowercase').checked,
            numbers: document.getElementById('numbers').checked,
            special: document.getElementById('special').checked
        };

        // Check if at least one option is selected
        if (!Object.values(options).some(Boolean)) {
            this.showToast('Please select at least one character type', 'error');
            return;
        }

        try {
            const response = await fetch('/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ length, options })
            });

            const data = await response.json();

            if (data.success) {
                this.currentPassword = data.password;
                this.currentSiteName = document.getElementById('site-name').value;
                this.displayPassword(data.password);
            } else {
                this.showToast(data.error || 'Failed to generate password', 'error');
            }
        } catch (error) {
            console.error('Error generating password:', error);
            this.showToast('Failed to generate password', 'error');
        }
    }

    displayPassword(password) {
        document.getElementById('generated-password').textContent = password;
        document.getElementById('password-result').classList.remove('hidden');
        
        // Show save button if site name is provided
        if (this.currentSiteName.trim()) {
            const saveBtn = document.getElementById('save-btn');
            saveBtn.classList.remove('hidden');
            saveBtn.innerHTML = `<i class="fas fa-save"></i> Save Password for ${this.currentSiteName}`;
        }

        // Add animation effect
        const resultDiv = document.getElementById('password-result');
        resultDiv.style.animation = 'none';
        setTimeout(() => {
            resultDiv.style.animation = 'fadeInUp 0.5s ease-out';
        }, 10);
    }

    async copyPassword() {
        if (!this.currentPassword) return;

        try {
            await navigator.clipboard.writeText(this.currentPassword);
            
            // Update copy button icon temporarily
            const copyBtn = document.getElementById('copy-btn');
            const originalIcon = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i>';
            
            setTimeout(() => {
                copyBtn.innerHTML = originalIcon;
            }, 2000);

            this.showToast('Password copied to clipboard!');
        } catch (error) {
            console.error('Failed to copy password:', error);
            this.showToast('Failed to copy password', 'error');
        }
    }

    async savePassword() {
        if (!this.currentPassword || !this.currentSiteName.trim()) {
            this.showToast('Please enter a site name and generate a password', 'error');
            return;
        }

        try {
            const response = await fetch('/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    siteName: this.currentSiteName,
                    password: this.currentPassword
                })
            });

            const data = await response.json();

            if (data.success) {
                this.showToast(`Password saved for ${this.currentSiteName}!`);
                
                // Reset form
                document.getElementById('site-name').value = '';
                document.getElementById('password-result').classList.add('hidden');
                document.getElementById('save-btn').classList.add('hidden');
                this.currentPassword = '';
                this.currentSiteName = '';
            } else {
                this.showToast(data.error || 'Failed to save password', 'error');
            }
        } catch (error) {
            console.error('Error saving password:', error);
            this.showToast('Failed to save password', 'error');
        }
    }

    async loadSavedPasswords() {
        try {
            const response = await fetch('/saved');
            const data = await response.json();

            this.displaySavedPasswords(data.passwords);
        } catch (error) {
            console.error('Error loading saved passwords:', error);
        }
    }

    displaySavedPasswords(passwords) {
        const container = document.getElementById('saved-passwords-list');
        const emptyState = document.getElementById('empty-state');
        const countElement = document.getElementById('password-count');

        // Update count
        const count = passwords.length;
        countElement.textContent = `${count} password${count !== 1 ? 's' : ''} saved`;

        if (passwords.length === 0) {
            container.innerHTML = '';
            emptyState.style.display = 'block';
            return;
        }

        emptyState.style.display = 'none';
        
        container.innerHTML = passwords.map((item, index) => `
            <div class="password-item" style="animation-delay: ${index * 0.1}s">
                <div class="password-item-header">
                    <div class="password-item-info">
                        <h3>${this.escapeHtml(item.siteName)}</h3>
                        <div class="password-item-date">
                            Created: ${this.formatDate(item.createdAt)}
                        </div>
                    </div>
                    <div class="password-item-actions">
                        <button class="icon-button delete-btn" onclick="app.deletePassword(${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="password-item-display">
                    <code class="password-text" id="password-${item.id}">
                        ${'•'.repeat(item.password.length)}
                    </code>
                    <button class="icon-button" onclick="app.togglePasswordVisibility(${item.id}, '${this.escapeHtml(item.password)}')">
                        <i class="fas fa-eye" id="eye-${item.id}"></i>
                    </button>
                    <button class="icon-button copy-btn" onclick="app.copyPasswordById('${this.escapeHtml(item.password)}', ${item.id})">
                        <i class="fas fa-copy" id="copy-icon-${item.id}"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    togglePasswordVisibility(id, password) {
        const passwordElement = document.getElementById(`password-${id}`);
        const eyeIcon = document.getElementById(`eye-${id}`);
        
        if (passwordElement.textContent.includes('•')) {
            passwordElement.textContent = password;
            eyeIcon.className = 'fas fa-eye-slash';
        } else {
            passwordElement.textContent = '•'.repeat(password.length);
            eyeIcon.className = 'fas fa-eye';
        }
    }

    async copyPasswordById(password, id) {
        try {
            await navigator.clipboard.writeText(password);
            
            // Update copy button icon temporarily
            const copyIcon = document.getElementById(`copy-icon-${id}`);
            const originalClass = copyIcon.className;
            copyIcon.className = 'fas fa-check';
            
            setTimeout(() => {
                copyIcon.className = originalClass;
            }, 2000);

            this.showToast('Password copied to clipboard!');
        } catch (error) {
            console.error('Failed to copy password:', error);
            this.showToast('Failed to copy password', 'error');
        }
    }

    async deletePassword(id) {
        if (!confirm('Are you sure you want to delete this password?')) {
            return;
        }

        try {
            const response = await fetch(`/delete/${id}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (data.success) {
                this.showToast('Password deleted successfully');
                this.loadSavedPasswords();
            } else {
                this.showToast(data.error || 'Failed to delete password', 'error');
            }
        } catch (error) {
            console.error('Error deleting password:', error);
            this.showToast('Failed to delete password', 'error');
        }
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const messageElement = document.getElementById('toast-message');
        
        messageElement.textContent = message;
        toast.className = `toast ${type === 'error' ? 'error' : ''}`;
        toast.classList.remove('hidden');

        // Announce to screen readers
        toast.setAttribute('aria-live', 'polite');
        toast.setAttribute('role', 'status');

        // Auto hide after 3 seconds (longer on mobile)
        const hideDelay = this.isMobile ? 4000 : 3000;
        setTimeout(() => {
            toast.classList.add('hidden');
        }, hideDelay);

        // Add haptic feedback on mobile
        if (this.isMobile && navigator.vibrate) {
            navigator.vibrate(type === 'error' ? [100, 50, 100] : 50);
        }
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new PasswordGeneratorApp();
});