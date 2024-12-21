document.addEventListener('DOMContentLoaded', function () {
    // Video overlay functionality
    const videoOverlay = document.querySelector('.video-overlay');
    const videoIframe = document.querySelector('.video-content iframe');

    if (videoOverlay && videoIframe) {
        videoOverlay.addEventListener('click', function () {
            // Add autoplay parameter to URL
            let videoSrc = videoIframe.src;
            if (videoSrc.indexOf('?') > -1) {
                videoIframe.src = videoSrc + '&autoplay=1';
            } else {
                videoIframe.src = videoSrc + '?autoplay=1';
            }
            // Hide overlay after click
            videoOverlay.style.display = 'none';
        });
    }

    // Mobile menu functionality
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function () {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        });
    }

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');

    if (navbar) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Dropdown menu hover effect
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const menu = dropdown.querySelector('.dropdown-menu');

        if (menu) {
            dropdown.addEventListener('mouseenter', () => {
                menu.style.display = 'block';
            });

            dropdown.addEventListener('mouseleave', () => {
                menu.style.display = 'none';
            });
        }
    });

    // Scrolling text animation optimization
    const scrollLines = document.querySelectorAll('.scroll-line');
    scrollLines.forEach(line => {
        if (line.textContent.trim().length < window.innerWidth / 20) {
            line.innerHTML += line.innerHTML;
        }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function (event) {
        const isClickInsideNav = navLinks.contains(event.target) || mobileMenuBtn.contains(event.target);

        if (!isClickInsideNav && window.innerWidth <= 768 && navLinks.style.display === 'flex') {
            navLinks.style.display = 'none';
        }
    });

    // Handle window resize for mobile menu
    let resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            if (window.innerWidth > 768) {
                navLinks.style.display = 'flex';
            } else {
                navLinks.style.display = 'none';
            }
        }, 250);
    });

    // Optimize scroll event listener
    let ticking = false;
    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(function () {
                if (navbar && window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else if (navbar) {
                    navbar.classList.remove('scrolled');
                }
                ticking = false;
            });
            ticking = true;
        }
    });

    // Service items animation on scroll
    const serviceItems = document.querySelectorAll('.service-item');
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px'
    };

    const serviceObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                serviceObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    serviceItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(50px)';
        item.style.transitionDelay = `${index * 0.1}s`;
        serviceObserver.observe(item);
    });

    // Stats counter animation
    function animateCounter(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            element.textContent = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // Initialize stats animation
    const stats = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const endValue = parseInt(target.textContent);
                animateCounter(target, 0, endValue, 2000);
                statsObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => {
        statsObserver.observe(stat);
    });

    // Service item hover effect enhancement
    serviceItems.forEach(item => {
        const overlay = item.querySelector('.service-overlay');
        const content = item.querySelector('.service-content');

        item.addEventListener('mouseenter', () => {
            overlay.style.opacity = '1';
            content.style.transform = 'translateY(0)';
        });

        item.addEventListener('mouseleave', () => {
            overlay.style.opacity = '0';
            content.style.transform = 'translateY(20px)';
        });
    });

    // Parallax effect for hero section
    const heroSection = document.querySelector('.hero-section');
    let lastScrollTop = 0;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                if (heroSection) {
                    const translateY = scrollTop * 0.4;
                    heroSection.style.transform = `translateY(${translateY}px)`;
                }
                lastScrollTop = scrollTop;
                ticking = false;
            });
            ticking = true;
        }
    });

    // Image lazy loading
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => {
        imageObserver.observe(img);
    });

    // Smooth scroll to top
    const scrollToTop = document.createElement('button');
    scrollToTop.innerHTML = '↑';
    scrollToTop.className = 'scroll-to-top';
    scrollToTop.style.display = 'none';
    document.body.appendChild(scrollToTop);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            scrollToTop.style.display = 'block';
        } else {
            scrollToTop.style.display = 'none';
        }
    });

    scrollToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // FAQ Accordion functionality
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current FAQ item
            item.classList.toggle('active');
        });
    });

    //Close FAQ when clicking outside
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.faq-item')) {
            faqItems.forEach(item => {
                item.classList.remove('active');
            });
        }
    });

    // Premium Features Slider
    const sliderItems = document.querySelectorAll('.slider-item');
    let currentSlide = 0;

    function updateSlider() {
        sliderItems.forEach((item, index) => {
            item.style.opacity = index === currentSlide ? '1' : '0';
        });

        currentSlide = (currentSlide + 1) % sliderItems.length;
    }

    setInterval(updateSlider, 3000); // Change slide every 3 seconds
});