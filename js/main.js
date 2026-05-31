// ================================
// VARIABLES
// ================================
let adults = 1;
let kids = 0;
let hours = 0.5;
let durationLabel = "30 min";

// ================================
// INITIALIZE TIME SLOTS
// ================================
function initTimeSlots() {
    const timeSelect = document.getElementById("time");
    const startHour = 8; // 8 AM
    const endHour = 20; // 8 PM (last slot at 7:30 PM)

    for (let hour = startHour; hour < endHour; hour++) {
        for (let minutes = 0; minutes < 60; minutes += 30) {
            const meridiem = hour < 12 ? "AM" : "PM";
            const displayHour = hour % 12 === 0 ? 12 : hour % 12;
            const displayMinutes = minutes === 0 ? "00" : minutes;
            const timeString = `${displayHour}:${displayMinutes} ${meridiem}`;
            
            const option = document.createElement("option");
            option.value = timeString;
            option.textContent = timeString;
            timeSelect.appendChild(option);
        }
    }
}

// ================================
// CHANGE PASSENGER COUNT
// ================================
function change(type, delta) {
    if (type === "adults") {
        adults = Math.max(0, adults + delta);
        document.getElementById("adults-count").textContent = adults;
    } else if (type === "kids") {
        kids = Math.max(0, kids + delta);
        document.getElementById("kids-count").textContent = kids;
    }
    calc();
}

// ================================
// SET DURATION
// ================================
function setDur(button, hoursValue, label) {
    // Remove "on" class from all duration buttons
    document.querySelectorAll(".db").forEach(btn => {
        btn.classList.remove("on");
    });
    // Add "on" class to clicked button
    button.classList.add("on");
    // Update global variables
    hours = hoursValue;
    durationLabel = label;
    calc();
}

// ================================
// CALCULATE AND UPDATE PRICES
// ================================
function calc() {
    // Calculate totals
    const adultTotal = adults * hours * 25;
    const kidTotal = kids * hours * 15;
    const total = adultTotal + kidTotal;

    // Update total display
    const totalElement = document.getElementById("total");
    totalElement.textContent = formatPrice(total);

    // Build price-lines HTML
    const priceLines = document.getElementById("price-lines");
    priceLines.innerHTML = "";

    if (adults > 0) {
        const adultLine = document.createElement("div");
        adultLine.className = "price-line";
        adultLine.innerHTML = `
            <span>${adults} adult${adults > 1 ? "s" : ""} × ${durationLabel}</span>
            <span>${formatPrice(adultTotal)}</span>
        `;
        priceLines.appendChild(adultLine);
    }

    if (kids > 0) {
        const kidLine = document.createElement("div");
        kidLine.className = "price-line";
        kidLine.innerHTML = `
            <span>${kids} kid${kids > 1 ? "s" : ""} × ${durationLabel}</span>
            <span>${formatPrice(kidTotal)}</span>
        `;
        priceLines.appendChild(kidLine);
    }

    // Add total line if both types present
    if (adults > 0 && kids > 0) {
        const totalLine = document.createElement("div");
        totalLine.className = "price-line";
        totalLine.style.borderTop = "1px solid rgba(0, 194, 224, 0.12)";
        totalLine.style.paddingTop = "8px";
        totalLine.style.marginTop = "8px";
        totalLine.innerHTML = `
            <span><strong>Total</strong></span>
            <span><strong>${formatPrice(total)}</strong></span>
        `;
        priceLines.appendChild(totalLine);
    }
}

// ================================
// FORMAT PRICE HELPER
// ================================
function formatPrice(amount) {
    // Round to 2 decimal places
    const rounded = Math.round(amount * 100) / 100;
    // Format with 2 decimal places
    let formatted = rounded.toFixed(2);
    // Strip .00 if whole number
    if (formatted.endsWith(".00")) {
        formatted = formatted.slice(0, -3);
    }
    return "$" + formatted;
}

// ================================
// HANDLE BOOKING SUBMISSION
// ================================
function handleBook() {
    // Get form values
    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;

    // Validate all fields are filled
    if (!name || !phone || !email || !date || !time) {
        alert("Please fill in all fields (name, phone, email, date, and time).");
        return;
    }

    // Validate at least 1 passenger total
    if (adults + kids < 1) {
        alert("Please select at least 1 passenger (adult or kid).");
        return;
    }

    // If valid, show success alert
    alert("Redirecting to secure payment... (Stripe coming soon!)");
    // In a real implementation, this would redirect to Stripe checkout
}

// ================================
// PAGE INITIALIZATION
// ================================
document.addEventListener("DOMContentLoaded", function() {
    const today = new Date().toISOString().split("T")[0];
    document.getElementById("date").setAttribute("min", today);

    initTimeSlots();
    calc();
    initSmoothScroll();
    initScrollFadeIn();
    initNavbarScroll();
});

// ================================
// SMOOTH SCROLL
// ================================
const NAVBAR_OFFSET = 80;

function scrollToElement(el) {
    if (!el) return;
    const top = el.offsetTop - NAVBAR_OFFSET;
    window.scrollTo({ top: top, behavior: "smooth" });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", function(e) {
            const targetId = this.getAttribute("href");
            if (!targetId || targetId === "#") return;

            const el = document.querySelector(targetId);
            if (!el) return;

            e.preventDefault();
            scrollToElement(el);
        });
    });

    window.smoothScroll = function(selector) {
        scrollToElement(document.querySelector(selector));
    };
}

// ================================
// SCROLL FADE-IN
// ================================
function initScrollFadeIn() {
    const fadeElements = document.querySelectorAll(".fade-in");
    if (!fadeElements.length) return;

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    fadeElements.forEach(el => observer.observe(el));
}

// ================================
// NAVBAR SCROLL EFFECT
// ================================
function initNavbarScroll() {
    const nav = document.querySelector(".navbar");
    if (!nav) return;

    window.addEventListener("scroll", () => {
        if (window.scrollY > 20) {
            nav.classList.add("scrolled");
        } else {
            nav.classList.remove("scrolled");
        }
    });
}
