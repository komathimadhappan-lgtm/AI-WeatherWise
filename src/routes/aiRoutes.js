const express = require('express');

const router = express.Router();

const {
    getWeatherSummary,
    getWeatherRecommendation,
    getWeatherRisk
} = require('../controllers/aiController');

const { protect } = require('../middleware/authMiddleware');


// JWT Authentication
router.use(protect);


// AI Weather Summary
router.post('/weather-summary', getWeatherSummary);


// AI Weather Recommendation
router.post('/weather-recommendation', getWeatherRecommendation);


// AI Weather Risk Assessment
router.post('/weather-risk', getWeatherRisk);


module.exports = router;