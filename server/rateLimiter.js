const requests = new Map();

function rateLimit(userId) {
    const now = Date.now();
    const windowMs = 60_000; // 1 minute
    const limit = 5;

    if (!requests.has(userId)) {
        requests.set(userId, []);    //Agar user pehli baar request kar raha hai:

// Map mein entry nahi hogi

// Isliye uske liye empty array bana diya
    }

    const timestamps = requests
        .get(userId)
        .filter(t => now - t < windowMs);

    if (timestamps.length >= limit) {
        return false;
    }

    timestamps.push(now);
    requests.set(userId, timestamps);
    return true;
}

module.exports = { rateLimit };
