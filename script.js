    document.addEventListener('DOMContentLoaded', function() {
        initializeDarkMode();
        setupScrollAnimations();
        setupNavigation();
        setupTypingEffect();
        initializeParallax();
        setupEmailCopy();
    });

    function initializeDarkMode() {
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (!darkModeToggle) {
            console.error('❌ دکمه دارک مود پیدا نشد!');
            return;
        }

        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedMode = localStorage.getItem('darkMode');
        const isDarkMode = savedMode === 'true' || (savedMode === null && prefersDark);

        if (isDarkMode) {
            document.body.classList.add('dark-mode');
            updateDarkModeIcon(true);
        }

        darkModeToggle.addEventListener('click', toggleDarkMode);
        console.log('✅ دارک مود فعال شد');
    }

    function toggleDarkMode() {
        const body = document.body;
        const isDarkMode = body.classList.toggle('dark-mode');

        localStorage.setItem('darkMode', isDarkMode.toString());
        updateDarkModeIcon(isDarkMode);

        console.log('🎨 حالت:', isDarkMode ? 'تاریک' : 'روشن');
    }

    function updateDarkModeIcon(isDarkMode) {
        const icon = document.querySelector('#darkModeToggle i');
        if (icon) {
            icon.className = isDarkMode ? 'bi bi-sun' : 'bi bi-moon';
            icon.style.transition = 'transform 0.3s';
            icon.style.transform = isDarkMode ? 'rotate(180deg)' : 'rotate(0deg)';
        }
    }

    function setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.delay || 0;

                    setTimeout(() => {
                        entry.target.classList.add('visible');

                        const childElements = entry.target.querySelectorAll('.fade-up, .fade-card');
                        childElements.forEach((child, index) => {
                            setTimeout(() => {
                                child.classList.add('visible');
                            }, index * 100);
                        });
                    }, delay);
                } else {
                    if (window.scrollY < entry.target.offsetTop - 100) {
                        entry.target.classList.remove('visible');
                        entry.target.querySelectorAll('.fade-up, .fade-card').forEach(child => {
                            child.classList.remove('visible');
                        });
                    }
                }
            });
        }, observerOptions);

        document.querySelectorAll('.fade-up, .fade-card, .content-section').forEach(el => {
            observer.observe(el);
        });
    }

    function setupTypingEffect() {
        const typingElement = document.getElementById('typingText');
        if (!typingElement) {
            console.error('❌ المان typingText پیدا نشد!');
            return;
        }

        const texts = [
            "توسعه دهنده فرانت اند & وردپرس",
            "طراح رابط کاربری (UI/UX)",
            "متخصص وب‌سایت‌های ریسپانسیو",
        ];

        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        function type() {
            const currentText = texts[textIndex];

            if (isDeleting) {
                typingElement.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50;
            } else {
                typingElement.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 100;
            }

            if (!isDeleting && charIndex === currentText.length) {
                isDeleting = true;
                typingSpeed = 1500;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                typingSpeed = 500;
            }
            setTimeout(type, typingSpeed);
        }

        typingElement.textContent = texts[0].charAt(0);
        charIndex = 1;
        setTimeout(type, 1000);
    }

    function setupNavigation() {
        const navButtons = document.querySelectorAll('.nav-btn');
        const sections = document.querySelectorAll('.content-section');

        if (sections.length > 0 && !document.querySelector('.content-section.active')) {
            sections[0].classList.add('active');
        }

        navButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const sectionId = this.dataset.section || this.getAttribute('onclick').match(/'([^']+)'/)[1];
                showSection(sectionId);
            });
        });
    }

    function showSection(sectionId) {
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
            section.style.display = 'none';
        });

        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.style.display = 'block';

            setTimeout(() => {
                targetSection.classList.add('active');

                const activeButton = document.querySelector(`.nav-btn[data-section="${sectionId}"]`);
                if (activeButton) {
                    activeButton.classList.add('active');
                }
            }, 50);

            window.scrollTo({
                top: targetSection.offsetTop - 80,
                behavior: 'smooth'
            });

            setTimeout(setupScrollAnimations, 300);
        }
    }

    function scrollToSection(sectionId) {
        showSection(sectionId);
    }

    function initializeParallax() {
        const heroSection = document.querySelector('.hero-section');
        if (!heroSection) return;

        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.floating-icon, .logo-glow');

            parallaxElements.forEach(element => {
                const speed = element.dataset.speed || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });

            const opacity = 1 - (scrolled / 500);
            heroSection.style.opacity = Math.max(opacity, 0.3);
        });
    }

    function setupEmailCopy() {
        const copyButton = document.querySelector('.copy-btn');
        if (!copyButton) return;

        copyButton.addEventListener('click', copyEmail);
    }

    function copyEmail() {
        const email = 'enwo.dev.ir@gmail.com';

        navigator.clipboard.writeText(email).then(() => {
            const button = document.querySelector('.copy-btn');
            const originalHTML = button.innerHTML;

            button.innerHTML = '<i class="bi bi-check"></i>';
            button.style.background = '#10b981';

            setTimeout(() => {
                button.innerHTML = originalHTML;
                button.style.background = '';
            }, 2000);
        }).catch(err => {
            console.error('خطا در کپی کردن ایمیل:', err);
        });
    }

    window.addEventListener('resize', function() {
        setTimeout(setupScrollAnimations, 100);
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            setupScrollAnimations();
        }
    });

    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
        document.body.appendChild(script);
    }

    let scrollTimeout;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const visibleSections = document.querySelectorAll('.content-section.active');
            visibleSections.forEach(section => {
                const animations = section.querySelectorAll('.fade-up, .fade-card');
                animations.forEach(anim => {
                    if (isElementInViewport(anim)) {
                        anim.classList.add('visible');
                    }
                });
            });
        }, 100);
    });

    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom >= 0
        );
    }