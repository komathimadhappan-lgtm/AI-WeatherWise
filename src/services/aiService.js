
const { GoogleGenerativeAI } = require('@google/generative-ai');


// ==========================================
// LOCAL WEATHER SUMMARY
// ==========================================

const generateLocalSummary = (
    city,
    temperature,
    humidity,
    condition
) => {

    const tempWord =
        temperature >= 30
            ? 'warm'
            : temperature <= 15
                ? 'chilly'
                : 'pleasant';


    const humidityWord =
        humidity >= 70
            ? 'high'
            : humidity <= 40
                ? 'low'
                : 'moderate';


    return `Today's weather in ${city} is ${tempWord} and ${condition.toLowerCase()} with ${humidityWord} humidity.`;
};




// ==========================================
// LOCAL WEATHER RECOMMENDATION
// ==========================================

const generateLocalRecommendation = (
    temperature,
    condition
) => {

    const recs = [];

    const condLower =
        condition.toLowerCase();


    if (temperature >= 30) {

        recs.push('stay hydrated');
        recs.push('wear light cotton clothes');

        if (
            condLower.includes('sunny') ||
            condLower.includes('clear')
        ) {
            recs.push(
                'avoid outdoor activities during peak afternoon hours'
            );
        }

    } else if (temperature <= 15) {

        recs.push('wear warm layers');
        recs.push('keep hot drinks nearby');

    } else {

        recs.push(
            'enjoy the comfortable temperature'
        );

        recs.push(
            'great day for outdoor plans'
        );
    }


    if (
        condLower.includes('rain') ||
        condLower.includes('drizzle') ||
        condLower.includes('thunderstorm')
    ) {

        recs.push(
            'remember to carry an umbrella or raincoat'
        );

    } else if (
        condLower.includes('cloud') ||
        condLower.includes('overcast')
    ) {

        recs.push(
            'a light jacket might be handy'
        );

    } else if (
        condLower.includes('snow')
    ) {

        recs.push(
            'watch out for slippery roads and stay warm'
        );
    }


    if (recs.length === 0) {

        recs.push(
            'dress comfortably for the current conditions'
        );
    }


    const sentence =
        recs.slice(0, -1).join(', ') +
        (recs.length > 1 ? ', and ' : '') +
        recs.slice(-1);


    return (
        sentence.charAt(0).toUpperCase() +
        sentence.slice(1) +
        '.'
    );
};




// ==========================================
// LOCAL WEATHER RISK
// ==========================================

const generateLocalRisk = (
    temperature,
    humidity,
    condition
) => {

    let riskScore = 10;

    const condLower =
        condition.toLowerCase();


    // Temperature risk
    if (temperature >= 40) {

        riskScore += 45;

    } else if (temperature >= 35) {

        riskScore += 30;

    } else if (temperature >= 30) {

        riskScore += 15;

    } else if (temperature <= 10) {

        riskScore += 30;
    }


    // Humidity risk
    if (humidity >= 85) {

        riskScore += 25;

    } else if (humidity >= 70) {

        riskScore += 15;
    }


    // Weather condition risk
    if (
        condLower.includes('thunderstorm') ||
        condLower.includes('storm')
    ) {

        riskScore += 30;

    } else if (
        condLower.includes('heavy rain')
    ) {

        riskScore += 25;

    } else if (
        condLower.includes('rain') ||
        condLower.includes('drizzle')
    ) {

        riskScore += 15;
    }


    // Maximum score = 100
    riskScore =
        Math.min(riskScore, 100);


    let riskLevel;
    let alert;


    if (riskScore >= 70) {

        riskLevel = 'High Risk';

        alert =
            'Severe weather conditions detected. Avoid unnecessary outdoor activities and take appropriate precautions.';

    } else if (riskScore >= 40) {

        riskLevel = 'Moderate Risk';

        alert =
            'Weather conditions require caution. Stay prepared and monitor the weather before outdoor activities.';

    } else {

        riskLevel = 'Low Risk';

        alert =
            'Weather conditions are generally safe for normal activities.';
    }


    return {
        riskScore,
        riskLevel,
        alert
    };
};




// ==========================================
// AI WEATHER SUMMARY
// ==========================================

const generateSummary = async (
    city,
    temperature,
    humidity,
    condition
) => {

    const apiKey =
        process.env.GEMINI_API_KEY;


    if (
        !apiKey ||
        apiKey === 'your_gemini_api_key' ||
        apiKey.trim() === ''
    ) {

        console.log(
            '[AIService] Using rule-based fallback for weather summary'
        );

        return generateLocalSummary(
            city,
            temperature,
            humidity,
            condition
        );
    }


    try {

        const genAI =
            new GoogleGenerativeAI(apiKey);


        const model =
            genAI.getGenerativeModel({
                model: 'gemini-2.5-flash'
            });


        const prompt = `
Generate a concise weather summary (maximum 1-2 sentences) for the following weather conditions:

City: ${city}
Temperature: ${temperature}°C
Humidity: ${humidity}%
Condition: ${condition}

Response format should be simple, natural, and directly describe the current feel. Do not include markdown formatting.
`;


        const result =
            await model.generateContent(prompt);


        const response =
            await result.response;


        const text =
            response.text().trim();


        return (
            text ||
            generateLocalSummary(
                city,
                temperature,
                humidity,
                condition
            )
        );


    } catch (error) {

        console.error(
            '[AIService] Gemini API error generating summary:',
            error.message
        );


        return generateLocalSummary(
            city,
            temperature,
            humidity,
            condition
        );
    }
};




// ==========================================
// AI WEATHER RECOMMENDATION
// ==========================================

const generateRecommendation = async (
    temperature,
    condition
) => {

    const apiKey =
        process.env.GEMINI_API_KEY;


    if (
        !apiKey ||
        apiKey === 'your_gemini_api_key' ||
        apiKey.trim() === ''
    ) {

        console.log(
            '[AIService] Using rule-based fallback for weather recommendation'
        );

        return generateLocalRecommendation(
            temperature,
            condition
        );
    }


    try {

        const genAI =
            new GoogleGenerativeAI(apiKey);


        const model =
            genAI.getGenerativeModel({
                model: 'gemini-2.5-flash'
            });


        const prompt = `
Provide actionable personalized recommendations (maximum 1-2 sentences, e.g., clothing, hydration, activities) based on these weather conditions:

Temperature: ${temperature}°C
Condition: ${condition}

Response format should be natural, friendly, and practical. Do not include markdown formatting.
`;


        const result =
            await model.generateContent(prompt);


        const response =
            await result.response;


        const text =
            response.text().trim();


        return (
            text ||
            generateLocalRecommendation(
                temperature,
                condition
            )
        );


    } catch (error) {

        console.error(
            '[AIService] Gemini API error generating recommendation:',
            error.message
        );


        return generateLocalRecommendation(
            temperature,
            condition
        );
    }
};




// ==========================================
// AI WEATHER RISK
// ==========================================

const generateRiskAssessment = async (
    temperature,
    humidity,
    condition
) => {

    const apiKey =
        process.env.GEMINI_API_KEY;


    // Fallback if Gemini API key is unavailable
    if (
        !apiKey ||
        apiKey === 'your_gemini_api_key' ||
        apiKey.trim() === ''
    ) {

        console.log(
            '[AIService] Using rule-based fallback for weather risk'
        );

        return generateLocalRisk(
            temperature,
            humidity,
            condition
        );
    }


    try {

        const genAI =
            new GoogleGenerativeAI(apiKey);


        const model =
            genAI.getGenerativeModel({
                model: 'gemini-2.5-flash'
            });


        const prompt = `
Analyze the weather risk based on these conditions:

Temperature: ${temperature}°C
Humidity: ${humidity}%
Condition: ${condition}

Return ONLY valid JSON in this exact format:

{
  "riskScore": 0,
  "riskLevel": "Low Risk",
  "alert": "Short safety message"
}

Risk score must be between 0 and 100.
Risk levels must be only:
Low Risk
Moderate Risk
High Risk

Do not include markdown or code fences.
`;


        const result =
            await model.generateContent(prompt);


        const response =
            await result.response;


        const text =
            response.text().trim();


        const cleanText =
            text
                .replace(/```json/g, '')
                .replace(/```/g, '')
                .trim();


        const riskData =
            JSON.parse(cleanText);


        return {
            riskScore:
                Math.min(
                    Math.max(
                        Number(riskData.riskScore),
                        0
                    ),
                    100
                ),

            riskLevel:
                riskData.riskLevel,

            alert:
                riskData.alert
        };


    } catch (error) {

        console.error(
            '[AIService] Gemini API error generating risk:',
            error.message
        );


        return generateLocalRisk(
            temperature,
            humidity,
            condition
        );
    }
};




// ==========================================
// EXPORT
// ==========================================

module.exports = {

    generateSummary,

    generateRecommendation,

    generateRiskAssessment

};

