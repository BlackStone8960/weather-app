'use strict';

let city = 'Vancouver';
let timer = null;
let notFound = false;
let added = false;
const refreshInterval = 120000;
// const refreshInterval = 3000;

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
    e.preventDefault();
    city = searchBox.value;
    clearInterval(timer);
    startFetch();
  }
};

const renderCurrentWeather = (data) => {
  place.innerHTML = '';
  weatherContainer.innerHTML = '';

  const name = data.name;
  const country = data.sys.country;
  place.innerHTML = `${name}, ${country}`;

  const weather = data.weather[0].main;
  const description = data.weather[0].description;
  const feelLike = Math.round(data.main.feels_like);
  const temp = Math.round(data.main.temp);
  const tempMax = Math.round(data.main.temp_max);
  const tempMin = Math.round(data.main.temp_min);
  const humidity = data.main.humidity;
  const icon = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  // const icon = `images/${forecast.weather[0].icon}.png`;

  const oneDayWrapper = `
    <div class="oneday-wrapper">
      <h2 class="dayOfWeek">Current weather</h2>
      <div class="current-weather">
        <img src=${icon} class="weather-icon"></img>
        <div class="weather-discription">
          <div class="current-weather__description"><em>${weather}</em><span class="weather-detail">${description}</span></div>
          <div class="current-weather__temp">
            <span class="current-temp"><em>${temp}&#8451;</em></span>
            <div>
              <div>H:${tempMax}&#8451; L:${tempMin}&#8451; Feel like: ${feelLike}&#8451;</div>
              <div>Humidity: ${humidity}%</div>
            </div>
          </div>
        </div>
      </div>
      <div id="list-day1" class="forecast-list"></div>
    </div>
  `;
  weatherContainer.insertAdjacentHTML('beforeend', oneDayWrapper);
};

const renderForecast = (data) => {
  const timeZone = data.city.timezone;
  const dayArray = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  let dayCounter = 1;

  data.list.forEach((forecast, index) => {
    const dateTime = moment.unix(forecast.dt).utc().add(timeZone, 'second');
    const month = dateTime.get('month') + 1;
    const date = dateTime.get('date');
    const dayOfWeek = dayArray[dateTime.get('day')];
    const hours = dateTime.get('hour');
    const weather = forecast.weather[0].main;
    const description = forecast.weather[0].description;
    const feelLike = Math.round(forecast.main.feels_like);
    const temp = Math.round(forecast.main.temp);
    const tempMax = Math.round(forecast.main.temp_max);
    const tempMin = Math.round(forecast.main.temp_min);
    const humidity = forecast.main.humidity;  
    const icon = `http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`;
    // const icon = `images/${forecast.weather[0].icon}.png`;

    if(index % 8 === 0 && index !== 0) { // After 24x hours
      const oneDayWrapper = `
        <div class="oneday-wrapper">
          <h2 class="dayOfWeek">${dayOfWeek}</h2>
          <div class="current-weather">
            <img src=${icon} class="weather-icon"></img>
            <div class="weather-discription">
              <div class="current-weather__description"><em>${weather}</em><span class="weather-detail">${description}</span></div>
              <div class="current-weather__temp">
                <span class="current-temp"><em>${temp}&#8451;</em></span>
                <div>
                  <div>H:${tempMax}&#8451; L:${tempMin}&#8451; Feel like: ${feelLike}&#8451;</div>
                  <div>Humidity: ${humidity}%</div>
                </div>
              </div>
            </div>
          </div>
          <div id="list-day${dayCounter}" class="forecast-list"></div>
        </div>
      `;
      weatherContainer.insertAdjacentHTML('beforeend', oneDayWrapper);
    } else {
      const oneDayForecast = `
        <div class="forecast-hour">
          <div>${hours}:00</div>
          <img src="${icon}"></img>
          <div>${temp}&#8451;</div>
        </div>
      `;
      document.getElementById(`list-day${dayCounter}`).insertAdjacentHTML('beforeend', oneDayForecast);
      index % 8 === 7 && dayCounter++;
    }
  });
};

const fetchAPI = async (cityName) => {
  try {
    const currentWeatherRes = await axios.get(`${baseUrl}weather/?q=${cityName}&appid=${APIkey}&units=metric`);
    const forecastRes = await axios.get(`${baseUrl}forecast/?q=${cityName}&appid=${APIkey}&units=metric`);
 
    console.log(currentWeatherRes);  
    console.log(forecastRes);  

    renderCurrentWeather(currentWeatherRes.data);
    renderForecast(forecastRes.data);

    if (!added) {
      searchBox.addEventListener('keypress', searchFunc);
      added = true;
    }
  }
  catch(err) {
    // console.log(JSON.stringify(err));
    console.log(`Error detected. ${err}`);
    if (err.response && err.response.status === 404) { // 条件をより厳格にする
      notFound = true;
      clearInterval(timer);
      alert("The city name you input was not found.");
    }
  }
};

startFetch();