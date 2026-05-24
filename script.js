const temp = document.querySelector(".temp");
const locationField = document.querySelector(".location_time #location");
const timeField = document.querySelector(".location_time #time");
const conditionField = document.querySelector(".condition p");
const search = document.querySelector(".search_area");
const form = document.querySelector("form")
const weatherIcon = document.querySelector(".weather_icon");

form.addEventListener("submit", search_location);

let target = "";

function getCurrentLocation(){

    navigator.geolocation.getCurrentPosition(

        (position)=>{

            let latitude = position.coords.latitude;

            let longitude = position.coords.longitude;

            target = `${latitude},${longitude}`;

            fetchResults(target);
        },

        ()=>{

            // If location permission denied

            target = "Bihar";

            fetchResults(target);
        }
    );
}
const fetchResults = async (target_location) => {

    try {

        let url =
        `https://api.weatherapi.com/v1/current.json?key=9fc5f8031e944ca6b7c75337262405&q=${target_location}&aqi=no`;

        const res = await fetch(url);
        const data = await res.json();

        console.log(data);

        // Invalid location handling

        if (data.error) {

            alert("Location not found");

            return;
        }

        let locationName = data.location.name;
        let localtime = data.location.localtime;
        let temprature = data.current.temp_c;
        let condition = data.current.condition.text;

        updateDetails(
            temprature,
            locationName,
            localtime,
            condition
        );

    } catch (error) {

        alert("Something went wrong");

        console.log(error);
    }
};
function updateDetails(
    temperature,
    locationName,
    localTime,
    conditionText
){

    temp.innerText = `${temperature}°C`;

    locationField.innerText = locationName;

    timeField.innerText = localTime;

    conditionField.innerText = conditionText;

    // Weather Icons

    if(conditionText == "Sunny"){

        weatherIcon.src =
        "https://cdn-icons-png.flaticon.com/512/869/869869.png";
    }

    else if(conditionText == "Cloudy"){

        weatherIcon.src =
        "https://cdn-icons-png.flaticon.com/512/414/414825.png";
    }

    else if(conditionText == "Rain"){

        weatherIcon.src =
        "https://cdn-icons-png.flaticon.com/512/3351/3351979.png";
    }

    else if(conditionText == "Mist"){

        weatherIcon.src =
        "https://cdn-icons-png.flaticon.com/512/4005/4005901.png";
    }

    else{

        weatherIcon.src =
        "https://cdn-icons-png.flaticon.com/512/1779/1779940.png";
    }
}
function search_location(e){

    e.preventDefault();

    target = search.value.trim();

    if(target === ""){

        alert("Please enter location");

        return;
    }

    fetchResults(target);
}
getCurrentLocation();