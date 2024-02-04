const cityInput=document.querySelector(".city-input");
const searchButton=document.querySelector(".search-btn");
const currentWeatherDiv=document.querySelector(".current-weather");
const weatherCardsDiv=document.querySelector(".weather-cards");

const API_KEY="48819671c7c0a1365f221d34acc6e5e9";
const createWeatherCard=(cityName, weatherItem, index)=>{
    if(index === 0){
        //main card HTML
        return `<div class="details">
                    <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                    <h4> Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
                    <h4> Min_Temp: ${(weatherItem.main.temp_min - 273.15).toFixed(2)}°C</h4>
                    <h4> Max_Temp: ${(weatherItem.main.temp_max - 273.15).toFixed(2)}°C</h4>
                    <h4> Wind: ${weatherItem.wind.speed} m/s</h4>
                    <h4> Wind_dir: ${weatherItem.wind.deg}°</h4>
                    <h4> Humidity: ${weatherItem.main.humidity}%</h4>
                </div>
                <div class="icon">
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                    <h4>${weatherItem.weather[0].description}</h4>
                </div>`;
    } else {
        // other 5 days card HTML
        return `<li class="card">
                    <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-icon">
                    <h4> Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
                    <h4>${weatherItem.weather[0].description}</h4>
                </li>`;

    }
}

const getWeatherDetails=(cityName, lat, lon)=>{
    const WEATHER_API_URL=`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    
    fetch(WEATHER_API_URL).then(res=>res.json()).then(data=>{
        //filtering the forecast to get only one forecast for a day
        const uniqueForecastDays =[];
        const fiveDaysForecast=data.list.filter(forecast=>{
            const forecastDate=new Date(forecast.dt_txt).getDate();
            if(!uniqueForecastDays.includes(forecastDate)){
                return uniqueForecastDays.push(forecastDate);
            }
        });

        // clearing previous weather data
        cityInput.value="";
        currentWeatherDiv.innerHTML="";
        weatherCardsDiv.innerHTML="";

        //creating weather cards and adding them to DOM
        console.log(fiveDaysForecast);
        fiveDaysForecast.forEach((weatherItem,index) => {
            if(index === 0){
                currentWeatherDiv.insertAdjacentHTML("beforeend",createWeatherCard(cityName, weatherItem,index));

            }else{
                
                weatherCardsDiv.insertAdjacentHTML("beforeend",createWeatherCard(cityName,weatherItem, index));
            }
            // createWeatherCard(weatherItem);
            
        });
        // console.log(uniqueForecastDays);
    }).catch(()=>{
        alert("An error occured while fetching the weather forecast");
    });
}
const getCityCoordinates =() =>{
    const cityName=cityInput.value.trim();
    if(!cityName) return;
    const GEOCODING_API_URL=`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;
     
    //from the api response we'll get the city coordinates
    fetch(GEOCODING_API_URL).then(res=> res.json()).then(data =>{
         if(!data.length) return alert(`No coordinates found for ${cityName}!`);
         const{name, lat, lon}=data[0];
         getWeatherDetails(name, lat, lon);
     }).catch(()=>{
        alert("An error occured while fetching the coordinates!");
     });
}

searchButton.addEventListener("click",getCityCoordinates);
cityInput.addEventListener("keyup", e=> e.key === "Enter" && getCityCoordinates());
