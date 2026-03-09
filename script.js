/* ===============================================
   VietD Website - Main JavaScript
   =============================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ============ HERO SLIDER ============
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.slider-dot');
    let currentSlide = 0;
    let slideInterval;

    function goToSlide(index) {
        slides.forEach(s => s.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));
        currentSlide = index;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        goToSlide((currentSlide + 1) % slides.length);
    }

    function startSlider() {
        slideInterval = setInterval(nextSlide, 5000);
    }

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            clearInterval(slideInterval);
            goToSlide(i);
            startSlider();
        });
    });

    if (slides.length > 0) {
        goToSlide(0);
        startSlider();
    }

    // ============ NAVBAR SCROLL EFFECT ============
    const navbar = document.querySelector('.navbar');
    const backToTop = document.querySelector('.back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        if (window.scrollY > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ============ MOBILE MENU ============
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const spans = hamburger.querySelectorAll('span');
            hamburger.classList.toggle('open');
        });

        // Close menu on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // ============ SCROLL ANIMATIONS ============
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -50px 0px' };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animateElements.forEach(el => observer.observe(el));

    // ============ COUNTER ANIMATION ============
    const counters = document.querySelectorAll('.stat-number');
    let countersAnimated = false;

    function animateCounters() {
        if (countersAnimated) return;
        countersAnimated = true;

        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const suffix = counter.getAttribute('data-suffix') || '';
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                counter.textContent = Math.floor(current).toLocaleString() + suffix;
            }, 16);
        });
    }

    const statsSection = document.querySelector('.stats-bar');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                animateCounters();
                statsObserver.unobserve(statsSection);
            }
        }, { threshold: 0.3 });
        statsObserver.observe(statsSection);
    }

    // ============ EXPERTS SLIDER ============
    const expertsTrack = document.querySelector('.experts-track');
    const expertSlides = document.querySelectorAll('.expert-slide');
    let currentExpertSlide = 0;

    function goToExpertSlide(index) {
        if (!expertsTrack || expertSlides.length === 0) return;
        currentExpertSlide = index;
        if (currentExpertSlide < 0) currentExpertSlide = expertSlides.length - 1;
        if (currentExpertSlide >= expertSlides.length) currentExpertSlide = 0;
        expertsTrack.style.transform = `translateX(-${currentExpertSlide * 100}%)`;
    }

    const prevBtn = document.querySelector('.expert-prev');
    const nextBtn = document.querySelector('.expert-next');
    if (prevBtn) prevBtn.addEventListener('click', () => goToExpertSlide(currentExpertSlide - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goToExpertSlide(currentExpertSlide + 1));

    // ============ SMOOTH SCROLL FOR NAV LINKS ============
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const pos = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: pos, behavior: 'smooth' });
            }
        });
    });

    // ============ PARTICLE BACKGROUND (Hero) ============
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let w, h;

        function resizeCanvas() {
            const hero = document.querySelector('.hero');
            w = canvas.width = hero.offsetWidth;
            h = canvas.height = hero.offsetHeight;
        }

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * w;
                this.y = Math.random() * h;
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = (Math.random() - 0.5) * 0.4;
                this.size = Math.random() * 2 + 0.5;
                this.alpha = Math.random() * 0.3 + 0.1;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > w || this.y < 0 || this.y > h) this.reset();
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(184, 134, 11, ${this.alpha})`;
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            const count = Math.min(Math.floor((w * h) / 12000), 120);
            for (let i = 0; i < count; i++) particles.push(new Particle());
        }

        function drawLines() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 130) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(184, 134, 11, ${0.08 * (1 - dist / 130)})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, w, h);
            particles.forEach(p => { p.update(); p.draw(); });
            drawLines();
            requestAnimationFrame(animate);
        }

        resizeCanvas();
        initParticles();
        animate();
        window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });
    }

    // ============ TYPING EFFECT FOR HERO ============
    const typingEl = document.querySelector('.typing-text');
    if (typingEl) {
        const texts = [
            'Chuyển đổi số cho Doanh nghiệp',
            'Mini MBA Thực chiến',
            'AI cho Lãnh đạo',
            'Kết nối Quốc tế'
        ];
        let textIndex = 0, charIndex = 0, isDeleting = false;

        function type() {
            const current = texts[textIndex];
            if (isDeleting) {
                typingEl.textContent = current.substring(0, charIndex--);
                if (charIndex < 0) { isDeleting = false; textIndex = (textIndex + 1) % texts.length; }
            } else {
                typingEl.textContent = current.substring(0, charIndex++);
                if (charIndex > current.length) { isDeleting = true; setTimeout(type, 2000); return; }
            }
            setTimeout(type, isDeleting ? 40 : 80);
        }
        setTimeout(type, 1000);
    }

});
