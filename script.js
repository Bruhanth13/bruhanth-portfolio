/* ================================================================
   MALLEDI BRUHANTH — PORTFOLIO JAVASCRIPT
   ================================================================
   This file controls all the interactive effects:
   1. Typing animation
   2. Particle background
   3. Dark/Light theme toggle
   4. Scroll reveal animations
   5. Skill bar animations
   6. Mobile menu
================================================================ */


/* ----------------------------------------------------------------
   1. TYPING ANIMATION
   EDIT: Change the words in the 'titles' array below
---------------------------------------------------------------- */
const titles = [
  "AI/ML Engineer",
  "Python Developer",
  "Deep Learning Enthusiast",
  "Problem Solver"
];

let titleIndex = 0;      // Which word we're on
let charIndex = 0;       // Which character we're on
let isDeleting = false;  // Are we typing or deleting?

function runTypingAnimation() {
  const typedEl = document.getElementById("typed-text");
  if (!typedEl) return;

  const currentWord = titles[titleIndex];

  if (!isDeleting) {
    // Typing forward
    typedEl.textContent = currentWord.slice(0, charIndex + 1);
    charIndex++;
    if (charIndex === currentWord.length) {
      // Word is complete — wait then start deleting
      isDeleting = true;
      setTimeout(runTypingAnimation, 1400);
      return;
    }
  } else {
    // Deleting backward
    typedEl.textContent = currentWord.slice(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      // Word is deleted — move to next word
      isDeleting = false;
      titleIndex = (titleIndex + 1) % titles.length;
    }
  }

  // Speed: deleting is faster than typing
  const speed = isDeleting ? 55 : 95;
  setTimeout(runTypingAnimation, speed);
}

// Start typing animation when page loads
runTypingAnimation();


/* ----------------------------------------------------------------
   2. PARTICLE BACKGROUND (Hero section)
   EDIT: Change particleCount to add more/less dots
   EDIT: Change color values to change particle color
---------------------------------------------------------------- */
const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const particleCount = 50; // EDIT: More = more dots (but slower)

// Create particles
const particles = Array.from({ length: particleCount }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  radius: Math.random() * 1.8 + 0.5,
  vx: (Math.random() - 0.5) * 0.4,   // Horizontal speed
  vy: (Math.random() - 0.5) * 0.4,   // Vertical speed
  alpha: Math.random() * 0.5 + 0.15  // Opacity
}));

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    // Move particle
    p.x += p.vx;
    p.y += p.vy;

    // Bounce off edges
    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

    // Draw particle dot
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(96, 165, 250, ${p.alpha})`; // EDIT: Change color here
    ctx.fill();
  });

  // Draw connecting lines between close particles
  particles.forEach((p1, i) => {
    particles.forEach((p2, j) => {
      if (j <= i) return;
      const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
      const maxDist = 100; // EDIT: Max distance for lines to appear
      if (dist < maxDist) {
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `rgba(59, 130, 246, ${0.15 * (1 - dist / maxDist)})`; // EDIT: Line color
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    });
  });

  requestAnimationFrame(drawParticles); // Keep animating
}

drawParticles();


/* ----------------------------------------------------------------
   3. DARK / LIGHT THEME TOGGLE
   No edits needed here — it just works!
---------------------------------------------------------------- */
const themeBtn = document.getElementById("themeToggle");

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");
  themeBtn.textContent = document.body.classList.contains("light")
    ? "🌙 Dark"
    : "☀️ Light";
});


/* ----------------------------------------------------------------
   4. SCROLL REVEAL ANIMATIONS
   Sections fade in as you scroll down
   No edits needed — it automatically finds all .section elements
---------------------------------------------------------------- */
const revealElements = document.querySelectorAll(".section, .edu-card, .cert-card, .project-card, .skill-card, .stat-card");

revealElements.forEach(el => el.classList.add("reveal"));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, { threshold: 0.1 });

revealElements.forEach(el => observer.observe(el));


/* ----------------------------------------------------------------
   5. SKILL BAR ANIMATION
   Skill bars fill up when you scroll to the skills section
   No edits needed!
---------------------------------------------------------------- */
const skillBars = document.querySelectorAll(".skill-fill");

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Trigger the CSS width transition
      entry.target.style.width = entry.target.getAttribute("style").match(/width:\s*([\d%]+)/)?.[1] || "0%";
    }
  });
}, { threshold: 0.3 });

// Reset widths first, then animate on scroll
skillBars.forEach(bar => {
  const targetWidth = bar.style.width;
  bar.style.width = "0%";
  bar.dataset.width = targetWidth;
  skillObserver.observe(bar);
});

// Re-animate when visible
const skillBarObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.width = entry.target.dataset.width;
    }
  });
}, { threshold: 0.3 });

skillBars.forEach(bar => skillBarObserver.observe(bar));


/* ----------------------------------------------------------------
   6. MOBILE HAMBURGER MENU
   No edits needed!
---------------------------------------------------------------- */
const hamburger = document.getElementById("hamburger");
const navLinks = document.querySelector(".nav-links");

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

// Close menu when a link is clicked
navLinks.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
  });
});


/* ----------------------------------------------------------------
   7. NAVBAR — Highlight active section while scrolling
   No edits needed!
---------------------------------------------------------------- */
const sections = document.querySelectorAll("section[id]");
const navItems = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {
  let currentSection = "";
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      currentSection = section.getAttribute("id");
    }
  });

  navItems.forEach(link => {
    link.style.color = "";
    if (link.getAttribute("href") === `#${currentSection}`) {
      link.style.color = "#60a5fa"; // Highlight active nav item
    }
  });
});
