function ChangeTemperature(response) {
  let temperatureElement = document.querySelector("#temperature");
  let CelciusTemperature = response.data.temperature.current;
  let cityname = document.querySelector("#city");
  let citySearchInput = document.querySelector("#search-input");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let iconElement = document.querySelector("#icon");
  let dayTimeElement = document.querySelector("#day-time");
  let date = new Date(response.data.time * 1000);
  let IconImage = document.querySelector("#icon");

  temperatureElement.innerHTML = Math.round(CelciusTemperature);
  cityname.innerHTML = response.data.city;
  descriptionElement.innerHTML = response.data.condition.description;
  humidityElement.innerHTML = `${response.data.temperature.humidity}%`;
  windElement.innerHTML = `${response.data.wind.speed} km/hr`;
  iconElement.innerHTML = response.data.condition.icon;
  dayTimeElement.innerHTML = DateAndTime(date);
  IconImage.innerHTML = ` <img src="${response.data.condition.icon_url}" class="iconImage" />`;

  function ShowFahrenheitTemperature(event) {
    event.preventDefault();
    let temperatureElement = document.querySelector("#temperature");
    let fahrenheitTemperature = (CelciusTemperature * 9) / 5 + 32;
    celsiuslink.classList.remove("UnitChange");
    fahrenheitlink.classList.add("UnitChange");
    temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
  }

  function ShowCelsiusTemperature(event) {
    event.preventDefault();
    let temperatureElement = document.querySelector("#temperature");
    celsiuslink.classList.add("UnitChange");
    fahrenheitlink.classList.remove("UnitChange");
    temperatureElement.innerHTML = Math.round(CelciusTemperature);
  }

  let fahrenheitlink = document.querySelector("#fahrenheit-link");
  fahrenheitlink.addEventListener("click", ShowFahrenheitTemperature);

  let celsiuslink = document.querySelector("#celsius-link");
  celsiuslink.addEventListener("click", ShowCelsiusTemperature);

  GetWeeklyForecast(response.data.city);
}

function DateAndTime(date) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let months = [
    "Januaray",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let month = months[date.getMonth()];
  let year = date.getFullYear();
  let dates = date.getDate();
  let day = days[date.getDay()];
  let hours = date.getHours();
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (hours < 10) {
    hours = `0${hours}`;
  }
  return `${dates} ${month}, ${year} | ${day}, ${hours}:${minutes}`;
}

function ApplyCityAPI(city) {
  let apiKey = "ff2o8b1ffc14490t1c0bba91e21ca53c";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(ChangeTemperature);
}

function ChangeCityName(event) {
  event.preventDefault();
  let cityname = document.querySelector("#city");
  let citySearchInput = document.querySelector("#search-input");

  ApplyCityAPI(citySearchInput.value);
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", ChangeCityName);

function ThemeToggle(event) {
  event.preventDefault();
  let body = document.querySelector("body");
  body.classList.toggle("dark-theme");
}
let themeButton = document.querySelector(".theme-button");
themeButton.addEventListener("click", ThemeToggle);

function GetWeeklyForecast(city) {
  let apiKey = "ff2o8b1ffc14490t1c0bba91e21ca53c";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}`;
  axios.get(apiUrl).then(DisplayWeeklyForecast);
}
function formatday(timestamp) {
  let days = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];
  let date = new Date(timestamp * 1000);
  return days[date.getDay()];
}
formatday(1782406800);
function DisplayWeeklyForecast(response) {
  console.log(response.data);

  let ForecastHtml = "";
  response.data.daily.forEach(function (day, index) {
    if (index < 5) {
      ForecastHtml =
        ForecastHtml +
        `
        <div class="week-days">
          <div class="weekly-day">${formatday(day.time)}</div>
          <div class="weekly-icons"><img src="${day.condition.icon_url}" /></div>
          <div class="weekly-temperatures">
            <div class="weekly-HighLow-temperatures">
              <strong>  ${Math.round(day.temperature.maximum)}°</strong>
            </div>
            <div class="weekly-HighLow-temperatures">${Math.round(day.temperature.minimum)}°</div>
          </div>
        </div>`;
    }
  });

  let ForecastElement = document.querySelector("#Weekly-Forecast");
  ForecastElement.innerHTML = ForecastHtml;
}

ApplyCityAPI("Toronto");
