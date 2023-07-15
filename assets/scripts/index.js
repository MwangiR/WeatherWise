const searchBtnEL = document.querySelector(".searchBtn");
const searchInputEL = document.querySelector("#cityInput");

loadFromLocal();
function weatherAPI() {
  const params = new URLSearchParams({
    city: "London",
    appid: "063fb6a108a3f5a1d0f814a991c1d527",
  });

  const weatherURL = `https://api.openweathermap.org/data/2.5/weather?${params}`;

  fetch(weatherURL)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
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

    aEl.addEventListener("click", () => {
      document.querySelector("#loadedCity").textContent = city;
    });
  });
}

searchBtnEL.addEventListener("click", (e) => {
  e.preventDefault();
  console.log(searchInputEL.value);
  saveToLocal();
  loadFromLocal();
});

weatherAPI();
console.log(searchBtnEL);

//initalize foundation css
Foundation.addToJquery($);
$(document).foundation();
