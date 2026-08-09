/**
 * Navigation Options and Configurations
 */
const tabOrder = ['about', 'experience', 'portfolio', 'projects', 'skills', 'education', 'certifications'];
const mobileToggle = document.getElementById('mobile-menu-toggle');
const mainNav = document.getElementById('main-nav');

/**
 * Mobile Menu Toggle Handler
 */
if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        mobileToggle.classList.toggle('open');
    });
}

/**
 * Clean Smooth Navigation and Scrollspy System
 */
const sections = document.querySelectorAll('section.tab-content');
const navTabs = document.querySelectorAll('.tabs .tab');

// Smooth scrolling click logic
navTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = tab.getAttribute('href').replace('#', '');
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
            // Collapse mobile menu upon selection if expanded
            if (mainNav && mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                if (mobileToggle) mobileToggle.classList.remove('open');
            }

            // Smooth scroll with an offset to keep the sticky terminal frame clean
            const targetOffset = targetSection.getBoundingClientRect().top + window.scrollY - 140;
            window.scrollTo({
                top: targetOffset,
                behavior: 'smooth'
            });

            // Update URL cleanly without aggressive snapping
            history.pushState(null, null, `#${targetId}`);
        }
    });
});

/**
 * Smooth Scroll for External Contact Anchor Icon/Button
 */
const contactScrollBtn = document.querySelector('a[href="#contact"]:not(.tab)');

if (contactScrollBtn) {
    contactScrollBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetSection = document.getElementById('contact');

        if (targetSection) {
            const targetOffset = targetSection.getBoundingClientRect().top + window.scrollY - 140;
            window.scrollTo({
                top: targetOffset,
                behavior: 'smooth'
            });
            history.pushState(null, null, '#contact');
        }
    });
}

/**
 * Dynamic Contact Form Label Updater based on Active Section
 */
function updateContactLabels(sectionId) {
    const nameLabel = document.querySelector('#contact-form label[for="name"] .label-text');
    const emailLabel = document.querySelector('#contact-form label[for="email"] .label-text');
    const messageLabel = document.querySelector('#contact-form label[for="message"] .label-text');

    if (!nameLabel || !emailLabel || !messageLabel) return;

    let nameText = 'name:';
    let emailText = 'email:';
    let messageText = 'message / scope:';

    switch (sectionId) {
        case 'about':
            nameText = 'recruiter_name:';
            emailText = 'recruiter_email:';
            messageText = 'inquiry_background:';
            break;
        case 'experience':
            nameText = 'hiring_manager:';
            emailText = 'company_email:';
            messageText = 'role_or_contract_details:';
            break;
        case 'portfolio':
        case 'projects':
            nameText = 'collaborator_name:';
            emailText = 'contact_email:';
            messageText = 'project_collaboration_idea:';
            break;
        case 'skills':
            nameText = 'engineer_name:';
            emailText = 'tech_lead_email:';
            messageText = 'stack_requirements:';
            break;
        case 'education':
        case 'certifications':
            nameText = 'name:';
            emailText = 'email:';
            messageText = 'message / scope:';
            break;
        default:
            nameText = 'name:';
            emailText = 'email:';
            messageText = 'message / scope:';
    }

    nameLabel.textContent = nameText;
    emailLabel.textContent = emailText;
    messageLabel.textContent = messageText;
}

// Scrollspy Logic: Highlights items dynamically depending on active window viewpoint
function scrollSpy() {
    // If we're at (or extremely close to) the bottom of the page,
    // always highlight the last section.
    if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 5
    ) {
        navTabs.forEach(tab => tab.classList.remove('active'));

        const lastTab = document.querySelector('.tabs .tab[href="#certifications"]');
        if (lastTab) {
            lastTab.classList.add('active');
        }

        updateContactLabels('certifications');
        return;
    }

    let currentSectionId = 'about';
    const triggerOffset = 180; // Triggers active highlight a little before passing the section top boundary

    sections.forEach(section => {
        const sectionTop = section.offsetTop - triggerOffset;
        if (window.scrollY >= sectionTop) {
            currentSectionId = section.getAttribute('id');
        }
    });

    navTabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.getAttribute('href') === `#${currentSectionId}`) {
            tab.classList.add('active');
        }
    });

    updateContactLabels(currentSectionId);
}

/**
 * Back to Top Button Logic
 */
const bttBtn = document.getElementById("backToTop");

function toggleBackToTop() {
    if (!bttBtn) return;

    if (window.scrollY > 300) {
        bttBtn.classList.add("show");
    } else {
        bttBtn.classList.remove("show");
    }
}

/**
 * Combined, rAF-throttled scroll handler.
 *
 * scrollSpy() and toggleBackToTop() were each running on every single
 * 'scroll' event, and scrollSpy() reads section.offsetTop (a forced
 * layout read) each time it runs. During a fast scroll that's a lot of
 * repeated layout work stacked on top of an already GPU-heavy page,
 * which was starving the requestAnimationFrame loop driving the
 * background particle animation. Running both at most once per
 * animation frame (via a simple "ticking" flag) fixes that without
 * changing what either function does.
 */
let scrollTicking = false;
function onScroll() {
    if (!scrollTicking) {
        scrollTicking = true;
        requestAnimationFrame(() => {
            scrollSpy();
            toggleBackToTop();
            scrollTicking = false;
        });
    }
}
window.addEventListener('scroll', onScroll, { passive: true });

// Ensure the correct initial state
toggleBackToTop();

if (bttBtn) {
    bttBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

/**
 * Theme Toggle Engine with LocalStorage Persistence
 * Updated for Checkbox and Slider Layout
 */
const toggleInput = document.getElementById("theme-toggle");

function updateThemeUI(isLight) {
    if (toggleInput) {
        toggleInput.checked = isLight;
    }
}

// Initial Sync
const savedTheme = localStorage.getItem("theme");
const isLightInitially = (savedTheme === "light");

if (isLightInitially) {
    document.body.classList.add("light");
} else {
    document.body.classList.remove("light");
}
updateThemeUI(isLightInitially);

// Event Listener for modern input switch change
if (toggleInput) {
    toggleInput.addEventListener("change", (e) => {
        const isNowLight = e.target.checked;
        if (isNowLight) {
            document.body.classList.add("light");
            localStorage.setItem("theme", "light");
        } else {
            document.body.classList.remove("light");
            localStorage.setItem("theme", "dark");
        }
    });
}

/**
 * Smooth Horizontal Scrollable Portfolio System with Dynamic Button States
 */
document.addEventListener('DOMContentLoaded', () => {
    const viewport = document.querySelector('.carousel-viewport');
    const prevBtn = document.querySelector('.carousel-btn.prev-btn');
    const nextBtn = document.querySelector('.carousel-btn.next-btn');

    if (viewport && prevBtn && nextBtn) {
        function updateButtonStates() {
            const scrollLeft = viewport.scrollLeft;
            const maxScrollLeft = viewport.scrollWidth - viewport.clientWidth;

            // Disable prev button if at the far left
            if (scrollLeft <= 2) {
                prevBtn.setAttribute('disabled', 'true');
                prevBtn.style.opacity = '0.3';
                prevBtn.style.cursor = 'not-allowed';
            } else {
                prevBtn.removeAttribute('disabled');
                prevBtn.style.opacity = '1';
                prevBtn.style.cursor = 'pointer';
            }

            // Disable next button if at the far right
            if (scrollLeft >= maxScrollLeft - 2) {
                nextBtn.setAttribute('disabled', 'true');
                nextBtn.style.opacity = '0.3';
                nextBtn.style.cursor = 'not-allowed';
            } else {
                nextBtn.removeAttribute('disabled');
                nextBtn.style.opacity = '1';
                nextBtn.style.cursor = 'pointer';
            }
        }

        // Attach click handlers for smooth scrolling
        prevBtn.addEventListener('click', () => {
            viewport.scrollBy({ left: -330, behavior: 'smooth' });
        });

        nextBtn.addEventListener('click', () => {
            viewport.scrollBy({ left: 330, behavior: 'smooth' });
        });

        // Update states on scroll and window resize
        viewport.addEventListener('scroll', updateButtonStates);
        window.addEventListener('resize', updateButtonStates);

        // Initial check on load
        updateButtonStates();
    }
});

/**
 * Contact Form Submission via Formspree (AJAX, no page redirect)
 */
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
const submitBtn = document.getElementById('submit-btn');
const submitBtnText = document.getElementById('submit-btn-text');

/**
 * Keep the Send Message button disabled until name, email, and
 * message/scope all have content. Runs on every keystroke/change in
 * any of the three fields, plus once on load and again after a
 * successful send (which clears the form via contactForm.reset()).
 */
const nameField = document.getElementById('name');
const emailField = document.getElementById('email');
const messageField = document.getElementById('message');

function updateSubmitState() {
    if (!submitBtn || !nameField || !emailField || !messageField) return;

    // checkValidity() leverages the fields' existing HTML validation
    // (required on name/email, and the email type="email" format
    // check) — so the button only enables once those actually pass,
    // not just once each field has *some* text in it.
    const nameOk = nameField.value.trim().length > 0 && nameField.checkValidity();
    const emailOk = emailField.value.trim().length > 0 && emailField.checkValidity();
    const hasMessage = messageField.value.trim().length > 0;

    submitBtn.disabled = !(nameOk && emailOk && hasMessage);
}

if (nameField && emailField && messageField) {
    [nameField, emailField, messageField].forEach(field => {
        field.addEventListener('input', updateSubmitState);
    });
    // Set the correct initial state on page load (button starts disabled).
    updateSubmitState();
}

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const originalText = submitBtnText.textContent;
        submitBtn.disabled = true;
        submitBtnText.textContent = 'Sending...';
        formStatus.textContent = '';
        formStatus.className = 'form-status';

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: new FormData(contactForm),
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                formStatus.textContent = '> message_sent: 200 OK ✓ Thanks — I\'ll get back to you soon.';
                formStatus.classList.add('success');
                contactForm.reset();
            } else {
                const data = await response.json().catch(() => null);
                const errMsg = data && data.errors ? data.errors.map(err => err.message).join(', ') : 'Something went wrong.';
                formStatus.textContent = `> error: ${errMsg}`;
                formStatus.classList.add('error');
            }
        } catch (err) {
            formStatus.textContent = '> error: network_failure — please try again or email me directly.';
            formStatus.classList.add('error');
        } finally {
            submitBtnText.textContent = originalText;
            updateSubmitState();
        }
    });
}

/**
 * Background Network Canvas Animation
 */
const canvas = document.getElementById("background-canvas");
if (canvas) {
    const ctx = canvas.getContext("2d");
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener("resize", () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = 2 + Math.random() * 2;
        }
        move() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) this.reset();
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = document.body.classList.contains('light') ? 'rgba(58, 134, 255, 0.2)' : 'rgba(76, 201, 240, 0.4)';
            ctx.fill();
        }
    }
    const particles = Array.from({ length: 80 }, () => new Particle());

    function drawNetwork() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => { p.move(); p.draw(); });
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                let dx = particles[i].x - particles[j].x;
                let dy = particles[i].y - particles[j].y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.strokeStyle = document.body.classList.contains('light') ? 'rgba(58,134,255,' + (0.15 - dist / 400) + ')' : 'rgba(58,134,255,' + (0.3 - dist / 400) + ')';
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(drawNetwork);
    }
    drawNetwork(); 
}

/**
 * Handle Initial Load and Clean Navigation Jumps
 */
document.addEventListener('DOMContentLoaded', () => {
    const hash = window.location.hash;
    if (hash) {
        const targetSection = document.getElementById(hash.replace('#', ''));
        if (targetSection) {
            setTimeout(() => {
                const targetOffset = targetSection.getBoundingClientRect().top + window.scrollY - 140;
                window.scrollTo({ top: targetOffset, behavior: 'smooth' });
            }, 100);
        }
    } else {
        window.scrollTo(0, 0);
    }
    scrollSpy();
});

document.addEventListener('click', (event) => {
    const menu = document.querySelector('.tabs');
    const toggle = document.querySelector('.mobile-menu-toggle');

    if (
        menu &&
        toggle &&
        menu.classList.contains('active') &&
        !menu.contains(event.target) &&
        !toggle.contains(event.target)
    ) {
        menu.classList.remove('active');
    }
});
