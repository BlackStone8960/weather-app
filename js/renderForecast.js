import hideFinder from './hideFinder.js';

// Render datum of forecast information
const renderForecast = (data) => {
  const timeZone = data.city.timezone;
  const dayArray = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  let dayCounter = 1; // The counter of the day program is rendering

  // Make HTML for each forecast information of every 3 hours
  data.list.forEach((forecast, index) => {
    const dateTime = moment.unix(forecast.dt).utc().add(timeZone, 'second');
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

    if(index % 8 === 0 && index !== 0) { // After about 24x hours from current time
      const oneDayWrapper = `
        <div class="oneday-container">
          <div class="toggle-arrow" onclick="toggleShort(this)">↓</div>
          <div class="oneday-short">
            <span>${dayOfWeek}</span>
            <img src=${icon} class="small-weather-icon"></img>
            <div>
              <span>${tempMax}&#8451; / </span><span>${tempMin}&#8451;</span>
            </div>
          </div>
          <div class="oneday-wrapper hide">
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
        </div>
      `;
      document.getElementById('weather-container').insertAdjacentHTML('beforeend', oneDayWrapper);
    } else { // Render the information other than first forecast of the day 
      const oneDayForecast = `
        <div class="forecast-hour">
          <div>${hours}:00</div>
          <img src="${icon}"></img>
          <div>${temp}&#8451;</div>
        </div>
      `;
      document.getElementById(`list-day${dayCounter}`).insertAdjacentHTML('beforeend', oneDayForecast);
      index % 8 === 7 && dayCounter++; // Increment a day counter when the day moved up
    }
  });
  hideFinder();
};

export default renderForecast;