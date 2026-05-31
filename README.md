# CabPark – Bicycle Taxi in Central Park

A modern, futuristic booking website for CabPark, your private bicycle taxi service in Central Park, NYC.

## What is CabPark?

CabPark offers premium bicycle taxi experiences in Central Park. Explore iconic locations at your own pace with our experienced drivers. Whether it's a quick 30-minute tour or an all-day adventure, we've got you covered.

- **Hours:** 8am–8pm daily
- **Pricing:** Adults $25/hr · Kids $15/hr
- **Minimum booking:** 30 minutes
- **Meet-up points:** 6 convenient locations across Central Park

## Tech Stack

This is a **vanilla web application** built with:
- **HTML5** — semantic markup
- **CSS3** — custom properties, CSS Grid, Flexbox, dark theme with futuristic design
- **JavaScript (ES6)** — DOM manipulation, event handling, price calculations
- **Google Fonts** — Space Grotesk & JetBrains Mono

**No frameworks, no build tools** — just plain, efficient code.

## How to Run Locally

1. **Clone or download** this repository
2. **Open `index.html`** in your browser
   - Simply double-click `index.html` or drag it into your browser
   - No server required!
3. **Book a ride** — fill out the form and see the price update in real time

## Features

✨ **Full booking form** with name, phone, email, date, and time selection
👥 **Passenger counter** for adults and kids with live pricing
⏱️ **Duration selector** with 9 options from 30 min to 8 hrs
💰 **Real-time price breakdown** showing itemized costs per passenger type
📍 **Meet-up point selection** with 6 major Central Park locations
🎨 **Futuristic dark theme** with cyan and purple accents
📱 **Fully responsive** design for mobile, tablet, and desktop
⌨️ **Form validation** with helpful error messages

## Email & payment setup

When a customer books, you get an **email** (EmailJS) and they are sent to **Stripe Checkout** (Netlify function).

### 1. EmailJS (booking emails to you)

1. Create a free account at [emailjs.com](https://www.emailjs.com/)
2. Add an **Email Service** (Gmail, etc.)
3. Create an **Email Template** with variables:
   - `{{to_email}}`, `{{customer_name}}`, `{{customer_email}}`, `{{customer_phone}}`
   - `{{ride_date}}`, `{{ride_time}}`, `{{adults}}`, `{{kids}}`, `{{duration}}`, `{{total}}`
   - `{{booking_summary}}` (full text block)
4. Set **To Email** in the template to `{{to_email}}`
5. Copy your Public Key, Service ID, and Template ID into `js/config.js`:

```js
emailjs: {
  publicKey: "your_public_key",
  serviceId: "your_service_id",
  templateId: "your_template_id",
},
ownerEmail: "your-email@gmail.com",
```

### 2. Stripe (online payment)

1. Create a [Stripe](https://dashboard.stripe.com/) account
2. Deploy this site to **Netlify** (drag-and-drop or Git)
3. In Netlify → **Site settings → Environment variables**, add:
   - `STRIPE_SECRET_KEY` = your Stripe secret key (starts with `sk_`)
4. In `js/config.js` set:

```js
stripeCheckoutEndpoint: "/.netlify/functions/create-checkout",
siteUrl: "https://your-site.netlify.app",
```

5. Run locally with Netlify CLI for full payment testing:

```bash
npm install
npx netlify dev
```

Open the URL Netlify prints (usually `http://localhost:8888`).

### 3. Local testing without Netlify

- Fill in **EmailJS** only → booking sends you an email, no card payment
- Use **Stripe test keys** and `netlify dev` to test the full checkout flow

## File Structure

```
cabpark/
├── index.html          # Main HTML page with all sections
├── css/
│   └── style.css       # All styling, colors, responsive design
├── js/
│   └── main.js         # Booking logic, price calculations, form handling
└── README.md           # This file
```

## Design Highlights

- **Dark background:** `#050d1a` (very dark navy)
- **Accent cyan:** `#00e5ff`
- **Accent purple:** `#a78bfa`
- **Grid background:** Subtle 48×48px grid pattern
- **Fonts:** Space Grotesk (body), JetBrains Mono (labels, monospace)
- **Flat aesthetic:** No gradients, blur, or glow effects

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

**Made with ❤️ for Central Park bicycle enthusiasts.**

© 2026 CabPark · Central Park Bicycle Taxi · New York City
