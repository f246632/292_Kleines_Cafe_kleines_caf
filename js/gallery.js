/**
 * KLEINES CAFÉ - Gallery & Lightbox JavaScript
 * Handles image gallery and lightbox functionality
 */

(function() {
    'use strict';

    // ============================================
    // DOM Elements
    // ============================================
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');
    const galleryItems = document.querySelectorAll('.gallery-item');

    // ============================================
    // Open Lightbox
    // ============================================
    function openLightbox(imageSrc, caption) {
        if (!lightbox || !lightboxImg) return;

        lightboxImg.src = imageSrc;
        lightboxCaption.textContent = caption || '';
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Add keyboard navigation
        document.addEventListener('keydown', handleKeyPress);
    }

    // ============================================
    // Close Lightbox
    // ============================================
    function closeLightbox() {
        if (!lightbox) return;

        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        lightboxImg.src = '';
        lightboxCaption.textContent = '';

        // Remove keyboard navigation
        document.removeEventListener('keydown', handleKeyPress);
    }

    // ============================================
    // Handle Keyboard Navigation
    // ============================================
    function handleKeyPress(e) {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    }

    // ============================================
    // Initialize Gallery Items
    // ============================================
    function initGallery() {
        galleryItems.forEach(item => {
            item.addEventListener('click', function() {
                const imageSrc = this.getAttribute('data-image') || this.querySelector('img').src;
                const caption = this.querySelector('.gallery-overlay span')?.textContent || '';

                openLightbox(imageSrc, caption);
            });

            // Add keyboard accessibility
            item.setAttribute('tabindex', '0');
            item.setAttribute('role', 'button');
            item.setAttribute('aria-label', 'Bild in Galerie öffnen');

            item.addEventListener('keypress', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });
    }

    // ============================================
    // Event Listeners for Lightbox
    // ============================================
    function initLightboxListeners() {
        // Close button
        if (lightboxClose) {
            lightboxClose.addEventListener('click', closeLightbox);
        }

        // Click outside image to close
        if (lightbox) {
            lightbox.addEventListener('click', function(e) {
                if (e.target === lightbox) {
                    closeLightbox();
                }
            });
        }

        // Prevent closing when clicking on image
        if (lightboxImg) {
            lightboxImg.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }
    }

    // ============================================
    // Image Preloading for Better Performance
    // ============================================
    function preloadGalleryImages() {
        const images = [];

        galleryItems.forEach(item => {
            const imageSrc = item.getAttribute('data-image') || item.querySelector('img').src;
            if (imageSrc) {
                const img = new Image();
                img.src = imageSrc;
                images.push(img);
            }
        });

        return images;
    }

    // ============================================
    // Add Touch Swipe Support (Mobile)
    // ============================================
    let touchStartX = 0;
    let touchEndX = 0;

    function handleSwipe() {
        const swipeThreshold = 50;

        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe left - could be used for next image in future
            console.log('Swipe left detected');
        }

        if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe right - could be used for previous image in future
            console.log('Swipe right detected');
        }

        // Swipe down to close
        if (Math.abs(touchEndX - touchStartX) < 20) {
            // Minimal horizontal movement, might be vertical swipe
            closeLightbox();
        }
    }

    function initTouchEvents() {
        if (lightbox) {
            lightbox.addEventListener('touchstart', function(e) {
                touchStartX = e.changedTouches[0].screenX;
            }, false);

            lightbox.addEventListener('touchend', function(e) {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            }, false);
        }
    }

    // ============================================
    // Lazy Load Gallery Images
    // ============================================
    function lazyLoadGalleryImages() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target.querySelector('img');
                        if (img && img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.add('loaded');
                        }
                        imageObserver.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '50px'
            });

            galleryItems.forEach(item => {
                imageObserver.observe(item);
            });
        }
    }

    // ============================================
    // Add Gallery Animation on Scroll
    // ============================================
    function animateGalleryOnScroll() {
        if ('IntersectionObserver' in window) {
            const animationObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'scale(1)';
                        }, index * 100); // Stagger animation
                        animationObserver.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1
            });

            galleryItems.forEach(item => {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.9)';
                item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                animationObserver.observe(item);
            });
        }
    }

    // ============================================
    // Initialize Everything
    // ============================================
    function init() {
        console.log('Gallery initialized');

        initGallery();
        initLightboxListeners();
        initTouchEvents();
        lazyLoadGalleryImages();
        animateGalleryOnScroll();

        // Preload images for better UX
        setTimeout(() => {
            preloadGalleryImages();
        }, 1000);
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ============================================
    // Expose public API
    // ============================================
    window.KleinesCafeGallery = {
        openLightbox,
        closeLightbox
    };

})();
