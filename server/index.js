const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const fetch = require("node-fetch");

const { rateLimit } = require("./rateLimiter");
const { buildLogoPrompt } = require("./promptBuilder");

dotenv.config();

const app = express();

app.use(express.json());

// Serve frontend files
app.use(express.static(path.join(__dirname, "public")));

// Home Route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Generate Logo API
app.post("/generate-logo", async (req, res) => {

    const userId = req.ip;

    // Rate limiting
    if (!rateLimit(userId)) {
        return res.status(429).json({
            error: "Too many requests. Slow down."
        });
    }

    const { idea } = req.body;

    // Validation
    if (!idea) {
        return res.status(400).json({
            error: "Logo idea required"
        });
    }

    // Create AI prompt
    const prompt = buildLogoPrompt(idea);

    try {

        // Hugging Face API request
        const hfResponse = await fetch(
            "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell",
            {
                method: "POST",

                headers: {
                    Authorization: `Bearer ${process.env.HF_API_KEY}`,
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    // Prompt
                    inputs: prompt,

                    // Optional generation settings
                    parameters: {
                        num_inference_steps: 5
                    }
                })
            }
        );

        // Handle HF errors
        if (!hfResponse.ok) {

            const errorText = await hfResponse.text();

            console.error("HF Error:", errorText);

            return res.status(500).json({
                error: "HF model error"
            });
        }

        // Convert response into binary buffer
        const buffer = Buffer.from(
            await hfResponse.arrayBuffer()
        );

        // Set image type
        res.set("Content-Type", "image/png");

        // Send image to frontend
        res.send(buffer);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: "Image generation failed"
        });
    }
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});