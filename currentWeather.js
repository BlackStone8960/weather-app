'use strict';

let city = 'Vancouver';
let timer = null;
let notFound = false;
let added = false;
// const refreshInterval = 3000;
const refreshInterval = 120000;
let dayCounter = 1;

const APIkey = 'aae34dd3fa439d5cb44c308cae049f36';
const baseUrl = 'https://api.openweathermap.org/data/2.5/';

const searchBox = document.getElementById('searchbox');
const place = document.getElementById('place');
const weatherContainer = document.getElementById('weather-container');

const startFetch = async () => {
  notFound = false;
  await fetchAPI(city);
  if (!notFound) {
    timer = setInterval(() => {
      fetchAPI(city);
    }, refreshInterval);    
  }
};

const searchFunc = (e) => {
  if (e.key === 'Enter') {
    city = searchBox.value;
    clearInterval(timer);
    startFetch();
  }
};

const renderData = (data) => {
  place.innerHTML = '';
  weatherContainer.innerHTML = '';

  const name = data.city.name;
  const country = data.city.country;
  document.getElementById('place').innerHTML = `${name}, ${country}`;

  data.list.forEach((forecast, index) => {
    const dateTime = new Date(forecast.dt * 1000);
    const month = dateTime.getMonth() + 1;
    const date = dateTime.getDate();
    const hours = dateTime.getHours();
    const min = String(dateTime.getMinutes()).padStart(2, '0');
    const weather = forecast.weather[0].main;
    const description = forecast.weather[0].description;
    const feelLike = Math.round(forecast.main.feels_like);
    const temp = Math.round(forecast.main.temp);
    const tempMax = Math.round(forecast.main.temp_max);
    const tempMin = Math.round(forecast.main.temp_min);
    const humidity = forecast.main.humidity;  
    const icon = `images/${forecast.weather[0].icon}.png`;

    if(index % 8 === 0) { // Now or after 24x hours
      const oneDayWrapper = `
        <div class="oneday-wrapper-${dayCounter}" id="oneday-wrapper">
          <div class="current-weather">
            <img src="icon"></img>
            <div>
              <div>${weather}<span>${description}</span></div>
              <div class="current-weather__temp">
                ${temp}
                <div>
                  <div>H:${tempMax} L:${tempMin} Feel like: ${feelLike}</div>
                  <div>Humidity: ${humidity}</div>
                </div>
              </div>
            </div>
          </div>
          <div id="forecast-list-${dayCounter}"></div>
        </div>
      `;
      document.getElementById('weather-container').insertAdjacentHTML('beforeend', oneDayWrapper);
    } else {
      const onedayForecast = `
        <div class="forecast-hour">
          <div>${hours}</div>
          <img src="${icon}"></img>
          <div>${temp}</div>
        </div>
      `;
      document.getElementById(`forecast-list-${dayCounter}`).insertAdjacentHTML('beforeend', onedayForecast);
      index % 8 === 7 && dayCounter++;
    }
  });
};

const fetchAPI = async (cityName) => {
  try {
    const res = await fetch(`${baseUrl}forecast/?q=${cityName}&appid=${APIkey}&units=metric`);
 
    if(res.status !== 200) {
      console.log(`Something went wrong. Status code: ${res.status}`);
      if (res.status === 404) { // 条件をより厳格にする
        notFound = true;
        clearInterval(timer);
        alert("The city name you input was not found.");
      }
    }
  
    const data = await res.json();
    console.log(data);  

    renderData(data);

    if (!added) {
      searchBox.addEventListener('keypress', searchFunc);
      added = true;
    }
  }
  catch(err) {
    console.log(`Error detected. ${err}`);
  }
};

startFetch();