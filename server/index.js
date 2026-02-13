const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const open = require("open").default;

const { rateLimit } = require("./rateLimiter");
const { buildLogoPrompt } = require("./promptBuilder");

dotenv.config();

const app = express();
app.use(express.json());

// ✅ Serve frontend files
app.use(express.static(path.join(__dirname, "public")));

// ✅ Home route -> index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ✅ AI Logo Generator API
app.post("/generate-logo", async (req, res) => {
    const userId = req.ip;

    // Rate limiting
    if (!rateLimit(userId)) {
        return res.status(429).json({ error: "Too many requests. Slow down." });
    }

    const { idea } = req.body;
    if (!idea) {
        return res.status(400).json({ error: "Logo idea required" });
    }

    const prompt = buildLogoPrompt(idea);

    try {
        const hfResponse = await fetch(
            "https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-xl-base-1.0",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.HF_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ inputs: prompt })
            }
        );

        // ❗ HF error handling
        if (!hfResponse.ok) {
            const errorText = await hfResponse.text();
            console.error("HF Error:", errorText);
            return res.status(500).json({ error: "HF model error" });
        }

        // ✅ Image response
        const buffer = Buffer.from(await hfResponse.arrayBuffer());

        // HF returns WEBP mostly
        res.set("Content-Type", "image/webp");
        res.send(buffer);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Image generation failed" });
    }
});

// ✅ Start server + auto open browser
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    open(`http://localhost:${PORT}`);
});
