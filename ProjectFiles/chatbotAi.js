const searchButton = document.querySelector(".search-btn");
const cityInput = document.querySelector(".city-input");
const locationButton = document.querySelector(".location-btn")
const currentWeatherDiv = document.querySelector(".current-weather"); 
const weatherCardsDiv = document.querySelector(".weather-cards"); 

const createWeatherCard = (cityName , weatherItem , index) => {
    if(index === 0){
        return `<div class="details">
                    <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                    <h4>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}<sup>o</sup>C</h4>
                    <h4>Wind : ${weatherItem.wind.speed} M/S</h4>
                    <h4>Humidity: ${weatherItem.main.humidity}</h4>
                    </div>
                    <div class="icon">
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="Weather-img" />
                    <h4>${weatherItem.weather[0].description}</h4>
                </div>`
    }else{
    return `<li class="card">
                <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
                <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="Weather-img" />
                <h4>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}<sup>o</sup>C</h4>
                <h4>Wind : ${weatherItem.wind.speed}M/S</h4>
                <h4>Humidity: ${weatherItem.main.humidity}</h4>
            </li>`
    }
}

const API_KEY = "06e8f59350672ce64985d1ee21388db1";

const getWeatherDetails = (cityName,lat,lon) => {
    const WEATHER_API_URL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {
        const uniqueForecastDays = [];

       const fiveDaysForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if(!uniqueForecastDays.includes(forecastDate)){
               return uniqueForecastDays.push(forecastDate)
            }
        });

        cityInput.value = "";
        currentWeatherDiv.innerHTML = "";
        weatherCardsDiv.innerHTML = "";

        console.log(fiveDaysForecast);
        fiveDaysForecast.forEach((weatherItem , index) => {
            if(index === 0){
                currentWeatherDiv.insertAdjacentHTML("beforeend",  createWeatherCard(cityName, weatherItem,index));
            }else{
                weatherCardsDiv.insertAdjacentHTML("beforeend",  createWeatherCard(cityName,weatherItem,index)); 
            }
        })


    }).catch(() => {
        alert("An Error Occurred while fetching  the coordinates!");
    });
}


const getCityCordinates = () => {
    const cityName = cityInput.value.trim();
    if(!cityName) return; 
    // console.log(cityName)
    const GEO_CODINGAPI_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

    // get entered city corordinates 
    fetch(GEO_CODINGAPI_URL).then(res => res.json()).then(data => {
        if(!data.length) 
        return alert(`No Coordinates found for ${cityName}`); 

        const {name,lat,lon} = data[0];
        getWeatherDetails(name,lat,lon);
    }).catch(() => {
        alert("An Error Occurred while fetching the coordinates!");
    });
}

const getUserCordinates =() => {
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude , longitude} = position.coords;

            // Get city name from coordinates using reverse geocoding API
            const REVERSE_GEOCODING_URL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
            fetch(REVERSE_GEOCODING_URL).then(res => res.json()).then(data => {
                const {name} = data[0];
                getWeatherDetails(name,latitude , longitude);
            }).catch(() => {
                alert("An Error Occurred while fetching the city!");
            });
        },
        // shows alert if user denied the location permission
        error => {
            if(error.code ===  error.PERMISSION_DENIED){
                alert("Geolocation request denied. Please reset location permission to grant acesss")
            }
        }
    )
}

locationButton.addEventListener("click" , getUserCordinates);
searchButton.addEventListener("click" , getCityCordinates);
cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCordinates)
