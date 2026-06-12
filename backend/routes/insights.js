const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const auth = require('../middleware/auth');
const Activity = require('../models/Activity');
const Insight = require('../models/Insight');
const User = require('../models/User');

const router = express.Router();

// All routes require authentication
router.use(auth);

// POST /api/insights/generate - Generate AI-powered insights
router.post('/generate', async (req, res) => {
  try {
    // 1. Get activities from last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const activities = await Activity.find({
      userId: req.user._id,
      date: { $gte: sevenDaysAgo },
    }).sort({ date: -1 });

    // 2. Get user's monthly goal
    const user = await User.findById(req.user._id);
    const monthlyGoalKg = user.monthlyGoalKg;

    if (activities.length === 0) {
      return res.status(400).json({
        error: 'No activities found in the past 7 days. Log some activities first.',
      });
    }

    // Prepare activity data for the prompt
    const activityData = activities.map((a) => ({
      category: a.category,
      type: a.type,
      quantity: a.quantity,
      unit: a.unit,
      co2Kg: a.co2Kg,
      date: a.date.toISOString().split('T')[0],
    }));

    // 3. Call Gemini API
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are an environmental coach. Here is the user's activity data for the past 7 days: ${JSON.stringify(activityData)}. Their monthly CO₂ goal is ${monthlyGoalKg} kg. Respond ONLY in JSON with this format: { "summary": "string (2-3 sentences)", "tips": ["3 strings, each a specific actionable tip based on their actual data"], "worstCategory": "string", "projectedMonthlyKg": number }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 4. Parse the JSON response from Gemini
    // Clean up the response in case it's wrapped in markdown code blocks
    const cleanedText = text
      .replace(/```json\s*/g, '')
      .replace(/```\s*/g, '')
      .trim();

    let parsedInsight;
    try {
      parsedInsight = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', text);
      return res.status(500).json({
        error: 'Failed to parse AI response. Please try again.',
      });
    }

    // 5. Save as new Insight document
    // Calculate start of current week (Monday)
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const weekOf = new Date(now);
    weekOf.setDate(now.getDate() - diffToMonday);
    weekOf.setHours(0, 0, 0, 0);

    const insight = await Insight.create({
      userId: req.user._id,
      weekOf,
      summary: parsedInsight.summary,
      tips: parsedInsight.tips,
      worstCategory: parsedInsight.worstCategory,
      projectedMonthlyKg: parsedInsight.projectedMonthlyKg,
    });

    res.status(201).json(insight);
  } catch (error) {
    console.error('Generate insights error:', error.message);
    res.status(500).json({ error: 'Failed to generate insights.' });
  }
});

// GET /api/insights/latest - Get the most recent insight
router.get('/latest', async (req, res) => {
  try {
    const insight = await Insight.findOne({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.json(insight || null);
  } catch (error) {
    console.error('Get latest insight error:', error.message);
    res.status(500).json({ error: 'Failed to fetch latest insight.' });
  }
});

module.exports = router;
