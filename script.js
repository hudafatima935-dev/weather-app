
const searchBtn = document.getElementById("searchBtn");

searchBtn.addEventListener("click", getWeather);


function changeBackground(code) {

    const body = document.body;

    body.classList.remove(
        "sunny", "cloudy", "rainy",
        "snowy", "stormy", "foggy"
    );

    if (code === 0) {
        body.classList.add("sunny");
    }
    else if ([1, 2, 3].includes(code)) {
        body.classList.add("cloudy");
    }
    else if ([45, 48].includes(code)) {
        body.classList.add("foggy");
    }
    else if ([51, 53, 55, 56, 57, 61, 63, 65,
              66, 67, 80, 81, 82].includes(code)) {
        body.classList.add("rainy");
    }
    else if ([71, 73, 75, 77, 85, 86].includes(code)) {
        body.classList.add("snowy");
    }
    else if ([95, 96, 99].includes(code)) {
        body.classList.add("stormy");
    }
    else {
        body.classList.add("cloudy");
    }
}








async function getWeather() {

    const city = document.getElementById("cityInput").value.trim();

    const message = document.getElementById("message");
    const weatherInfo = document.getElementById("weatherInfo");

    if (city === "") {
        message.textContent = "Please enter a city name!";
        weatherInfo.style.display = "none";
        return;
    }

    message.textContent = "Loading weather...";
    weatherInfo.style.display = "none";

    try {

        

        const geoURL = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

        const geoResponse = await fetch(geoURL);
        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City not found!");
        }

        const latitude = geoData.results[0].latitude;
        const longitude = geoData.results[0].longitude;
        await loadForecast(latitude, longitude);
        
        const cityName = geoData.results[0].name;

       

        const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,is_day`;

        const weatherResponse = await fetch(weatherURL);
        const weatherData = await weatherResponse.json();

        const current = weatherData.current;

        //weather info

        document.getElementById("cityName").textContent = cityName;

        document.getElementById("temperature").textContent =
            current.temperature_2m + " °C";

        document.getElementById("humidity").textContent =
            current.relative_humidity_2m;

        //Weather conditions and icons

        let condition = "";
        let icon = "";

        const code = current.weather_code;

        if (code === 0) {
            condition = "Sunny";
            icon = "☀️";
        }
        else if ([1, 2].includes(code)) {
            condition = "Partly Cloudy";
            icon = "🌤️";
        }
        else if (code === 3) {
            condition = "Cloudy";
            icon = "☁️";
        }
        else if ([45, 48].includes(code)) {
            condition = "Foggy";
            icon = "🌫️";
        }
        else if ([51, 53, 55, 56, 57].includes(code)) {
            condition = "Drizzle";
            icon = "🌦️";
        }
        else if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
            condition = "Rainy";
            icon = "🌧️";
        }
        else if ([71, 73, 75, 77, 85, 86].includes(code)) {
            condition = "Snowy";
            icon = "❄️";
        }
        else if ([95, 96, 99].includes(code)) {
            condition = "Thunderstorm";
            icon = "⛈️";
        }
        else {
            condition = "Unknown";
            icon = "🌡️";
        }

        document.getElementById("condition").textContent = condition;
        document.getElementById("weatherIcon").textContent = icon;



        changeBackground(code);

        message.textContent = "";
        weatherInfo.style.display = "block";

    }

    catch (error) {

        message.textContent = error.message === "City not found!"
            ? "City not found! Please try another city."
            : "Unable to get weather. Please try again.";

        weatherInfo.style.display = "none";

    }
}
   document.getElementById("cityInput").addEventListener("keypress", function(event) {
     if (event.key === "Enter") {
        getWeather();
     }
});
document.getElementById("locationBtn").addEventListener("click", function() {

    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(async function(position) {

            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            await loadForecast(latitude, longitude);
            try {

                const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,is_day`;

                const response = await fetch(url);
                const data = await response.json();

                document.getElementById("cityName").textContent = "Your Location";

                document.getElementById("temperature").textContent =
                    data.current.temperature_2m + " °C";

                document.getElementById("humidity").textContent =
                    data.current.relative_humidity_2m;

                document.getElementById("message").textContent = "";

                document.getElementById("weatherInfo").style.display = "block";

                // Use the same weather icon logic from getWeather()
                const code = data.current.weather_code;
                let condition = "";
                let icon = "";

                if (code === 0) {
                    condition = "Sunny";
                    icon = "☀️";
                } else if ([1, 2].includes(code)) {
                    condition = "Partly Cloudy";
                    icon = "🌤️";
                } else if (code === 3) {
                    condition = "Cloudy";
                    icon = "☁️";
                } else if ([45, 48].includes(code)) {
                    condition = "Foggy";
                    icon = "🌫️";
                } else if ([51, 53, 55, 56, 57].includes(code)) {
                    condition = "Drizzle";
                    icon = "🌦️";
                } else if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
                    condition = "Rainy";
                    icon = "🌧️";
                } else if ([71, 73, 75, 77, 85, 86].includes(code)) {
                    condition = "Snowy";
                    icon = "❄️";
                } else if ([95, 96, 99].includes(code)) {
                    condition = "Thunderstorm";
                    icon = "⛈️";
                } else {
                    condition = "Unknown";
                    icon = "🌡️";
                }

                document.getElementById("condition").textContent = condition;
                document.getElementById("weatherIcon").textContent = icon;

                changeBackground(code);

            } catch (error) {
                document.getElementById("message").textContent =
                    "Unable to get your weather. Please try again.";
            }

        }, function() {
            document.getElementById("message").textContent =
                "Location permission denied or unavailable.";
        });

    } else {
        document.getElementById("message").textContent =
            "Geolocation is not supported by your browser.";
    }

});


async function loadForecast(latitude, longitude) {

    const forecastSection = document.getElementById("forecastSection");
    const forecastContainer = document.getElementById("forecastContainer");

    forecastContainer.innerHTML = "Loading forecast...";
    forecastSection.style.display = "block";

    try {

        const forecastURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=5&timezone=auto`;

        const response = await fetch(forecastURL);

        if (!response.ok) {
            throw new Error("Forecast could not be loaded");
        }

        const data = await response.json();

        const days = data.daily.time;
        const maxTemps = data.daily.temperature_2m_max;
        const minTemps = data.daily.temperature_2m_min;
        const codes = data.daily.weather_code;

        forecastContainer.innerHTML = "";

        for (let i = 0; i < days.length; i++) {

            const date = new Date(days[i] + "T12:00:00");
            const dayName = date.toLocaleDateString("en-US", {
                weekday: "short"
            });

            let icon = "🌤️";

            if (codes[i] === 0) {
                icon = "☀️";
            }
            else if ([1, 2].includes(codes[i])) {
                icon = "🌤️";
            }
            else if (codes[i] === 3) {
                icon = "☁️";
            }
            else if ([45, 48].includes(codes[i])) {
                icon = "🌫️";
            }
            else if ([51, 53, 55, 56, 57, 61, 63, 65,
                      66, 67, 80, 81, 82].includes(codes[i])) {
                icon = "🌧️";
            }
            else if ([71, 73, 75, 77, 85, 86].includes(codes[i])) {
                icon = "❄️";
            }
            else if ([95, 96, 99].includes(codes[i])) {
                icon = "⛈️";
            }

            forecastContainer.innerHTML += `
                <div class="forecast-day">

                    <p>${dayName}</p>

                    <div class="forecast-icon">${icon}</div>

                    <p>${Math.round(maxTemps[i])}°C</p>

                    <p>${Math.round(minTemps[i])}°C</p>

                </div>
            `;
        }

    }
    catch (error) {

        forecastContainer.textContent =
            "Unable to load forecast. Please try again.";

    }
}
