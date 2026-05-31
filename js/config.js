// Copy from config.example.js and fill in your keys.
// EmailJS: https://www.emailjs.com/  |  Stripe: https://dashboard.stripe.com/
window.CABPARK_CONFIG = {
    emailjs: {
        publicKey: "",
        serviceId: "",
        templateId: "",
    },
    // Your email — receives new booking notifications
    ownerEmail: "",
    // Netlify function URL (use "/.netlify/functions/create-checkout" when deployed on Netlify)
    stripeCheckoutEndpoint: "",
    // Used for Stripe success/cancel redirects (set to your live URL, e.g. https://cabpark.netlify.app)
    siteUrl: window.location.origin,
};
