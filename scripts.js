const eventDate = new Date("March 08, 2026 05:30:00").getTime();
const circumference = 2 * Math.PI * 50;

function updateRing(id, percent) {
    const ring = document.getElementById(id);
    if (!ring) return;
    const offset = circumference - (percent / 100) * circumference;
    ring.style.strokeDashoffset = offset;
}

setInterval(() => {
    const now = new Date().getTime();
    const diff = eventDate - now;
    if (diff > 0) {
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor(
            (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById("days").innerText = String(d).padStart(
            2,
            "0",
        );
        document.getElementById("hours").innerText = String(h).padStart(
            2,
            "0",
        );
        document.getElementById("minutes").innerText = String(m).padStart(
            2,
            "0",
        );
        document.getElementById("seconds").innerText = String(s).padStart(
            2,
            "0",
        );

        updateRing("ring-days", (d / 365) * 100);
        updateRing("ring-hours", (h / 24) * 100);
        updateRing("ring-minutes", (m / 60) * 100);
        updateRing("ring-seconds", (s / 60) * 100);
    }
}, 1000);

    // Accordion Toggle
function toggleAcc(head) {
    const row = head.parentElement;
    const isActive = row.classList.contains('active');
    
    // Close others in same card
    row.parentElement.querySelectorAll('.acc-row').forEach(r => r.classList.remove('active'));
    
    if (!isActive) row.classList.add('active');
}

// Reveal on Scroll Logic
const observerOptions = { threshold: 0.15 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));