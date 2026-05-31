const Stripe = require("stripe");

exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "STRIPE_SECRET_KEY is not configured on Netlify." }),
        };
    }

    let booking;
    try {
        booking = JSON.parse(event.body);
    } catch {
        return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON body." }) };
    }

    const total = Number(booking.total);
    if (!total || total < 1) {
        return { statusCode: 400, body: JSON.stringify({ error: "Invalid booking total." }) };
    }

    const origin =
        event.headers.origin ||
        (event.headers.referer || "").replace(/\/[^/]*$/, "") ||
        booking.siteUrl ||
        "http://localhost:8888";

    const stripe = new Stripe(secretKey);

    try {
        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            customer_email: booking.email,
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        unit_amount: Math.round(total * 100),
                        product_data: {
                            name: "CabPark ride",
                            description: `${booking.durationLabel} · ${booking.adults} adult(s), ${booking.kids} kid(s)`,
                        },
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                customer_name: booking.name || "",
                customer_phone: booking.phone || "",
                ride_date: booking.date || "",
                ride_time: booking.time || "",
                adults: String(booking.adults ?? 0),
                kids: String(booking.kids ?? 0),
                duration: booking.durationLabel || "",
            },
            success_url: `${origin}/?booking=success`,
            cancel_url: `${origin}/?booking=cancelled`,
        });

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: session.url }),
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message || "Stripe error" }),
        };
    }
};
