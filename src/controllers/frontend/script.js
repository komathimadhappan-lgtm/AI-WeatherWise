
const API_BASE_URL = "http://localhost:5001";


async function getWeather() {

    const city =
        document.getElementById("cityInput").value.trim();

    const loading =
        document.getElementById("loading");

    const weatherCard =
        document.getElementById("weatherCard");

    const errorMessage =
        document.getElementById("errorMessage");


    if (!city) {
        errorMessage.textContent =
            "Please enter a city name.";
        return;
    }


    loading.style.display = "block";
    errorMessage.textContent = "";


    try {

        const response = await fetch(
            `${API_BASE_URL}/api/weather/${encodeURIComponent(city)}`
        );


        const result = await response.json();


        if (!response.ok) {
            throw new Error(
                result.message ||
                "Unable to get weather"
            );
        }


        console.log(
            "Weather API Response:",
            result
        );


        const weatherData =
            result.data || result;


        document.getElementById("cityName").textContent =
            city;


        document.getElementById("temperature").textContent =
            weatherData.temperature ?? "--";


        document.getElementById("condition").textContent =
            weatherData.condition ?? "--";


        document.getElementById("humidity").textContent =
            weatherData.humidity ?? "--";


        weatherCard.style.display = "block";


        // AI Weather Recommendation
        await getAIRecommendation(
            weatherData.temperature,
            weatherData.condition
        );


        // AI Weather Summary
        await getAIWeatherSummary(
            city,
            weatherData.temperature,
            weatherData.humidity,
            weatherData.condition
        );


        // AI Weather Risk Assessment
        await getAIWeatherRisk(
            weatherData.temperature,
            weatherData.humidity,
            weatherData.condition
        );


    } catch (error) {

        console.error(
            "Weather Error:",
            error
        );

        errorMessage.textContent =
            error.message;

    } finally {

        loading.style.display = "none";

    }
}




// ==========================================
// AI WEATHER RECOMMENDATION
// ==========================================

async function getAIRecommendation(
    temperature,
    condition
) {

    const recommendation =
        document.getElementById("recommendation");


    const token =
        localStorage.getItem("token");


    if (!token) {

        recommendation.textContent =
            "Please login to get AI weather recommendations.";

        return;
    }


    try {

        const response = await fetch(
            `${API_BASE_URL}/api/ai/weather-recommendation`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },

                body: JSON.stringify({
                    temperature:
                        Number(temperature),

                    condition:
                        condition
                })
            }
        );


        const result =
            await response.json();


        console.log(
            "AI Recommendation:",
            result
        );


        if (!response.ok) {

            throw new Error(
                result.message ||
                "AI recommendation failed"
            );

        }


        const aiData =
            result.data || result;


        recommendation.textContent =
            aiData.recommendation ||
            result.recommendation ||
            "No recommendation available.";


    } catch (error) {

        console.error(
            "AI Error:",
            error
        );


        recommendation.textContent =
            "Unable to generate AI recommendation.";

    }
}




// ==========================================
// AI WEATHER SUMMARY
// ==========================================

async function getAIWeatherSummary(
    city,
    temperature,
    humidity,
    condition
) {

    const summaryElement =
        document.getElementById("weatherSummary");


    const token =
        localStorage.getItem("token");


    if (!summaryElement) {
        return;
    }


    if (!token) {

        summaryElement.textContent =
            "Please login to get AI weather summary.";

        return;
    }


    try {

        const response = await fetch(
            `${API_BASE_URL}/api/ai/weather-summary`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },

                body: JSON.stringify({
                    city: city,

                    temperature:
                        Number(temperature),

                    humidity:
                        Number(humidity),

                    condition:
                        condition
                })
            }
        );


        const result =
            await response.json();


        console.log(
            "AI Weather Summary:",
            result
        );


        if (!response.ok) {

            throw new Error(
                result.message ||
                "AI weather summary failed"
            );

        }


        summaryElement.textContent =
            result.summary ||
            "No weather summary available.";


    } catch (error) {

        console.error(
            "AI Summary Error:",
            error
        );


        summaryElement.textContent =
            "Unable to generate AI weather summary.";

    }
}




// ==========================================
// AI WEATHER RISK ASSESSMENT
// ==========================================

async function getAIWeatherRisk(
    temperature,
    humidity,
    condition
) {

    const riskScore =
        document.getElementById("riskScore");

    const riskLevel =
        document.getElementById("riskLevel");

    const riskAlert =
        document.getElementById("riskAlert");


    const token =
        localStorage.getItem("token");


    if (!riskScore || !riskLevel || !riskAlert) {
        return;
    }


    if (!token) {

        riskScore.textContent = "--";
        riskLevel.textContent = "--";

        riskAlert.textContent =
            "Please login to get AI weather risk assessment.";

        return;
    }


    try {

        const response = await fetch(
            `${API_BASE_URL}/api/ai/weather-risk`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },

                body: JSON.stringify({
                    temperature:
                        Number(temperature),

                    humidity:
                        Number(humidity),

                    condition:
                        condition
                })
            }
        );


        const result =
            await response.json();


        console.log(
            "AI Weather Risk:",
            result
        );


        if (!response.ok) {

            throw new Error(
                result.message ||
                "AI weather risk failed"
            );

        }


        riskScore.textContent =
            result.risk.riskScore + "%";


        riskLevel.textContent =
            result.risk.riskLevel;


        riskAlert.textContent =
            result.risk.alert;


    } catch (error) {

        console.error(
            "AI Risk Error:",
            error
        );


        riskScore.textContent =
            "--";


        riskLevel.textContent =
            "--";


        riskAlert.textContent =
            "Unable to assess weather risk.";

    }
}




// ==========================================
// SAVE LOCATION
// ==========================================

async function saveLocation() {

    const locationInput =
        document.getElementById("locationInput");


    const locationMessage =
        document.getElementById("locationMessage");


    const location =
        locationInput.value.trim();


    const token =
        localStorage.getItem("token");


    if (!token) {

        locationMessage.textContent =
            "Please login first.";

        return;
    }


    if (!location) {

        locationMessage.textContent =
            "Please enter a location.";

        return;
    }


    try {

        const response = await fetch(
            `${API_BASE_URL}/api/locations`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },

                body: JSON.stringify({
                    location: location
                })
            }
        );


        const result =
            await response.json();


        console.log(
            "Save Location Response:",
            result
        );


        if (!response.ok) {

            throw new Error(
                result.message ||
                "Failed to save location"
            );

        }


        locationMessage.textContent =
            "Location saved successfully!";


        locationInput.value = "";


        await loadSavedLocations();


    } catch (error) {

        console.error(
            "Save Location Error:",
            error
        );


        locationMessage.textContent =
            error.message;

    }
}




// ==========================================
// LOAD SAVED LOCATIONS
// ==========================================

async function loadSavedLocations() {

    const savedLocations =
        document.getElementById("savedLocations");


    const token =
        localStorage.getItem("token");


    if (!savedLocations) {
        return;
    }


    if (!token) {

        savedLocations.textContent =
            "Please login to view saved locations.";

        return;
    }


    try {

        const response = await fetch(
            `${API_BASE_URL}/api/locations`,
            {
                method: "GET",

                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );


        const result =
            await response.json();


        console.log(
            "Saved Locations Response:",
            result
        );


        if (!response.ok) {

            throw new Error(
                result.message ||
                "Failed to load locations"
            );

        }


        const locations =
            result.data || [];


        if (locations.length === 0) {

            savedLocations.innerHTML =
                "<p>No saved locations yet.</p>";

            return;
        }


        savedLocations.innerHTML = "";


        locations.forEach((item) => {

            const locationDiv =
                document.createElement("div");


            locationDiv.style.display =
                "flex";


            locationDiv.style.justifyContent =
                "space-between";


            locationDiv.style.alignItems =
                "center";


            locationDiv.style.padding =
                "10px";


            locationDiv.style.marginBottom =
                "10px";


            locationDiv.style.background =
                "rgba(255,255,255,0.1)";


            locationDiv.style.borderRadius =
                "8px";


            const locationName =
                item.location ||
                item.name ||
                item.city ||
                "Unknown Location";


            locationDiv.innerHTML = `

                <span
                    onclick="searchSavedLocation('${locationName}')"
                    style="cursor:pointer;"
                >
                    📍 ${locationName}
                </span>


                <button
                    onclick="deleteLocation('${item._id}')"
                    style="
                        padding:8px 12px;
                        border:none;
                        border-radius:6px;
                        background:#ff6b6b;
                        color:white;
                        cursor:pointer;
                    "
                >
                    Delete
                </button>

            `;


            savedLocations.appendChild(
                locationDiv
            );

        });


    } catch (error) {

        console.error(
            "Load Locations Error:",
            error
        );


        savedLocations.textContent =
            "Unable to load saved locations.";

    }
}




// ==========================================
// DELETE LOCATION
// ==========================================

async function deleteLocation(id) {

    const token =
        localStorage.getItem("token");


    if (!token) {

        alert(
            "Please login first."
        );

        return;
    }


    try {

        const response = await fetch(
            `${API_BASE_URL}/api/locations/${id}`,
            {
                method: "DELETE",

                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );


        const result =
            await response.json();


        console.log(
            "Delete Location Response:",
            result
        );


        if (!response.ok) {

            throw new Error(
                result.message ||
                "Failed to delete location"
            );

        }


        alert(
            "Location deleted successfully!"
        );


        await loadSavedLocations();


    } catch (error) {

        console.error(
            "Delete Location Error:",
            error
        );


        alert(
            error.message
        );

    }
}




// ==========================================
// SEARCH SAVED LOCATION
// ==========================================

function searchSavedLocation(city) {

    document.getElementById(
        "cityInput"
    ).value = city;


    getWeather();

}




// ==========================================
// LOGOUT
// ==========================================

function logout() {

    localStorage.removeItem(
        "token"
    );


    window.location.href =
        "login.html";

}




// ==========================================
// PAGE LOAD
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadSavedLocations();

    }
);

