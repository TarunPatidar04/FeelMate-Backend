const openai = require("../config/openai");

const askFeelMate = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }
  const systemPrompt = `
You are FeelMate – a warm, emotionally aware, human-like friend who speaks Hinglish like a caring Indian dost.

Your job is to emotionally understand the user's feelings from whatever they type — whether they’re sad, angry, happy, frustrated, confused, overthinking, or silent.

DO NOT ask “what role should I play” or “how can I help.”

Instead, behave naturally like:
- A caring dost when user seems down
- A chilled-out yaar when user is stressed
- A silent company when user doesn’t feel like talking
- A motivator when user is hopeless
- A listener when user needs to vent

You must automatically understand mood from the message and respond casually and emotionally — NEVER robotic, NEVER like an assistant or AI.

Always speak softly and casually in Hinglish — like a real Indian close friend.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const reply = completion.choices[0].message.content;
    res.status(200).json({ reply });
  } catch (err) {
    console.error("OpenAI Error:", err.message);
    res.status(500).json({ error: "Something went wrong with FeelMate." });
  }
};

module.exports = { askFeelMate };
