// ============================================
// BREAK THE CHAINS™ PORTFOLIO SITE SCRIPTS
// ============================================

// Dark Mode Functionality
const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;

// Check for saved dark mode preference or default to light mode
const currentMode = localStorage.getItem('darkMode');
if (currentMode === 'enabled') {
    body.classList.add('dark-mode');
}

// Toggle dark mode
darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    // Save preference to localStorage
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
    } else {
        localStorage.setItem('darkMode', 'disabled');
    }
});

// Back to Top Button Functionality
const backToTopButton = document.getElementById('backToTop');

// Show/hide button based on scroll position
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopButton.classList.add('visible');
    } else {
        backToTopButton.classList.remove('visible');
    }
});

// Scroll to top when button is clicked
backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed header if needed
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for Fade-in Animations (Optional Enhancement)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards for fade-in effect (optional - can be removed if not desired)
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.app-card, .book-card, .contact-card');
    
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});

// External Link Tracking (Optional - for analytics)
document.querySelectorAll('a[target="_blank"]').forEach(link => {
    link.addEventListener('click', function() {
        // You can add analytics tracking here if needed
        console.log('External link clicked:', this.href);
    });
});

// Keyboard Navigation Enhancement
document.addEventListener('keydown', (e) => {
    // Escape key to close any modals (if added in future)
    if (e.key === 'Escape') {
        // Modal close functionality here if needed
    }
    
    // Home key to scroll to top
    if (e.key === 'Home' && e.ctrlKey) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // End key to scroll to bottom
    if (e.key === 'End' && e.ctrlKey) {
        e.preventDefault();
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
});

// Prevent Layout Shift - Add min-height to images when they load
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });
        }
    });
});

// Console Welcome Message (Easter Egg for Developers)
console.log('%c👋 Hello, Developer! ', 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 10px 20px; font-size: 16px; font-weight: bold;');
console.log('%cWelcome to Claude Weidner\'s Portfolio', 'font-size: 14px; color: #667eea;');
console.log('%cBreak The Chains™ - Built with ❤️ for chronic illness warriors', 'font-size: 12px; color: #764ba2;');
console.log('%c🥄 Spoon Theory by Christine Miserandino', 'font-size: 12px; color: #FFD700;');
console.log('%cInterested in the code? Check out my apps:', 'font-size: 12px;');
console.log('- SpoonSync™: https://breakthechains.life');
console.log('- MedTracker: https://medtracker.claudeweidner.com');
console.log('- SecureVault: https://vault.claudeweidner.com');

// Service Worker Registration (for PWA - optional future enhancement)
if ('serviceWorker' in navigator) {
    // Commented out until service worker is created
    // navigator.serviceWorker.register('/sw.js')
    //     .then(registration => console.log('Service Worker registered'))
    //     .catch(error => console.log('Service Worker registration failed:', error));
}

// Page Load Performance Monitoring (Optional)
window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log(`%cPage loaded in ${Math.round(loadTime)}ms`, 'color: #10b981; font-weight: bold;');
});

// Add active class to navigation links based on scroll position (if top nav is added)
function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveNav);

// Email Protection (Optional - obfuscate email from bots)
// This can be removed if you prefer direct mailto links
document.addEventListener('DOMContentLoaded', () => {
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    emailLinks.forEach(link => {
        // Email already visible, but you could add click tracking here
        link.addEventListener('click', () => {
            console.log('Email link clicked');
        });
    });
});

// Mobile Menu Toggle (if hamburger menu is added in future)
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mobileMenu = document.getElementById('mobileMenu');

if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
    });
    
    // Close menu when link is clicked
    document.querySelectorAll('#mobileMenu a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            mobileMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        }
    });
}

// Form Validation (if contact form is added in future)
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('error');
        } else {
            input.classList.remove('error');
        }
    });
    
    return isValid;
}

// Lazy Loading Images (if images are added)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Accessibility: Skip to Main Content
document.addEventListener('DOMContentLoaded', () => {
    // Add skip link if not present
    const skipLink = document.createElement('a');
    skipLink.href = '#apps';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 0;
        background: #667eea;
        color: white;
        padding: 8px;
        text-decoration: none;
        z-index: 9999;
    `;
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '0';
    });
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    document.body.insertBefore(skipLink, document.body.firstChild);
});

// Easter Egg: Konami Code
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join('') === konamiSequence.join('')) {
        // Easter egg activated!
        alert('🥄 You found the secret spoon! You have unlimited energy today! 🎉\n\n(Just kidding... if only it were that easy. But here\'s a virtual high-five from Claude! 👋)');
        console.log('%c🥄 SPOON MODE ACTIVATED! 🥄', 'background: gold; color: purple; padding: 20px; font-size: 20px; font-weight: bold;');
        konamiCode = [];
    }
});

console.log('%cPsst... try the Konami Code! ↑↑↓↓←→←→BA', 'color: #FFD700; font-size: 10px;');
