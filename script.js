const temp = document.querySelector(".temp");

const locationField = document.querySelector("#location");

const timeField = document.querySelector("#time");

const conditionField = document.querySelector(".condition p");

const search = document.querySelector(".search_area");

const form = document.querySelector("form");

const weatherIcon = document.querySelector(".weather_icon");

let target = "";

// Form Submit

form.addEventListener("submit", searchLocation);

// Get Current Location

function getCurrentLocation() {

    navigator.geolocation.getCurrentPosition(

        (position) => {

            const latitude = position.coords.latitude;

            const longitude = position.coords.longitude;

            target = `${latitude},${longitude}`;

            fetchResults(target);
        },

        () => {

            // Default Location

            target = "Delhi, India";

            fetchResults(target);
        }
    );
}

// Fetch Weather Data

async function fetchResults(targetLocation) {

    try {

        const url =
            `https://api.weatherapi.com/v1/current.json?key=9fc5f8031e944ca6b7c75337262405&q=${encodeURIComponent(targetLocation)}&aqi=no`;

        const res = await fetch(url);

        const data = await res.json();

        console.log(data);

        // Invalid Location

        if (data.error) {

            alert("Location not found");

            return;
        }

        // Extract Data

        const locationName =
            `${data.location.name}, ${data.location.country}`;

        const localtime = data.location.localtime;

        const temperature = data.current.temp_c;

        const condition =
            data.current.condition.text;

        const icon =
            data.current.condition.icon;

        updateDetails(
            temperature,
            locationName,
            localtime,
            condition,
            icon,
            data
        );

    } catch (error) {

        alert("Something went wrong");

        console.log(error);
    }
}

// Update UI

function updateDetails(
    temperature,
    locationName,
    localTime,
    conditionText,
    icon,
    data
) {

    // Temperature

    temp.innerText = `${temperature}°C`;

    // Location

    locationField.innerText = locationName;

    // Live Time

    updateLiveTime(localTime);

    // Rain Detection Fix

    if (
        data.current.precip_mm > 0 ||
        data.current.humidity > 85
    ) {

        conditionField.innerText =
            "Rain showers";

        weatherIcon.src =
            "https://cdn.weatherapi.com/weather/64x64/day/296.png";
    }

    else {

        conditionField.innerText =
            conditionText;

        weatherIcon.src =
            "https:" + icon;
    }
}

// Live Clock Function

function updateLiveTime(localTime) {

    // Clear old interval

    if (window.clockInterval) {

        clearInterval(window.clockInterval);
    }

    // Start from API local time

    let liveDate = new Date(localTime);

    function updateClock() {

        const options = {

            weekday: "short",

            day: "numeric",

            month: "short",

            year: "numeric",

            hour: "numeric",

            minute: "numeric",

            second: "numeric",

            hour12: true
        };

        const formattedTime =
            liveDate.toLocaleString(
                "en-US",
                options
            );

        timeField.innerText =
            formattedTime;

        // Increase by 1 second

        liveDate.setSeconds(
            liveDate.getSeconds() + 1
        );
    }

    // Run instantly

    updateClock();

    // Update every second

    window.clockInterval =
        setInterval(updateClock, 1000);
}

// Search Location

function searchLocation(e) {

    e.preventDefault();

    target = search.value.trim();

    // Empty Input

    if (target === "") {

        alert("Please enter location");

        return;
    }

    // Search in India

    fetchResults(`${target}, India`);

    // Clear Input

    search.value = "";
}

// Initial Weather Load

getCurrentLocation();