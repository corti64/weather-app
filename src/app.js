//Display the current date and time using JavaScript
function formatDate(now) {
  let currentDate = document.querySelector("#currentDate");
  let currentTime = document.querySelector("#time");

  let date = now.getDate();
  console.log(date);
  let hours = now.getHours().toString().padStart(2, "0");
  let minutes = now.getMinutes().toString().padStart(2, "0");
  let year = now.getFullYear();

  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let day = days[now.getDay()];

  let months = [
    "Jan",
    "Feb",
    "March",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let month = months[now.getMonth()];

  currentDate.innerHTML = `${day} ${month} ${date}, ${year}`;
  currentTime.innerHTML = `${hours}:${minutes}`;
}

let now = new Date();

formatDate(now);

//** C to F Toggle Button Conversions, script is pulling the user's selected city, once it is loaded to the HTML form, e.g., id = "#city"  **
let cityName = document.querySelector("#city"); // this line is just passing the the cityName value to the functions below ( e.g. getApiDataImperial and getApiDataMetric)

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", function () {
  getApiDataImperial(cityName.innerHTML);
});

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", function () {
  getApiDataMetric(cityName.innerHTML);
}); //this is an anyonymous function ( eg. starts at word "function"), it allows you to use a function as an argument to another function, making it possible to pass paramaters like city name entered by user, see https://www.javascripttutorial.net/javascript-anonymous-functions/  You can also use arrow functions to pass parameters to event listeners.

//Weather API

function showTemperature(response) {
  console.log(response);
  let degrees = Math.round(response.data.main.temp);
  let temperature = document.querySelector("#currentDegrees");
  temperature.innerHTML = `${degrees}°`;

  let city = document.querySelector("#city");
  city.innerHTML = response.data.name;

  let desc = document.querySelector("#currentWeatherDetail");
  desc.innerHTML = response.data.weather[0].description;

  let high = Math.round(response.data.main.temp_max);
  let highTemp = document.querySelector("#highTemp");
  highTemp.innerHTML = `${high}°`;

  let feels = Math.round(response.data.main.feels_like);
  let feelsLike = document.querySelector("#feelsLike");
  feelsLike.innerHTML = `${feels}°`;

  let sunrise = document.querySelector("#sunrise");
  sunrise.innerHTML = UTCtoTwentyFourHours(
    response.data.timezone,
    response.data.sys.sunrise

  
  //sunrise.innerHTML = `${response.data.sys.sunrise}`;

  //let wind = document.querySelector("#wind");
  //wind.innerHTML = Math.round(response.data.wind.speed);

  let low = Math.round(response.data.main.temp_min);
  let lowTemp = document.querySelector("#lowTemp");
  lowTemp.innerHTML = `${low}°`;

  let humidity = document.querySelector("#humidity");
  humidity.innerHTML = `${response.data.main.humidity}%`;

  let sunset = document.querySelector("#sunset");
  sunset.innerHTML = UTCtoTwentyFourHours(
    response.data.timezone,
    response.data.sys.sunset
  );
  //sunset.innerHTML = `${response.data.sys.sunset}`;

  //let clouds = document.querySelector("#clouds");
  //clouds.innerHTML = `${response.data.main.clouds.all}%`;
}

//GeoLocation
function retrievePosition(position) {
  console.log(position.coords.latitude);
  console.log(position.coords.longitude);
  let apiKey = "10a81d6318c2a72a6e26b0c6227d2fa9";

  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  axios.get(apiUrl).then(showTemperature);
}

function getCurrentPosition() {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(retrievePosition);
}

let currentLocation = document.querySelector("#current-btn");
currentLocation.addEventListener("click", getCurrentPosition);

//Original Search City Function, including event listener in use
/*
function search(event) {
  event.preventDefault();
  let input = document.querySelector("#search-bar");
  let apiKey = "10a81d6318c2a72a6e26b0c6227d2fa9";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${input.value}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showTemperature);
}

let form = document.querySelector("#search-form");
form.addEventListener("submit", search); //***bind is a way to work with event listeners, where "event" is the submit event listened for, and "units" is the variable which will also be pulled in as a parameter to the function being called
*/

//**New Search City Functions**

//The "getApiDataImperial" function is called by the conversion buttons (toggle for "F"), output will be in Imperial system (farenheit)
function getApiDataImperial(inputCity) {
  //let inputCity = response.data.name;
  let apiKey = "10a81d6318c2a72a6e26b0c6227d2fa9";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${inputCity}&appid=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(showTemperature);
}
//The "getApiDataMetric" function is called by the "search" function and conversion buttons (toggles). By default when user types in a city and clicks search, output will be in metric system (Celcius)
function getApiDataMetric(inputCity) {
  let apiKey = "10a81d6318c2a72a6e26b0c6227d2fa9";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${inputCity}&appid=${apiKey}&units=metric`; // the inputCity.value is the city user types in
  axios.get(apiUrl).then(showTemperature);
}

function search(event) {
  event.preventDefault();
  let inputCity = document.querySelector("#search-bar");
  getApiDataMetric(inputCity.value);
}

let form = document.querySelector("#search-form");
form.addEventListener("submit", search); //***bind is a way to work with event listeners, where "event" is the submit event listened for, and "units" is the variable which will also be pulled in as a parameter to the function being called

//****convert UTC time from API response to 24hr clock

function UTCtoTwentyFourHours(timeZone, time) {
  let newTime = (time + timeZone) * 1000;
  let convertedDate = new Date(newTime);
  let convertedHrs = convertedDate.getUTCHours().toString().padStart(2, "0");
  let convertedMins = convertedDate.getUTCMinutes().toString().padStart(2, "0");
  let returnedString = convertedHrs + ":" + convertedMins;
  return returnedString;
}

//Default city upon initial load
getApiDataMetric("Lausanne");
