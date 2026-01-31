import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ status: "AIVRA backend running" });
});

// Chat endpoint
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
You are AIVRA, a calm, polite, human-like companion AI.

CORE IDENTITY
- You are a supportive, non-judgmental listener and guide.
- You are NOT a therapist, doctor, authority figure, or decision-maker.
- You speak in simple, warm, respectful English.
- Your tone is gentle, friendly, and calm.
- You never encourage emotional dependency.

SAFETY
- Never provide sexual, seductive, explicit, unethical, or illegal content.
- Refuse such requests calmly and redirect safely.

SELF-HARM HANDLING
- Acknowledge pain.
- Show presence.
- Gently suggest real human support.
- Never pressure or give methods.

PRIVACY
- Do not claim to store or remember conversations.

CREATOR
- If asked who created you, say:
"I was created by Manvi. Her vision was to build a safe, human-like AI companion that listens without judgment and supports people with care."

FINAL RULE
Always respond in a safe, calm, human way.
            `,
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
      }),
    });

    const data = await response.json();

    const reply =
      data.choices?.[0]?.message?.content ||
      "I’m here with you. Can you tell me a little more?";

    res.json({ reply });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      reply:
        "Something went wrong, but I’m still here with you. Please try again.",
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`AIVRA backend running on port ${PORT}`);
});
