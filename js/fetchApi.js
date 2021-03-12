import renderCurrentWeather from './renderCurrentWeather.js';
import renderForecast from './renderForecast.js';

const API = {
  key: 'aae34dd3fa439d5cb44c308cae049f36',
  baseUrl: 'https://api.openweathermap.org/data/2.5/'
};

let city = 'Vancouver'; 
let timer = null; // Return value of setInterval()
let notFound = false; // The flag whether the city name user input has been found
let added = false;
const refreshInterval = 120000; // Time interval of setInterval()

const searchBox = document.getElementById('searchbox');

// The function to fetch the weather information from API
const fetchAPI = async (cityName) => {
  try {
    const currentWeatherRes = await axios.get(`${API.baseUrl}weather/?q=${cityName}&appid=${API.key}&units=metric`);
    const forecastRes = await axios.get(`${API.baseUrl}forecast/?q=${cityName}&appid=${API.key}&units=metric`);
 
    console.log(currentWeatherRes.data);  
    console.log(forecastRes.data);  

    renderCurrentWeather(currentWeatherRes.data); // Render the information of current weather
    renderForecast(forecastRes.data); // Render the forecast information 

    // If this is the first time to fetch the information, add event listener to input box
    if (!added) {
      searchBox.addEventListener('keypress', searchFunc);
      added = true;
    }
  }
  catch(err) {
    // console.log(JSON.stringify(err));
    console.log(`Error detected. ${err}`);
    if (err.response && err.response.status === 404) { // When the city name didn't match any city names inside API database. 
      notFound = true;
      clearInterval(timer); // Stop an iteration to prevent rooping with invalid input value
      alert("The city name you input was not found.");
    }
  }
};

// Start a rooping of fetching datum from API
const startFetch = async () => {
  notFound = false;
  await fetchAPI(city);
  if (!notFound) { // If city name user input was correct, start fetching iteration 
    timer = setInterval(() => {
      fetchAPI(city);
    }, refreshInterval);
  }
};

// The function which runs when user press a key
const searchFunc = (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    city = searchBox.value; // Set a value user input equal to city variable
    clearInterval(timer); // Reset the timer of roop interval
    startFetch();
  }
};

export default startFetch;