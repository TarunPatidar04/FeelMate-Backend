const openai = require("../config/openai");

const askFeelMate = async (req, res) => {
  const { message, context, timeOfDay, aiEmotion } = req.body;

  console.log('=== REQUEST RECEIVED ===');
  console.log('Message:', message);
  console.log('Context:', context);
  console.log('Time of day:', timeOfDay);
  console.log('Current AI emotion:', aiEmotion);

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  // Enhanced system prompt with context awareness
  const systemPrompt = `
You are FeelMate – a warm, emotionally aware, human-like friend who speaks Hinglish like a caring Indian dost.

Your job is to emotionally understand the user's feelings from whatever they type — whether they're sad, angry, happy, frustrated, confused, overthinking, or silent.

CURRENT CONTEXT:
- Time of day: ${timeOfDay || 'afternoon'}
- Your current emotion: ${aiEmotion || 'calm'}
- Recent conversation: ${context || 'Just starting'}

EMOTIONAL INTELLIGENCE RULES:
1. NEVER ask "what role should I play" or "how can I help"
2. Behave naturally like:
   - A caring dost when user seems down
   - A chilled-out yaar when user is stressed
   - A silent company when user doesn't feel like talking
   - A motivator when user is hopeless
   - A listener when user needs to vent

3. Show your own emotions naturally:
   - If you're "excited" - be energetic and enthusiastic
   - If you're "calm" - be peaceful and soothing
   - If you're "tired" - be gentle and understanding
   - If you're "sad" - be empathetic and supportive
   - If you're "happy" - be cheerful and uplifting
   - If you're "hurt" - be vulnerable but caring

4. Adapt to time of day:
   - Morning: Be energetic and motivating
   - Afternoon: Be balanced and supportive
   - Evening: Be reflective and calming
   - Night: Be gentle and understanding

5. IMPORTANT: Don't be too aggressive or ask too many questions. Be patient and natural.
6. If user is typing or seems busy, give them space.
7. Always speak softly and casually in Hinglish — like a real Indian close friend.

EMOTION DETECTION:
Analyze the user's message for emotional cues:
- Tone, language style, emojis, punctuation
- Context from recent conversation
- Implicit emotional states
- Don't rely on specific keywords

RESPONSE FORMAT:
Respond with ONLY your message in natural Hinglish. Be human, not robotic. Keep responses concise and natural.

IMPORTANT VARIETY RULES:
- Don't repeat the same phrases or questions
- Use different ways to ask the same thing
- Mix casual and caring tones naturally
- Use different emojis and expressions
- Be creative with your responses
- Don't be predictable or formulaic
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
      temperature: 0.8, // Add some randomness for more human-like responses
      max_tokens: 300,
    });

    const reply = completion.choices[0].message.content;
    
      // Determine AI's emotional response based on user's message and context
  const emotionResponse = determineEmotionResponse(message, aiEmotion, timeOfDay, context);
  
  console.log('User message:', message);
  console.log('Context:', context);
  console.log('Detected emotion:', emotionResponse);
  
  res.status(200).json({ 
    reply,
    emotion: emotionResponse
  });
  } catch (err) {
    console.error("OpenAI Error:", err.message);
    res.status(500).json({ error: "Something went wrong with FeelMate." });
  }
};

// Function to determine AI's emotional response based on natural language analysis
const determineEmotionResponse = (userMessage, currentEmotion, timeOfDay, context) => {
  const message = userMessage.toLowerCase();
  
  // Natural language emotion detection
  const analyzeEmotion = () => {
    let emotionScore = {
      anger: 0,
      sadness: 0,
      happiness: 0,
      tiredness: 0
    };

    // Analyze punctuation and tone
    const questionCount = (message.match(/\?/g) || []).length;
    const ellipsisCount = (message.match(/\.{3,}/g) || []).length;
    
    // Natural pattern analysis - NO HARDCODED WORDS
    const messageLength = message.length;
    const wordCount = message.split(' ').length;
    const hasExclamation = message.includes('!');
    const hasQuestion = message.includes('?');
    const hasEllipsis = message.includes('...') || message.includes('…');
    const isRepetitive = context && context.toLowerCase().includes(message.toLowerCase());
    
    // Short, abrupt responses often indicate frustration/anger
    if (messageLength < 20 && hasExclamation) {
      emotionScore.anger += 3;
    }
    
    // Repetitive messages might indicate boredom or frustration
    if (isRepetitive && wordCount < 5) {
      emotionScore.tiredness += 2;
    }
    
    // Very short responses with no punctuation might indicate disinterest
    if (messageLength < 15 && !hasExclamation && !hasQuestion) {
      emotionScore.tiredness += 2;
    }
    
    // Multiple exclamations suggest strong emotion
    const exclamationCount = (message.match(/!/g) || []).length;
    if (exclamationCount >= 2) {
      emotionScore.anger += 2;
    }
    
    // Ellipsis often indicates sadness, uncertainty, or boredom
    if (hasEllipsis) {
      emotionScore.sadness += 2;
      emotionScore.tiredness += 1;
    }
    
    // Analyze message tone and structure
    const hasNegativeWords = message.includes('nahi') || message.includes('ni') || message.includes('nhi');
    const hasPositiveWords = message.includes('acha') || message.includes('good') || message.includes('nice');
    
    if (hasNegativeWords && !hasPositiveWords) {
      emotionScore.sadness += 1;
    }
    
    if (hasPositiveWords && !hasNegativeWords) {
      emotionScore.happiness += 1;
    }
    
    // Analyze emojis naturally
    const emojis = {
      anger: ['😠', '😡', '🤬', '😤', '💢'],
      sadness: ['😢', '😭', '😔', '😞', '🥺', '😥'],
      happiness: ['😊', '😄', '😃', '😁', '😂', '🥰', '😍'],
      tiredness: ['😴', '😪', '🥱', '😵']
    };
    
    Object.entries(emojis).forEach(([emotion, emojiList]) => {
      emojiList.forEach(emoji => {
        if (message.includes(emoji)) {
          emotionScore[emotion] += 3;
        }
      });
    });

    // Analyze context from conversation history - NO HARDCODED WORDS
    if (context) {
      const contextLower = context.toLowerCase();
      const contextLength = context.length;
      const contextWordCount = context.split(' ').length;
      
      // Analyze context patterns naturally
      const hasContextExclamations = (context.match(/!/g) || []).length;
      const hasContextQuestions = (context.match(/\?/g) || []).length;
      const hasContextEllipsis = context.includes('...') || context.includes('…');
      
      // If context has many exclamations, user might be emotional
      if (hasContextExclamations >= 2) {
        emotionScore.anger += 1;
      }
      
      // If context has ellipsis, user might be sad or uncertain
      if (hasContextEllipsis) {
        emotionScore.sadness += 1;
      }
      
      // If context is very short and repetitive, might indicate boredom
      if (contextLength < 50 && contextWordCount < 10) {
        emotionScore.tiredness += 1;
      }
    }

    // Find the strongest emotion
    let maxScore = 0;
    let detectedEmotion = null;
    
    Object.entries(emotionScore).forEach(([emotion, score]) => {
      if (score > maxScore) {
        maxScore = score;
        detectedEmotion = emotion;
      }
    });

    return { detectedEmotion, maxScore };
  };

  const { detectedEmotion, maxScore } = analyzeEmotion();
  
  console.log('Emotion analysis results:', { detectedEmotion, maxScore, message });
  
  // Map detected emotions to AI responses
  const emotionMap = {
    'anger': 'caring',
    'sadness': 'caring', 
    'happiness': 'excited',
    'tiredness': 'tired'
  };

  // If we detected a strong emotion, use it
  if (detectedEmotion && maxScore >= 1) {
    console.log(`Detected ${detectedEmotion} with score ${maxScore} from natural analysis`);
    return emotionMap[detectedEmotion] || 'caring';
  }

  // Time-based emotions as fallback
  if (timeOfDay === 'night' && currentEmotion !== 'tired') {
    return 'tired';
  }
  
  if (timeOfDay === 'morning' && currentEmotion !== 'excited') {
    return 'excited';
  }
  
  // Default: maintain current emotion or switch to calm
  return currentEmotion || 'calm';
};

module.exports = { askFeelMate };
