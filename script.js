// Page Loading
window.addEventListener('load', function() {
    const pageLoader = document.getElementById('pageLoader');
    setTimeout(() => {
        pageLoader.classList.add('hidden');
        setTimeout(() => {
            pageLoader.style.display = 'none';
        }, 500);
    }, 1000);
});

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.getElementById('header');
    const scrollTop = document.getElementById('scrollTopBtn');
    
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
        scrollTop.classList.add('visible');
    } else {
        header.classList.remove('scrolled');
        scrollTop.classList.remove('visible');
    }
});

// Mobile Menu Toggle
function toggleMenu() {
    const navMenu = document.getElementById('navMenu');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const icon = mobileMenuBtn.querySelector('i');
    
    navMenu.classList.toggle('active');
    
    if (navMenu.classList.contains('active')) {
        icon.className = 'fas fa-times';
        document.body.style.overflow = 'hidden';
    } else {
        icon.className = 'fas fa-bars';
        document.body.style.overflow = '';
    }
}

// Close menu when clicking on a link
function closeMenu() {
    const navMenu = document.getElementById('navMenu');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const icon = mobileMenuBtn.querySelector('i');
    
    navMenu.classList.remove('active');
    icon.className = 'fas fa-bars';
    document.body.style.overflow = '';
}

// Scroll to top function
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.offsetTop;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Contact Form Handler
document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const form = this;
    const submitBtn = document.getElementById('submitBtn');
    const formMessage = document.getElementById('formMessage');
    
    // Get form data
    const formData = new FormData(form);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message')
    };
    
    // Validate form
    if (!validateForm(data)) {
        showMessage('Please fill in all required fields correctly.', 'error');
        return;
    }
    
    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.querySelector('span').textContent = 'Sending...';
    formMessage.style.display = 'none';
    
    try {
        // Option 1: Using Formspree (Replace YOUR_FORM_ID with actual form ID)
        const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            showMessage('Thank you! Your message has been sent successfully. I\'ll get back to you soon.', 'success');
            form.reset();
            
            // Track form submission (if you have analytics)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submit', {
                    event_category: 'contact',
                    event_label: 'contact_form'
                });
            }
        } else {
            throw new Error('Failed to send message');
        }
        
    } catch (error) {
        console.error('Error:', error);
        
        // Fallback: Create mailto link
        const subject = encodeURIComponent(data.subject);
        const body = encodeURIComponent(`Name: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`);
        const mailtoLink = `mailto:amit.jamwal005@gmail.com?subject=${subject}&body=${body}`;
        
        // Try to open email client
        if (window.confirm('Unable to send message directly. Would you like to open your email client instead?')) {
            window.location.href = mailtoLink;
            showMessage('Email client opened. Please send the message from there.', 'success');
            form.reset();
        } else {
            showMessage('Message could not be sent. Please try again or contact directly via email/WhatsApp.', 'error');
        }
    }
    
    // Reset button state
    submitBtn.classList.remove('loading');
    submitBtn.querySelector('span').textContent = 'Send Message';
});

// Form validation function
function validateForm(data) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!data.name || data.name.trim().length < 2) return false;
    if (!data.email || !emailRegex.test(data.email)) return false;
    if (!data.subject || data.subject.trim().length < 3) return false;
    if (!data.message || data.message.trim().length < 10) return false;
    
    return true;
}

// Show form message function
function showMessage(message, type) {
    const formMessage = document.getElementById('formMessage');
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    formMessage.style.display = 'block';
    
    // Hide message after some time
    setTimeout(() => {
        formMessage.style.display = 'none';
    }, type === 'success' ? 5000 : 8000);
}

// Form field validation on blur
document.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('blur', function() {
        validateField(this);
    });
    
    input.addEventListener('input', function() {
        if (this.classList.contains('error')) {
            validateField(this);
        }
    });
});

// Individual field validation
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    
    if (field.hasAttribute('required') && !value) {
        isValid = false;
    } else if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = emailRegex.test(value);
    } else if (field.name === 'name' && value && value.length < 2) {
        isValid = false;
    } else if (field.name === 'subject' && value && value.length < 3) {
        isValid = false;
    } else if (field.name === 'message' && value && value.length < 10) {
        isValid = false;
    }
    
    if (isValid) {
        field.style.borderColor = 'rgba(255, 255, 255, 0.3)';
        field.classList.remove('error');
    } else {
        field.style.borderColor = '#ef4444';
        field.classList.add('error');
    }
    
    return isValid;
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animateElements = document.querySelectorAll('.skill-card, .portfolio-card, .service-card');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Typing animation for hero text (optional enhancement)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing animation (uncomment if desired)
// document.addEventListener('DOMContentLoaded', function() {
//     const heroTitle = document.querySelector('.hero-content h1');
//     const originalText = heroTitle.textContent;
//     typeWriter(heroTitle, originalText, 80);
// });

// Skills animation on scroll
function animateSkillBars() {
    const skillCards = document.querySelectorAll('.skill-card');
    
    skillCards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible) {
            card.style.animationDelay = Math.random() * 0.5 + 's';
            card.classList.add('animate-in');
        }
    });
}

// Throttle function for performance
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Add scroll listener with throttling
window.addEventListener('scroll', throttle(animateSkillBars, 100));

// Close mobile menu when clicking outside
document.addEventListener('click', function(e) {
    const navMenu = document.getElementById('navMenu');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    
    if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        if (navMenu.classList.contains('active')) {
            closeMenu();
        }
    }
});

// Handle escape key to close mobile menu
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const navMenu = document.getElementById('navMenu');
        if (navMenu.classList.contains('active')) {
            closeMenu();
        }
    }
});

// Add focus management for accessibility
document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        const focusableElements = document.querySelectorAll(
            'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    }
});

// Preload images
function preloadImages() {
    const images = [
        'assets/profileImage.png'
        // Add more image paths as needed
    ];
    
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    preloadImages();
    
    // Add smooth transitions to all cards
    const cards = document.querySelectorAll('.skill-card, .portfolio-card, .service-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Alternative form submission methods (EmailJS example)
/*
// If you want to use EmailJS instead of Formspree:
// 1. Include EmailJS script in your HTML:
// <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>

// 2. Replace the form submission code with:
async function sendEmailJS(data) {
    try {
        const result = await emailjs.send(
            'YOUR_SERVICE_ID',      // Replace with your EmailJS service ID
            'YOUR_TEMPLATE_ID',     // Replace with your EmailJS template ID
            {
                from_name: data.name,
                from_email: data.email,
                subject: data.subject,
                message: data.message
            }
        );
        
        showMessage('Message sent successfully!', 'success');
        return true;
    } catch (error) {
        console.error('EmailJS error:', error);
        return false;
    }
}

// Initialize EmailJS (add this to your DOMContentLoaded event)
emailjs.init('YOUR_PUBLIC_KEY'); // Replace with your EmailJS public key
*/

// Performance optimization: Lazy loading for images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

console.log('🚀 Portfolio website loaded successfully!');
console.log('👨‍💻 Developed by Amit Jamwal');
console.log('📧 Contact: amit.jamwal005@gmail.com');