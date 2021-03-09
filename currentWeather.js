'use strict';

let city = 'Vancouver';
let timer = null;
let notFound = false;
let added = false;
const APIkey = 'aae34dd3fa439d5cb44c308cae049f36';
const baseUrl = 'https://api.openweathermap.org/data/2.5/';
const searchBox = document.getElementById('searchbox');
const refreshInterval = 3000;
// const refreshInterval = 120000;

const startFetch = async () => {
  notFound = false;
  await fetchAPI(city);
  if(!notFound) {
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
  // const name = data.city.name;
  // const country = data.city.country;

  // data.list.forEach((forecast, index) => {
  //   const weather = forecast.weather[0].main;
  //   const description = forecast.weather[0].description;
  //   const feelLike = Math.round(forecast.main.feels_like);
  //   const temp = Math.round(forecast.main.temp);
  //   const tempMax = Math.round(forecast.main.temp_max);
  //   const tempMin = Math.round(forecast.main.temp_min);
  //   const humidity = forecast.main.humidity;  
  // });

  // const currentWeather = `
  //   <div>
  //     <p>${weather}</p>
  //     <p>${currentTemp}</p>
  //   </div>
  // `;
  // document.getElementById('place').innerHTML = `${name}, ${country}`;
  // document.getElementById('current-weather').innerHTML = currentWeather;
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