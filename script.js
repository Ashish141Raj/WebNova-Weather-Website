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

        const condition = data.current.condition.text;

        updateDetails(
            temperature,
            locationName,
            localtime,
            condition
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
    conditionText
) {

    // Temperature

    temp.innerText = `${temperature}°C`;

    // Location

    locationField.innerText = locationName;

    // Live Time

    updateLiveTime(localTime);

    // Weather Condition

    conditionField.innerText = conditionText;

    // Weather Icons

    if (conditionText === "Sunny") {

        weatherIcon.src =
            "https://cdn-icons-png.flaticon.com/512/869/869869.png";
    }

    else if (
        conditionText === "Cloudy" ||
        conditionText === "Partly cloudy"
    ) {

        weatherIcon.src =
            "https://cdn-icons-png.flaticon.com/512/414/414825.png";
    }

    else if (
        conditionText === "Rain" ||
        conditionText === "Light rain" ||
        conditionText === "Moderate rain"
    ) {

        weatherIcon.src =
            "https://cdn-icons-png.flaticon.com/512/3351/3351979.png";
    }

    else if (
        conditionText === "Mist" ||
        conditionText === "Fog"
    ) {

        weatherIcon.src =
            "https://cdn-icons-png.flaticon.com/512/4005/4005901.png";
    }

    else if (conditionText === "Snow") {

        weatherIcon.src =
            "https://cdn-icons-png.flaticon.com/512/642/642102.png";
    }

    else {

        weatherIcon.src =
            "https://cdn-icons-png.flaticon.com/512/1779/1779940.png";
    }
}

// Live Clock Function

function updateLiveTime(localTime) {

    const targetDate = new Date(localTime);

    // Get timezone difference

    const targetOffset =
        targetDate.getTimezoneOffset();

    // Clear old interval

    if (window.clockInterval) {

        clearInterval(window.clockInterval);
    }

    function updateClock() {

        const now = new Date();

        // Current UTC Time

        const utc =
            now.getTime() +
            (now.getTimezoneOffset() * 60000);

        // Target Local Time

        const liveDate =
            new Date(
                utc - (targetOffset * 60000)
            );

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
                "en-IN",
                options
            );

        timeField.innerText =
            formattedTime;
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