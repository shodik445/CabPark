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
// BOOKING HELPERS
// ================================
function getConfig() {
    return window.CABPARK_CONFIG || {};
}

function getBookingTotal() {
    return adults * hours * 25 + kids * hours * 15;
}

function getBookingData() {
    return {
        name: document.getElementById("name").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        email: document.getElementById("email").value.trim(),
        date: document.getElementById("date").value,
        time: document.getElementById("time").value,
        adults,
        kids,
        hours,
        durationLabel,
        total: getBookingTotal(),
        totalFormatted: formatPrice(getBookingTotal()),
        siteUrl: getConfig().siteUrl || window.location.origin,
    };
}

function showBookingAlert(message, type) {
    const alertEl = document.getElementById("booking-alert");
    if (!alertEl) return;
    alertEl.textContent = message;
    alertEl.className = `booking-alert ${type}`;
    alertEl.hidden = false;
}

function buildBookingSummary(booking) {
    return [
        `New CabPark booking`,
        ``,
        `Name: ${booking.name}`,
        `Email: ${booking.email}`,
        `Phone: ${booking.phone}`,
        `Date: ${booking.date}`,
        `Time: ${booking.time}`,
        `Adults: ${booking.adults}`,
        `Kids: ${booking.kids}`,
        `Duration: ${booking.durationLabel}`,
        `Total: ${booking.totalFormatted}`,
    ].join("\n");
}

function isEmailConfigured() {
    const { emailjs, ownerEmail } = getConfig();
    return (
        emailjs &&
        emailjs.publicKey &&
        emailjs.serviceId &&
        emailjs.templateId &&
        ownerEmail
    );
}

function isStripeConfigured() {
    return Boolean(getConfig().stripeCheckoutEndpoint);
}

async function sendOwnerEmail(booking) {
    if (!isEmailConfigured()) {
        throw new Error(
            "Email is not configured. Add your EmailJS keys and ownerEmail in js/config.js"
        );
    }

    const cfg = getConfig();
    const emailJsClient = window.emailjs;

    if (!emailJsClient) {
        throw new Error("EmailJS failed to load. Check your internet connection.");
    }

    emailJsClient.init(cfg.emailjs.publicKey);

    await emailJsClient.send(cfg.emailjs.serviceId, cfg.emailjs.templateId, {
        to_email: cfg.ownerEmail,
        reply_to: booking.email,
        customer_name: booking.name,
        customer_email: booking.email,
        customer_phone: booking.phone,
        ride_date: booking.date,
        ride_time: booking.time,
        adults: booking.adults,
        kids: booking.kids,
        duration: booking.durationLabel,
        total: booking.totalFormatted,
        booking_summary: buildBookingSummary(booking),
    });
}

async function startStripeCheckout(booking) {
    if (!isStripeConfigured()) {
        throw new Error(
            "Stripe is not configured. Set stripeCheckoutEndpoint in js/config.js and deploy to Netlify."
        );
    }

    const response = await fetch(getConfig().stripeCheckoutEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(booking),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || "Could not start payment.");
    }

    window.location.href = data.url;
}

// ================================
// HANDLE BOOKING SUBMISSION
// ================================
async function handleBook() {
    const checkoutBtn = document.getElementById("checkout-btn");
    const booking = getBookingData();

    if (!booking.name || !booking.phone || !booking.email || !booking.date || !booking.time) {
        showBookingAlert("Please fill in all fields (name, phone, email, date, and time).", "error");
        return;
    }

    if (adults + kids < 1) {
        showBookingAlert("Please select at least 1 passenger (adult or kid).", "error");
        return;
    }

    if (booking.total < 1) {
        showBookingAlert("Total must be at least $1.", "error");
        return;
    }

    const originalLabel = checkoutBtn.textContent;
    checkoutBtn.disabled = true;
    checkoutBtn.textContent = "Processing…";
    document.getElementById("booking-alert").hidden = true;

    try {
        await sendOwnerEmail(booking);

        if (isStripeConfigured()) {
            checkoutBtn.textContent = "Redirecting to payment…";
            await startStripeCheckout(booking);
            return;
        }

        showBookingAlert(
            "Booking sent! You will receive payment instructions soon. (Add Stripe in config to enable online checkout.)",
            "success"
        );
    } catch (err) {
        showBookingAlert(err.message || "Something went wrong. Please try again.", "error");
    } finally {
        checkoutBtn.disabled = false;
        checkoutBtn.textContent = originalLabel;
    }
}

function handleBookingQueryParams() {
    const params = new URLSearchParams(window.location.search);
    if (params.get("booking") === "success") {
        showBookingAlert("Payment successful! We will see you in Central Park.", "success");
    } else if (params.get("booking") === "cancelled") {
        showBookingAlert("Payment was cancelled. Your booking email may still have been sent.", "error");
    }
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
    handleBookingQueryParams();
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
