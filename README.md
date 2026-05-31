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

## Next Steps

Once the website is live, the following integrations will be added:

### 1. **Stripe Integration**
- Replace the "Stripe coming soon!" alert with a real Stripe checkout modal
- Securely process credit card payments
- Store transaction records

### 2. **EmailJS Integration**
- Send booking confirmation emails to customers
- Notify admins of new bookings with full details
- Automated reminder emails 24 hours before ride

### 3. **Deployment**
- Deploy to **Netlify** for free hosting
- Set up a custom domain (cabpark.nyc or similar)
- Enable automatic deployments from GitHub

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
