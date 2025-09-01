// Dynamic Background Effects
class BackgroundEffects {
    constructor() {
        this.isMobile = window.innerWidth <= 768;
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.init();
    }

    init() {
        // Always create background effects, but reduce them if needed
        this.createDynamicParticles();
        this.addMouseInteraction();
        this.createPulsingElements();
        this.handleResize();
        this.forceBackgroundAnimations();
    }

    forceBackgroundAnimations() {
        // Force CSS background animations to start
        const bgGradient = document.querySelector('.bg-gradient');
        const gridOverlay = document.querySelector('.grid-overlay');
        const particles = document.querySelectorAll('.particle');
        const orbs = document.querySelectorAll('.orb');
        const circuitLines = document.querySelectorAll('.circuit-line');
        const matrixChars = document.querySelectorAll('.matrix-char');

        // Ensure all background elements are animating
        [bgGradient, gridOverlay, ...particles, ...orbs, ...circuitLines, ...matrixChars].forEach(element => {
            if (element) {
                element.style.animationPlayState = 'running';
            }
        });
    }

    handleResize() {
        window.addEventListener('resize', () => {
            const wasMobile = this.isMobile;
            this.isMobile = window.innerWidth <= 768;
            
            if (wasMobile !== this.isMobile) {
                this.adjustForDevice();
            }
        });
    }

    adjustForDevice() {
        if (this.isMobile) {
            // Reduce effects for mobile
            this.reduceEffects();
        } else {
            // Restore effects for desktop
            this.restoreEffects();
        }
    }

    reduceEffects() {
        // Limit particles on mobile
        const particles = document.querySelectorAll('.particle.dynamic');
        particles.forEach((particle, index) => {
            if (index > 3) {
                particle.remove();
            }
        });
        
        // Reduce orb opacity
        const orbs = document.querySelectorAll('.orb');
        orbs.forEach(orb => {
            orb.style.opacity = '0.2';
        });
    }

    restoreEffects() {
        // Restore orb opacity
        const orbs = document.querySelectorAll('.orb');
        orbs.forEach(orb => {
            orb.style.opacity = '';
        });
    }

    createDynamicParticles() {
        const particleContainer = document.querySelector('.floating-particles');
        const maxParticles = this.isMobile ? 8 : 15;
        const interval = this.isMobile ? 4000 : 2000;
        
        // Add more particles dynamically
        setInterval(() => {
            if (particleContainer.children.length < maxParticles) {
                const particle = document.createElement('div');
                particle.className = 'particle dynamic';
                
                // Random properties
                const size = Math.random() * 4 + 2;
                const startX = Math.random() * 100;
                const startY = Math.random() * 100;
                const duration = Math.random() * 8 + 6;
                
                particle.style.cssText = `
                    width: ${size}px;
                    height: ${size}px;
                    left: ${startX}%;
                    top: ${startY}%;
                    animation: float ${duration}s ease-in-out infinite;
                    animation-delay: ${Math.random() * 2}s;
                `;
                
                particleContainer.appendChild(particle);
                
                // Remove particle after animation
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }, duration * 1000);
            }
        }, interval);
    }

    addMouseInteraction() {
        if (this.isMobile) {
            // Add touch interaction for mobile
            this.addTouchInteraction();
            return;
        }

        let mouseX = 0;
        let mouseY = 0;
        let lastTrailTime = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX / window.innerWidth;
            mouseY = e.clientY / window.innerHeight;
            
            // Move orbs slightly based on mouse position
            const orbs = document.querySelectorAll('.orb');
            orbs.forEach((orb, index) => {
                const moveX = (mouseX - 0.5) * 20 * (index + 1);
                const moveY = (mouseY - 0.5) * 20 * (index + 1);
                orb.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
            
            // Throttle trail creation for performance
            const now = Date.now();
            if (now - lastTrailTime > 50) {
                this.createMouseTrail(e.clientX, e.clientY);
                lastTrailTime = now;
            }
        });
    }

    addTouchInteraction() {
        document.addEventListener('touchmove', (e) => {
            if (e.touches.length === 1) {
                const touch = e.touches[0];
                const touchX = touch.clientX / window.innerWidth;
                const touchY = touch.clientY / window.innerHeight;
                
                // Subtle orb movement on touch
                const orbs = document.querySelectorAll('.orb');
                orbs.forEach((orb, index) => {
                    const moveX = (touchX - 0.5) * 10 * (index + 1);
                    const moveY = (touchY - 0.5) * 10 * (index + 1);
                    orb.style.transform = `translate(${moveX}px, ${moveY}px)`;
                });
            }
        }, { passive: true });
    }

    createMouseTrail(x, y) {
        const trail = document.createElement('div');
        trail.className = 'mouse-trail';
        trail.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 4px;
            height: 4px;
            background: var(--cyber-blue);
            border-radius: 50%;
            pointer-events: none;
            z-index: 0;
            opacity: 0.6;
            animation: trailFade 1s ease-out forwards;
        `;
        
        document.body.appendChild(trail);
        
        setTimeout(() => {
            if (trail.parentNode) {
                trail.parentNode.removeChild(trail);
            }
        }, 1000);
    }

    createPulsingElements() {
        // Add pulsing effect to random positions
        setInterval(() => {
            const pulse = document.createElement('div');
            pulse.className = 'pulse-ring';
            
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            
            pulse.style.cssText = `
                position: absolute;
                left: ${x}%;
                top: ${y}%;
                width: 2px;
                height: 2px;
                border: 2px solid var(--cyber-blue);
                border-radius: 50%;
                animation: pulseRing 2s ease-out forwards;
                pointer-events: none;
            `;
            
            document.querySelector('.animated-bg').appendChild(pulse);
            
            setTimeout(() => {
                if (pulse.parentNode) {
                    pulse.parentNode.removeChild(pulse);
                }
            }, 2000);
        }, 3000);
    }
}

// Force all animations to start
function forceAllAnimations() {
    // Logo animations
    const spiralRings = document.querySelectorAll('.spiral-ring');
    spiralRings.forEach(ring => {
        ring.style.animationPlayState = 'running';
    });
    
    const appTitle = document.querySelector('.app-title');
    if (appTitle) {
        appTitle.style.animationPlayState = 'running';
    }
    
    // Background animations
    const animatedElements = [
        '.bg-gradient',
        '.grid-overlay', 
        '.particle',
        '.orb',
        '.circuit-line',
        '.matrix-char'
    ];
    
    animatedElements.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            element.style.animationPlayState = 'running';
            // Force reflow to restart animation
            element.style.animation = 'none';
            element.offsetHeight; // Trigger reflow
            element.style.animation = null;
        });
    });
}

// Initialize background effects when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BackgroundEffects();
    
    // Force all animations to start
    setTimeout(forceAllAnimations, 100);
    
    // Also force animations after a short delay to ensure everything is loaded
    setTimeout(forceAllAnimations, 1000);
});

// Add CSS for dynamic effects
const dynamicStyles = `
    @keyframes trailFade {
        0% {
            opacity: 0.6;
            transform: scale(1);
        }
        100% {
            opacity: 0;
            transform: scale(0);
        }
    }
    
    @keyframes pulseRing {
        0% {
            opacity: 1;
            transform: scale(0);
        }
        100% {
            opacity: 0;
            transform: scale(20);
        }
    }
    
    .particle.dynamic {
        box-shadow: 0 0 10px var(--cyber-blue);
    }
    
    .glass-card:hover::before {
        animation-duration: 1.5s;
    }
`;

// Inject dynamic styles
const styleSheet = document.createElement('style');
styleSheet.textContent = dynamicStyles;
document.head.appendChild(styleSheet);