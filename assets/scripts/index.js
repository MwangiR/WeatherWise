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

      const elemenetToShow = showMessage(data.cod, data.message);
      removeElement(elemenetToShow, 3000);

      const showCity = document.querySelector("#cityName");
      const showDate = document.querySelector("#date");
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
      showDate.textContent = unixToDate(data.dt);
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
      document.querySelector("#cityName").textContent = city;
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
    return calloutContainer;
  }
  return null;
}

function unixToDate(unixTimestamp) {
  const date = new Date(unixTimestamp * 1000); // Convert Unix timestamp to milliseconds
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Adding 1 because months are zero-based
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function removeElement(element, delay) {
  setTimeout(() => {
    if (element) {
      element.remove();
    }
  }, delay);
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

      const currentDate = new Date().toISOString().substring(0, 10);
      const uniqueDates = new Set();
      const filteredForecast = [];

      forecastDays.forEach((entry) => {
        const entryDate = entry.dt_txt.substring(0, 10);
        if (entryDate !== currentDate && !uniqueDates.has(entryDate)) {
          uniqueDates.add(entryDate);
          filteredForecast.push(entry);
        }
      });

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
