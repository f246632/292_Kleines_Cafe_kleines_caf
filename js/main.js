/**
 * KLEINES CAFÉ - Main JavaScript
 * Handles navigation, animations, and interactive features
 */

(function() {
    'use strict';

    // ============================================
    // DOM Elements
    // ============================================
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const backToTopBtn = document.getElementById('back-to-top');
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');
    const formError = document.getElementById('form-error');

    // ============================================
    // Navbar Scroll Effect
    // ============================================
    function handleNavbarScroll() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // ============================================
    // Mobile Menu Toggle
    // ============================================
    function toggleMobileMenu() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    }

    // ============================================
    // Close Mobile Menu on Link Click
    // ============================================
    function closeMobileMenu() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    // ============================================
    // Smooth Scrolling for Navigation Links
    // ============================================
    function smoothScroll(e) {
        const targetId = this.getAttribute('href');

        if (targetId.startsWith('#')) {
            e.preventDefault();
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                closeMobileMenu();
                updateActiveNavLink(targetId);
            }
        }
    }

    // ============================================
    // Update Active Navigation Link
    // ============================================
    function updateActiveNavLink(targetId) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === targetId) {
                link.classList.add('active');
            }
        });
    }

    // ============================================
    // Highlight Active Section on Scroll
    // ============================================
    function highlightActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        const navHeight = navbar.offsetHeight;
        const scrollPosition = window.scrollY + navHeight + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                updateActiveNavLink(`#${sectionId}`);
            }
        });
    }

    // ============================================
    // Back to Top Button
    // ============================================
    function handleBackToTopButton() {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // ============================================
    // Contact Form Handling
    // ============================================
    function handleFormSubmit(e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const phone = formData.get('phone');
        const message = formData.get('message');

        // Basic validation
        if (!name || !email || !message) {
            showFormMessage('error', 'Bitte füllen Sie alle Pflichtfelder aus.');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showFormMessage('error', 'Bitte geben Sie eine gültige E-Mail-Adresse ein.');
            return;
        }

        // In a real application, you would send this data to a server
        // For this demo, we'll just show a success message
        console.log('Form submitted:', { name, email, phone, message });

        // Show success message
        showFormMessage('success');

        // Reset form
        contactForm.reset();
    }

    function showFormMessage(type, customMessage = null) {
        // Hide both messages first
        formSuccess.style.display = 'none';
        formError.style.display = 'none';

        if (type === 'success') {
            formSuccess.style.display = 'block';
            setTimeout(() => {
                formSuccess.style.display = 'none';
            }, 5000);
        } else if (type === 'error') {
            if (customMessage) {
                formError.textContent = customMessage;
            }
            formError.style.display = 'block';
            setTimeout(() => {
                formError.style.display = 'none';
            }, 5000);
        }
    }

    // ============================================
    // Intersection Observer for Scroll Animations
    // ============================================
    function initScrollAnimations() {
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

        // Observe elements
        const animatedElements = document.querySelectorAll('.feature-item, .menu-category, .review-card, .gallery-item');

        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    // ============================================
    // Lazy Loading Images
    // ============================================
    function initLazyLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');

        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        }
    }

    // ============================================
    // Prevent Default Link Behavior for Hash Links
    // ============================================
    function initHashLinks() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId !== '#' && document.querySelector(targetId)) {
                    e.preventDefault();
                    const target = document.querySelector(targetId);
                    const navHeight = navbar.offsetHeight;
                    const targetPosition = target.offsetTop - navHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ============================================
    // Handle Window Resize
    // ============================================
    let resizeTimer;
    function handleResize() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Close mobile menu if window is resized to desktop
            if (window.innerWidth > 768) {
                closeMobileMenu();
            }
        }, 250);
    }

    // ============================================
    // Initialize Google Maps (if needed)
    // ============================================
    function initMap() {
        // Map is loaded via iframe, no additional initialization needed
        // This function is here for future enhancements
    }

    // ============================================
    // Event Listeners
    // ============================================
    function initEventListeners() {
        // Scroll events
        window.addEventListener('scroll', () => {
            handleNavbarScroll();
            highlightActiveSection();
            handleBackToTopButton();
        });

        // Mobile menu toggle
        if (hamburger) {
            hamburger.addEventListener('click', toggleMobileMenu);
        }

        // Navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', smoothScroll);
        });

        // Back to top button
        if (backToTopBtn) {
            backToTopBtn.addEventListener('click', scrollToTop);
        }

        // Contact form
        if (contactForm) {
            contactForm.addEventListener('submit', handleFormSubmit);
        }

        // Window resize
        window.addEventListener('resize', handleResize);

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('active') &&
                !navMenu.contains(e.target) &&
                !hamburger.contains(e.target)) {
                closeMobileMenu();
            }
        });
    }

    // ============================================
    // Initialize Everything on DOM Load
    // ============================================
    function init() {
        console.log('Kleines Café website initialized');

        initEventListeners();
        initScrollAnimations();
        initLazyLoading();
        initHashLinks();
        initMap();

        // Initial calls
        handleNavbarScroll();
        highlightActiveSection();
        handleBackToTopButton();
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ============================================
    // Expose public API (if needed)
    // ============================================
    window.KleinesCafe = {
        scrollToTop,
        closeMobileMenu,
        updateActiveNavLink
    };

})();
