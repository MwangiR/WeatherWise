const searchBtnEL = document.querySelector(".searchBtn");
const searchInputEL = document.querySelector("#cityInput");
const fiveDayEl = document.querySelector("#fiveDay");

loadFromLocal();
function weatherAPI(cityName) {
  const params = new URLSearchParams({
    q: cityName,
    appid: "063fb6a108a3f5a1d0f814a991c1d527",
  });

  const weatherURL = `https://api.openweathermap.org/data/2.5/weather?${params.toString()}`;

  fetch(weatherURL)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);

      const showCity = document.querySelector("#loadedCity");
      const showTempEl = document.querySelector("#showTemp");
      const showWindEl = document.querySelector("#showWind");
      const showHumidityEl = document.querySelector("#showHumidity");

      showCity.textContent = data.name;
      showTempEl.innerHTML = `${data.main.temp} \u2109`;
      showWindEl.innerHTML = `${data.wind.speed} MPH`;
      showHumidityEl.innerHTML = `${data.main.humidity}%`;
    })
    .catch((error) => {
      console.error(error);
    });
}

function saveToLocal() {
  const searchedCity = searchInputEL.value;
  let savedCities = localStorage.getItem("searchedCity", searchedCity);

  if (savedCities) {
    savedCities = JSON.parse(savedCities);
  } else {
    savedCities = [];
  }

  savedCities.push(searchedCity);
  localStorage.setItem("searchedCity", JSON.stringify(savedCities));
}

function loadFromLocal() {
  const searchedCity = localStorage.getItem("searchedCity");
  const savedCity = JSON.parse(searchedCity) || [];

  const previousHistoryEl = document.querySelector("#previousHistory");

  savedCity.forEach((city) => {
    // Check if the city already exists in the DOM
    const existingCityEl = previousHistoryEl.querySelector(`a[data-city="${city}"]`);
    if (existingCityEl) {
      return; // Skip appending the city if it already exists
    }
    const aEl = document.createElement("a");
    aEl.setAttribute("class", "button secondary expanded loadedCity");
    aEl.setAttribute("href", "#");
    aEl.setAttribute("data-city", city);
    aEl.textContent = city;

    previousHistoryEl.appendChild(aEl);

    aEl.addEventListener("click", (e) => {
      e.preventDefault();
      document.querySelector("#loadedCity").textContent = city;
      weatherAPI(city);
      fiveDayEl.innerHTML = "";
      forecast(city);
    });
  });
}

function forecast(cityName) {
  const params = new URLSearchParams({
    q: cityName,
    cnt: 50,
    appid: "063fb6a108a3f5a1d0f814a991c1d527",
  });

  const weatherURL = `https://api.openweathermap.org/data/2.5/forecast?${params.toString()}`;

  fetch(weatherURL)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log("Forecast data: ", data);
      const forecastDays = data.list;

      const dates = new Set();
      const filteredDays = forecastDays.filter((day) => {
        const date = day.dt_txt.split(" ")[0];
        if (!dates.has(date)) {
          dates.add(date);
          return true;
        }
        return false;
      });

      filteredDays.slice(1, 6).forEach((day, index) => {
        const cardContainer = document.createElement("div");
        cardContainer.setAttribute("class", "card dayCard");
        fiveDayEl.appendChild(cardContainer);

        const cardDivider = document.createElement("div");
        cardDivider.setAttribute("class", "card-divider");
        const dt_txt = day.dt_txt;
        const dateWithoutTime = dt_txt.substring(0, 10);
        cardDivider.textContent = dateWithoutTime;
        cardContainer.appendChild(cardDivider);

        const imgContainer = document.createElement("img");
        imgContainer.setAttribute(
          "src",
          `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`,
        );
        imgContainer.setAttribute("class", "card-img");
        imgContainer.setAttribute("data-tooltip", "");
        imgContainer.setAttribute("tabindex", "1");
        imgContainer.setAttribute("alt", day.weather[0].description);
        imgContainer.setAttribute("title", day.weather[0].description);
        imgContainer.setAttribute("data-position", "bottom");
        cardContainer.appendChild(imgContainer);

        const detailsSection = document.createElement("div");
        detailsSection.setAttribute("class", "card-section");
        cardContainer.appendChild(detailsSection);

        // Create the Temperature section
        const tempContainer = document.createElement("div");
        tempContainer.setAttribute("class", "forecastDetails");
        const tempLabel = document.createElement("label");
        tempLabel.textContent = "Temp: ";
        const tempValue = document.createElement("p");
        tempValue.innerHTML = `${day.main.temp} \u2109`;
        tempValue.setAttribute("id", "showTemp");
        tempContainer.appendChild(tempLabel);
        tempContainer.appendChild(tempValue);

        // Create the Wind section
        const windContainer = document.createElement("div");
        windContainer.setAttribute("class", "forecastDetails");
        const windLabel = document.createElement("label");
        windLabel.textContent = "Wind Speed: ";
        const windValue = document.createElement("p");
        windValue.textContent = `${day.wind.speed} MPH`;
        windValue.setAttribute("id", "showWind");
        windContainer.appendChild(windLabel);
        windContainer.appendChild(windValue);

        // Create the Humidity section
        const humidityContainer = document.createElement("div");
        humidityContainer.setAttribute("class", "forecastDetails");
        const humidityLabel = document.createElement("label");
        humidityLabel.textContent = "Humidity";
        const humidityValue = document.createElement("p");
        humidityValue.innerHTML = `${day.main.humidity}%`;
        humidityValue.setAttribute("id", "showHumidity");
        humidityContainer.appendChild(humidityLabel);
        humidityContainer.appendChild(humidityValue);

        // Append the forecastContainer to the desired parent element in your document
        detailsSection.append(tempContainer, windContainer, humidityContainer);
      });
    })
    .catch((error) => {
      console.error(error);
    });
}

searchBtnEL.addEventListener("click", (e) => {
  e.preventDefault();

  const regex = /^[A-Za-z]+(\s[A-Za-z]+)*$/;

  if (!regex.test(searchInputEL.value)) {
    alert("Please enter a valid city");
  } else {
    console.log(searchInputEL.value);
    fiveDayEl.innerHTML = "";
    weatherAPI(searchInputEL.value);
    saveToLocal();
    forecast(searchInputEL.value);
    loadFromLocal();
  }
});

//initalize foundation css
Foundation.addToJquery($);
$(document).foundation();
