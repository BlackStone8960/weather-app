import hideFinder from './hideFinder.js';

// Render datum of current weather
const renderCurrentWeather = (data) => {
  const place = document.getElementById('place');

  // Empty HTML about weather information
  place.innerHTML = '';
  document.getElementById('weather-container').innerHTML = '';

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

  // Make weather information HTML to insert in original HTML
  const oneDayWrapper = `
    <div class="oneday-container">
      <div class="toggle-arrow" onclick="toggleShort(this)">↓</div>
      <div class="oneday-short hide">
        <span>Today</span>
        <img src=${icon} class="small-weather-icon"></img>
        <div>
          <span>${tempMax}&#8451; / </span><span>${tempMin}&#8451;</span>
        </div>
      </div>
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
    </div>
  `;
  document.getElementById('weather-container').insertAdjacentHTML('beforeend', oneDayWrapper);
};

export default renderCurrentWeather;