// ===============================
// WEATHER DASHBOARD
// ===============================


// ===============================
// SEARCH WEATHER
// ===============================

async function searchWeather() {

    const cityInput =
        document.getElementById("cityInput");

    const city =
        cityInput.value.trim();


    // Check empty input

    if (city === "") {

        showError(
            "Please enter a city name."
        );

        return;
    }


    // Hide previous error

    hideError();


    // Show loading message

    showLoading();


    try {

        // ===============================
        // STEP 1: FIND CITY
        // ===============================

        const locationUrl =
            "https://geocoding-api.open-meteo.com/v1/search"
            + "?name="
            + encodeURIComponent(city)
            + "&count=1"
            + "&language=en"
            + "&format=json";


        const locationResponse =
            await fetch(locationUrl);


        if (!locationResponse.ok) {

            throw new Error(
                "Location service is unavailable."
            );

        }


        const locationData =
            await locationResponse.json();


        // Check city result

        if (
            !locationData.results ||
            locationData.results.length === 0
        ) {

            hideLoading();

            showError(
                "City not found. Please enter a valid city name."
            );

            return;
        }


        const location =
            locationData.results[0];


        const latitude =
            location.latitude;

        const longitude =
            location.longitude;



        // ===============================
        // STEP 2: GET WEATHER
        // ===============================

        const weatherUrl =
            "https://api.open-meteo.com/v1/forecast"
            + "?latitude="
            + latitude
            + "&longitude="
            + longitude
            + "&current="
            + "temperature_2m,"
            + "relative_humidity_2m,"
            + "apparent_temperature,"
            + "weather_code,"
            + "wind_speed_10m"
            + "&daily="
            + "weather_code,"
            + "temperature_2m_max,"
            + "temperature_2m_min"
            + "&timezone=auto"
            + "&forecast_days=5";


        const weatherResponse =
            await fetch(weatherUrl);


        if (!weatherResponse.ok) {

            throw new Error(
                "Weather service is unavailable."
            );

        }


        const weatherData =
            await weatherResponse.json();


        // Check weather data

        if (
            !weatherData.current ||
            !weatherData.daily
        ) {

            throw new Error(
                "Weather data could not be loaded."
            );

        }



        // ===============================
        // DISPLAY CURRENT WEATHER
        // ===============================

        displayWeather(
            location,
            weatherData
        );



        // ===============================
        // DISPLAY FORECAST
        // ===============================

        displayForecast(
            weatherData
        );



        // ===============================
        // DISPLAY TRAVEL SUGGESTIONS
        // ===============================

        displayTravelSuggestions(
            weatherData.current.weather_code,
            weatherData.current.temperature_2m
        );


        // Hide loading

        hideLoading();

    }


    catch (error) {

        console.error(
            "Weather Error:",
            error
        );


        hideLoading();


        showError(
            error.message ||
            "Unable to load weather information."
        );

    }

}



// ===============================
// DISPLAY CURRENT WEATHER
// ===============================

function displayWeather(
    location,
    data
) {

    const current =
        data.current;


    // City name

    document.getElementById(
        "cityName"
    ).textContent =
        `${location.name}, ${location.country_code || ""}`;


    // Temperature

    document.getElementById(
        "temperature"
    ).textContent =
        `${Math.round(
            current.temperature_2m
        )}°C`;


    // Weather description

    document.getElementById(
        "weatherDescription"
    ).textContent =
        getWeatherDescription(
            current.weather_code
        );


    // Weather icon

    document.getElementById(
        "weatherIcon"
    ).textContent =
        getWeatherIcon(
            current.weather_code
        );


    // Humidity

    document.getElementById(
        "humidity"
    ).textContent =
        `${current.relative_humidity_2m}%`;


    // Wind speed

    document.getElementById(
        "windSpeed"
    ).textContent =
        `${Math.round(
            current.wind_speed_10m
        )} km/h`;


    // Feels like

    document.getElementById(
        "feelsLike"
    ).textContent =
        `${Math.round(
            current.apparent_temperature
        )}°C`;


    // Date

    const date =
        new Date();


    document.getElementById(
        "weatherDate"
    ).textContent =
        date.toLocaleDateString(
            "en-IN",
            {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );

}



// ===============================
// WEATHER DESCRIPTION
// ===============================

function getWeatherDescription(code) {

    const descriptions = {

        0: "Clear sky",

        1: "Mainly clear",

        2: "Partly cloudy",

        3: "Overcast",

        45: "Foggy",

        48: "Depositing rime fog",

        51: "Light drizzle",

        53: "Moderate drizzle",

        55: "Dense drizzle",

        61: "Light rain",

        63: "Moderate rain",

        65: "Heavy rain",

        71: "Light snow",

        73: "Moderate snow",

        75: "Heavy snow",

        80: "Light rain showers",

        81: "Moderate rain showers",

        82: "Violent rain showers",

        95: "Thunderstorm",

        96: "Thunderstorm with hail",

        99: "Thunderstorm with heavy hail"

    };


    return descriptions[code] ||
        "Unknown weather";

}



// ===============================
// WEATHER ICON
// ===============================

function getWeatherIcon(code) {

    if (code === 0) {

        return "☀️";

    }


    if (
        code === 1 ||
        code === 2
    ) {

        return "🌤️";

    }


    if (code === 3) {

        return "☁️";

    }


    if (
        code === 45 ||
        code === 48
    ) {

        return "🌫️";

    }


    if (
        code >= 51 &&
        code <= 55
    ) {

        return "🌦️";

    }


    if (
        code >= 61 &&
        code <= 65
    ) {

        return "🌧️";

    }


    if (
        code >= 71 &&
        code <= 75
    ) {

        return "❄️";

    }


    if (
        code >= 80 &&
        code <= 82
    ) {

        return "🌦️";

    }


    if (
        code >= 95 &&
        code <= 99
    ) {

        return "⛈️";

    }


    return "🌤️";

}



// ===============================
// DISPLAY FORECAST
// ===============================

function displayForecast(data) {

    const forecastContainer =
        document.getElementById(
            "forecastContainer"
        );


    forecastContainer.innerHTML = "";


    const daily =
        data.daily;


    for (
        let i = 0;
        i < daily.time.length;
        i++
    ) {

        const date =
            new Date(
                daily.time[i]
            );


        const dayName =
            date.toLocaleDateString(
                "en-IN",
                {
                    weekday: "short"
                }
            );


        const icon =
            getWeatherIcon(
                daily.weather_code[i]
            );


        const description =
            getWeatherDescription(
                daily.weather_code[i]
            );


        const card =
            document.createElement(
                "div"
            );


        card.className =
            "forecast-card";


        card.innerHTML = `

            <h3>
                ${dayName}
            </h3>

            <div class="forecast-icon">
                ${icon}
            </div>

            <div class="forecast-temp">
                ${Math.round(
                    daily.temperature_2m_max[i]
                )}°C
            </div>

            <p>
                Low:
                ${Math.round(
                    daily.temperature_2m_min[i]
                )}°C
            </p>

            <p class="forecast-description">
                ${description}
            </p>

        `;


        forecastContainer.appendChild(
            card
        );

    }

}



// ===============================
// TRAVEL SUGGESTIONS
// ===============================

function displayTravelSuggestions(
    weatherCode,
    temperature
) {

    const container =
        document.getElementById(
            "travelSuggestions"
        );


    let suggestions = [];


    // Rain

    if (
        weatherCode >= 51 &&
        weatherCode <= 82
    ) {

        suggestions = [

            {
                icon: "☔",
                title: "Carry an Umbrella",
                text:
                    "Rain is expected. Carry an umbrella or raincoat."
            },

            {
                icon: "🏛️",
                title: "Try Indoor Attractions",
                text:
                    "Museums, malls and indoor attractions are good choices."
            },

            {
                icon: "👟",
                title: "Wear Suitable Shoes",
                text:
                    "Choose comfortable footwear suitable for wet conditions."
            }

        ];

    }


    // Hot weather

    else if (
        temperature >= 35
    ) {

        suggestions = [

            {
                icon: "🧴",
                title: "Carry Sunscreen",
                text:
                    "The weather is hot. Apply sunscreen before going outdoors."
            },

            {
                icon: "💧",
                title: "Stay Hydrated",
                text:
                    "Carry enough drinking water during your journey."
            },

            {
                icon: "🕶️",
                title: "Use Sun Protection",
                text:
                    "Sunglasses and a hat can help protect you from strong sunlight."
            }

        ];

    }


    // Cold weather

    else if (
        temperature < 15
    ) {

        suggestions = [

            {
                icon: "🧥",
                title: "Carry Warm Clothes",
                text:
                    "Temperatures are low, so carry a jacket or warm clothing."
            },

            {
                icon: "☕",
                title: "Enjoy Indoor Activities",
                text:
                    "Cafes and indoor attractions can make your trip comfortable."
            },

            {
                icon: "🥾",
                title: "Plan Outdoor Activities",
                text:
                    "Choose suitable timings for outdoor exploration."
            }

        ];

    }


    // Pleasant weather

    else {

        suggestions = [

            {
                icon: "🚶",
                title: "Explore Outdoors",
                text:
                    "The weather looks pleasant for outdoor sightseeing."
            },

            {
                icon: "📸",
                title: "Perfect for Photography",
                text:
                    "Take advantage of the comfortable weather and capture memories."
            },

            {
                icon: "🌳",
                title: "Visit Outdoor Attractions",
                text:
                    "Parks, beaches and outdoor attractions are great options today."
            }

        ];

    }


    container.innerHTML = "";


    suggestions.forEach(
        function(suggestion) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "travel-card";


            card.innerHTML = `

                <div class="travel-icon">
                    ${suggestion.icon}
                </div>

                <div>

                    <h3>
                        ${suggestion.title}
                    </h3>

                    <p>
                        ${suggestion.text}
                    </p>

                </div>

            `;


            container.appendChild(
                card
            );

        }
    );

}



// ===============================
// ERROR HANDLING
// ===============================

function showError(message) {

    const errorMessage =
        document.getElementById(
            "errorMessage"
        );


    errorMessage.textContent =
        message;


    errorMessage.style.display =
        "block";

}



function hideError() {

    const errorMessage =
        document.getElementById(
            "errorMessage"
        );


    errorMessage.style.display =
        "none";

}



// ===============================
// LOADING
// ===============================

function showLoading() {

    const loadingMessage =
        document.getElementById(
            "loadingMessage"
        );


    loadingMessage.style.display =
        "block";

}



function hideLoading() {

    const loadingMessage =
        document.getElementById(
            "loadingMessage"
        );


    loadingMessage.style.display =
        "none";

}



// ===============================
// ENTER KEY SEARCH
// ===============================

document
    .getElementById("cityInput")
    .addEventListener(
        "keydown",
        function(event) {

            if (event.key === "Enter") {

                searchWeather();

            }

        }
    );