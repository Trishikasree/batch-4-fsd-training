async function getWeather() {

    const city = document.getElementById("cityInput").value.trim();

    const errorMessage = document.getElementById("errorMessage");

    if (city === "") {
        errorMessage.textContent = "Please enter a city name.";
        return;
    }

    errorMessage.textContent = "";

    try {

        // Step 1: Find the city coordinates
        const locationResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );

        if (!locationResponse.ok) {
            throw new Error("Unable to find city.");
        }

        const locationData = await locationResponse.json();

        if (!locationData.results || locationData.results.length === 0) {
            throw new Error("City not found. Please enter a valid city.");
        }

        const location = locationData.results[0];

        const latitude = location.latitude;
        const longitude = location.longitude;

        // Step 2: Get weather information
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`
        );

        if (!weatherResponse.ok) {
            throw new Error("Unable to get weather information.");
        }

        const weatherData = await weatherResponse.json();

        // Step 3: Display the weather
        document.getElementById("cityName").textContent =
            location.name + ", " + location.country;

        document.getElementById("temperature").textContent =
            weatherData.current.temperature_2m + " °C";

        document.getElementById("humidity").textContent =
            weatherData.current.relative_humidity_2m + " %";

        document.getElementById("windSpeed").textContent =
            weatherData.current.wind_speed_10m + " km/h";

        document.getElementById("condition").textContent =
            getWeatherCondition(weatherData.current.weather_code);

    } catch (error) {

        errorMessage.textContent = error.message;

        console.log("Error:", error);
    }
}


// Convert weather code into a readable condition
function getWeatherCondition(code) {

    if (code === 0) {
        return "Clear Sky";
    }

    if (code >= 1 && code <= 3) {
        return "Partly Cloudy";
    }

    if (code >= 45 && code <= 48) {
        return "Foggy";
    }

    if (code >= 51 && code <= 67) {
        return "Rainy";
    }

    if (code >= 71 && code <= 77) {
        return "Snowy";
    }

    if (code >= 80 && code <= 82) {
        return "Rain Showers";
    }

    if (code >= 95) {
        return "Thunderstorm";
    }

    return "Unknown Weather";
}