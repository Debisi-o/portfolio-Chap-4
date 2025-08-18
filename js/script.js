

document.addEventListener('DOMContentLoaded', function () {

    // Theme Management
    const themeToggle = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;

    // Initialize theme
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    htmlElement.setAttribute('data-bs-theme', savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            const currentTheme = htmlElement.getAttribute('data-bs-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            htmlElement.setAttribute('data-bs-theme', newTheme);
            localStorage.setItem('portfolio-theme', newTheme);

            // Add ripple effect
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    }

    // Mobile Navigation Toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function () {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });

        // Close menu when clicking on links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }

    // Smooth Scrolling with Offset
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));

            if (target) {
                const offsetTop = target.offsetTop - 100;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Enhanced Scroll Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';

                // Special animations for different elements
                if (entry.target.classList.contains('skill-card')) {
                    entry.target.style.animationDelay = `${Math.random() * 0.3}s`;
                    entry.target.classList.add('animate-skill');
                }

                if (entry.target.classList.contains('work-item')) {
                    entry.target.style.animationDelay = `${Math.random() * 0.5}s`;
                    entry.target.classList.add('animate-work');
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.skill-card, .work-item, .about-stats, .contact-method').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        animateOnScroll.observe(el);
    });

    // Work Filtering System
    const filterButtons = document.querySelectorAll('.filter-btn');
    const workItems = document.querySelectorAll('.work-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            const filter = this.getAttribute('data-filter');

            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Filter work items with stagger animation
            workItems.forEach((item, index) => {
                const category = item.getAttribute('data-category');
                const shouldShow = filter === 'all' || category === filter;

                setTimeout(() => {
                    if (shouldShow) {
                        item.style.display = 'block';
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8)';

                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                }, index * 100);
            });
        });
    });

    // Enhanced Form Handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        // Input focus effects
        const formInputs = contactForm.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
            input.addEventListener('focus', function () {
                this.parentElement.classList.add('focused');
            });

            input.addEventListener('blur', function () {
                if (!this.value) {
                    this.parentElement.classList.remove('focused');
                }
            });

            // Check if input has value on load
            if (input.value) {
                input.parentElement.classList.add('focused');
            }
        });

        // Form submission
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;

            // Validate form
            const formData = new FormData(this);
            const isValid = validateForm(formData);

            if (isValid) {
                // Animate submit button
                submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
                submitBtn.disabled = true;

                // Simulate API call
                setTimeout(() => {
                    submitBtn.innerHTML = '<span>Message Sent!</span><i class="fas fa-check"></i>';
                    submitBtn.style.background = 'linear-gradient(135deg, #00ff88, #00cc66)';

                    // Reset form after delay
                    setTimeout(() => {
                        this.reset();
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                        submitBtn.style.background = '';

                        // Remove focused classes
                        formInputs.forEach(input => {
                            input.parentElement.classList.remove('focused');
                        });
                    }, 2000);
                }, 2000);
            }
        });
    }

    // Form validation helper
    function validateForm(formData) {
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!name || !email || !subject || !message) {
            showNotification('Please fill in all fields', 'error');
            return false;
        }

        if (!emailRegex.test(email)) {
            showNotification('Please enter a valid email address', 'error');
            return false;
        }

        return true;
    }

    // Notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'error' ? '#ff0088' : '#00ff88'};
            color: #0a0a0a;
            padding: 16px 24px;
            border-radius: 50px;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Navbar scroll effect
    let lastScrollY = window.scrollY;
    const navbar = document.querySelector('.lokkee-nav');

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        if (navbar) {
            const isMobile = window.innerWidth <= 768;

            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                // Scrolling down
                if (isMobile) {
                    navbar.style.transform = 'translateY(-100px)';
                } else {
                    navbar.style.transform = 'translateX(-50%) translateY(-100px)';
                }
                navbar.style.opacity = '0.8';
            } else {
                // Scrolling up
                if (isMobile) {
                    navbar.style.transform = 'translateY(0)';
                } else {
                    navbar.style.transform = 'translateX(-50%) translateY(0)';
                }
                navbar.style.opacity = '1';
            }

            // Add background blur when scrolled
            if (currentScrollY > 50) {
                navbar.style.backdropFilter = 'blur(20px)';
                navbar.style.background = htmlElement.getAttribute('data-bs-theme') === 'dark'
                    ? 'rgba(17, 17, 17, 0.9)'
                    : 'rgba(248, 249, 250, 0.9)';
            } else {
                navbar.style.backdropFilter = 'blur(10px)';
                navbar.style.background = htmlElement.getAttribute('data-bs-theme') === 'dark'
                    ? 'rgba(17, 17, 17, 0.8)'
                    : 'rgba(248, 249, 250, 0.8)';
            }
        }

        lastScrollY = currentScrollY;
    });

    // Parallax effect for floating elements
    const floatingElements = document.querySelectorAll('.element');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;

        floatingElements.forEach((element, index) => {
            const rate = scrolled * -0.5 * (index + 1);
            element.style.transform = `translateY(${rate}px) rotate(${scrolled * 0.1}deg)`;
        });
    });

    // Cursor trail effect (optional)
    if (window.innerWidth > 768) {
        let mouseX = 0;
        let mouseY = 0;
        let isMoving = false;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            isMoving = true;

            clearTimeout(window.mouseTimer);
            window.mouseTimer = setTimeout(() => {
                isMoving = false;
            }, 100);
        });

        // Create cursor follower
        const cursorFollower = document.createElement('div');
        cursorFollower.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: radial-gradient(circle, #00ff88, transparent);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.3s ease;
            filter: blur(10px);
        `;
        document.body.appendChild(cursorFollower);

        function updateCursor() {
            if (isMoving) {
                cursorFollower.style.left = mouseX + 'px';
                cursorFollower.style.top = mouseY + 'px';
                cursorFollower.style.opacity = '0.3';
            } else {
                cursorFollower.style.opacity = '0';
            }
            requestAnimationFrame(updateCursor);
        }
        updateCursor();
    }

    // Performance optimization: Debounce scroll events
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

    // Statistics counter animation
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = target.textContent;
                const numericValue = parseInt(finalValue);

                if (!isNaN(numericValue)) {
                    let current = 0;
                    const increment = numericValue / 50;
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= numericValue) {
                            target.textContent = finalValue;
                            clearInterval(timer);
                        } else {
                            target.textContent = Math.floor(current) + '+';
                        }
                    }, 50);
                }

                statsObserver.unobserve(target);
            }
        });
    });

    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });

    // Add loading animation
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');

        // Trigger hero animations
        setTimeout(() => {
            document.querySelectorAll('.title-line').forEach((line, index) => {
                line.style.animationDelay = `${index * 0.2}s`;
            });
        }, 100);
    });

    console.log('🚀 LOKKEE Studios inspired portfolio loaded successfully!');
});

// Add CSS for additional animations
const additionalStyles = `
    .loaded .title-line {
        opacity: 1;
        transform: translateY(0);
    }
    
    .animate-skill {
        animation: skillFloat 0.8s ease forwards;
    }
    
    .animate-work {
        animation: workSlide 0.8s ease forwards;
    }
    
    @keyframes skillFloat {
        from {
            opacity: 0;
            transform: translateY(30px) scale(0.9);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }
    
    @keyframes workSlide {
        from {
            opacity: 0;
            transform: translateX(-30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    .form-group.focused label {
        top: -8px !important;
        font-size: 12px !important;
        color: var(--accent-green) !important;
    }
    
    @media (max-width: 768px) {
        .nav-menu.active {
            display: flex !important;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: var(--secondary-bg);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            padding: 20px;
            margin-top: 10px;
            gap: 16px;
        }
        
        .nav-toggle.active span:nth-child(1) {
            transform: rotate(45deg) translate(4px, 4px);
        }
        
        .nav-toggle.active span:nth-child(2) {
            opacity: 0;
            transform: translateX(20px);
        }
        
        .nav-toggle.active span:nth-child(3) {
            transform: rotate(-45deg) translate(4px, -4px);
        }
        
        @media (max-width: 480px) {
            .nav-toggle.active span:nth-child(1) {
                transform: rotate(45deg) translate(3px, 3px);
            }
            
            .nav-toggle.active span:nth-child(3) {
                transform: rotate(-45deg) translate(3px, -3px);
            }
        }
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);