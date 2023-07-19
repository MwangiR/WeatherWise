const searchBtnEL = document.querySelector(".searchBtn");
const searchInputEL = document.querySelector("#cityInput");
const fiveDayEl = document.querySelector(".fiveDay");

loadFromLocal();
function weatherAPI(cityName) {
  const params = new URLSearchParams({
    q: cityName,
    units: "metric",
    appid: "063fb6a108a3f5a1d0f814a991c1d527",
  });

  const weatherURL = `https://api.openweathermap.org/data/2.5/weather?${params.toString()}`;

  fetch(weatherURL)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log("Search data: ", data);

      showMessage(data.cod, data.message);

      const showCity = document.querySelector("#loadedCity");
      const showTempEl = document.querySelector("#showTemp");
      const showWindEl = document.querySelector("#showWind");
      const showHumidityEl = document.querySelector("#showHumidity");
      const imgContainer = document.querySelector("#imageSection img");
      imgContainer.classList.add("thumbnail");
      imgContainer.setAttribute(
        "src",
        `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
      );
      imgContainer.setAttribute("class", "card-img");
      imgContainer.setAttribute("data-tooltip", "");
      imgContainer.setAttribute("tabindex", "1");
      imgContainer.setAttribute("data-position", "bottom");
      imgContainer.setAttribute("alt", data.weather[0].description);
      imgContainer.setAttribute("title", data.weather[0].description);

      showCity.textContent = data.name;
      showTempEl.innerHTML = `Temparature: ${data.main.temp} \u2103`;
      showWindEl.innerHTML = `Wind Speed: ${data.wind.speed} MPH`;
      showHumidityEl.innerHTML = `Humidity: ${data.main.humidity}%`;
    })
    .catch((error) => {
      console.error(error);
    });
}

function saveToLocal() {
  const searchedCity = searchInputEL.value;

  if (loadedCode === "404") {
    showMessage(loadedCode, "City not found");
    return;
  }

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

function showMessage(loadedCode, loadedData) {
  if (loadedCode === "404") {
    const calloutContainer = document.createElement("div");
    calloutContainer.setAttribute("class", "callout");
    calloutContainer.classList.add("alert");
    calloutContainer.textContent = loadedData;
    document.querySelector("main").prepend(calloutContainer);
  }
  return;
}

function forecast(cityName) {
  const params = new URLSearchParams({
    q: cityName,
    cnt: 40,
    units: "metric",
    exclude: "current,minutely,hourly,alerts",
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

      const currentDate = new Date();

      const daystoDisplay = forecastDays.filter((entry) => {
        const entryDate = new Date(entry.dt_txt);
        return entryDate > currentDate;
      });

      const filteredForecast = daystoDisplay.filter((_, index) => index % 8 === 0);

      showMessage(data.cod);

      filteredForecast.slice(0, 5).forEach((day) => {
        const cardContainer = document.createElement("div");
        cardContainer.setAttribute("class", "card dayCard");
        fiveDayEl.appendChild(cardContainer);

        const cardDivider = document.createElement("div");
        cardDivider.setAttribute("class", "card-divider");
        const dt_txt = day.dt_txt;
        const dateWithoutTime = dt_txt.substring(0, 10);
        //const dateWithoutTime = dt_txt;
        cardDivider.textContent = dateWithoutTime;
        cardContainer.appendChild(cardDivider);

        const imgContainer = document.createElement("img");
        imgContainer.classList.add("thumbnail");
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
        tempValue.innerHTML = `${day.main.temp} \u2103`;
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
