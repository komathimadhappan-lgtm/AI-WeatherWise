
const {
    generateSummary,
    generateRecommendation,
    generateRiskAssessment
} = require('../services/aiService');


// ==========================================
// AI WEATHER SUMMARY
// ==========================================

const getWeatherSummary = async (req, res) => {

    try {

        const {
            city,
            temperature,
            humidity,
            condition
        } = req.body;


        if (
            !city ||
            temperature === undefined ||
            humidity === undefined ||
            !condition
        ) {

            return res.status(400).json({

                success: false,

                message:
                    'Please provide all fields: city, temperature, humidity, and condition'

            });
        }


        const summary =
            await generateSummary(
                city,
                Number(temperature),
                Number(humidity),
                condition
            );


        return res.json({

            success: true,

            summary

        });


    } catch (error) {

        console.error(
            'Error in getWeatherSummary:',
            error.message
        );


        return res.status(500).json({

            success: false,

            message:
                'Server error while generating weather summary'

        });
    }
};




// ==========================================
// AI WEATHER RECOMMENDATION
// ==========================================

const getWeatherRecommendation = async (req, res) => {

    try {

        const {
            temperature,
            condition
        } = req.body;


        if (
            temperature === undefined ||
            !condition
        ) {

            return res.status(400).json({

                success: false,

                message:
                    'Please provide all fields: temperature and condition'

            });
        }


        const recommendation =
            await generateRecommendation(
                Number(temperature),
                condition
            );


        return res.json({

            success: true,

            recommendation

        });


    } catch (error) {

        console.error(
            'Error in getWeatherRecommendation:',
            error.message
        );


        return res.status(500).json({

            success: false,

            message:
                'Server error while generating weather recommendations'

        });
    }
};




// ==========================================
// AI WEATHER RISK ASSESSMENT
// ==========================================

const getWeatherRisk = async (req, res) => {

    try {

        const {
            temperature,
            humidity,
            condition
        } = req.body;


        if (
            temperature === undefined ||
            humidity === undefined ||
            !condition
        ) {

            return res.status(400).json({

                success: false,

                message:
                    'Please provide all fields: temperature, humidity, and condition'

            });
        }


        const risk =
            await generateRiskAssessment(
                Number(temperature),
                Number(humidity),
                condition
            );


        return res.json({

            success: true,

            risk

        });


    } catch (error) {

        console.error(
            'Error in getWeatherRisk:',
            error.message
        );


        return res.status(500).json({

            success: false,

            message:
                'Server error while generating weather risk'

        });
    }
};




// ==========================================
// EXPORT
// ==========================================

module.exports = {

    getWeatherSummary,

    getWeatherRecommendation,

    getWeatherRisk

};
