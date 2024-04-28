var apiKey = "43307f36c133c1b4d80feb3644b2ab3e";  // Use the same API key for simplicity or manage accordingly if different
var dashboardEl = document.getElementById("dashboard");
var fiveDayEl = document.getElementById("five-day");
var searchInputEl = document.getElementById('search-input');
var searchBtnEl = document.getElementById("search-btn");
var sectionBtnEl = document.getElementById("historyBtn");
var historyArr = JSON.parse(localStorage.getItem("history")) || [];
var clearHistoryEl = document.getElementById("clear-history");

clearHistoryEl.addEventListener("click", clearHistory);

displayHistory();

function displayHistory() {
    sectionBtnEl.innerHTML = "";
    for (var i = 0; i < historyArr.length; i++) {
        sectionBtnEl.innerHTML += `<button type="button" class="button is-secondary w-100 mx-3 my-1">${historyArr[i]}</button>`;
    }
}

function populateData(event) {
    var currentButton = event.target;
    var cityName = currentButton.textContent;
    currentWeather(cityName);
    fiveForecast(cityName);
}

sectionBtnEl.addEventListener("click", populateData);
searchInputEl.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        search();
    }
});

function currentWeather(cityName) {
    var url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=imperial`;

    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);

            if (!historyArr.includes(data.name)) {
                historyArr.push(data.name);
                localStorage.setItem("history", JSON.stringify(historyArr));
                displayHistory();
            }

            dashboardEl.innerHTML = `
            <h3 class="title is-3">${data.name} (${new Date(data.dt * 1000).toLocaleDateString("en-US")}) <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt=""></h3>
            <p>Temp: ${data.main.temp}°F</p>
            <p>Wind: ${data.wind.speed} MPH</p>
            <p>Humidity: ${data.main.humidity}%</p>
            `;
        });
}

function fiveForecast(cityName) {
    var url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=imperial`;

    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            var forecastContainer = document.querySelector(".columns.is-multiline");
            forecastContainer.innerHTML = "";
            for (let i = 4; i < data.list.length; i += 8) { 
                let forecast = data.list[i];
                forecastContainer.innerHTML += `
                <div class="column is-one-fifth">
                    <div class="card">
                        <div class="card-content">
                            <h5 class="title is-5">${new Date(forecast.dt * 1000).toLocaleDateString("en-US")} <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png"></h5>
                            <p>Temp: ${forecast.main.temp.toFixed(1)}°F</p>
                            <p>Wind: ${forecast.wind.speed.toFixed(1)} MPH</p>
                            <p>Humidity: ${forecast.main.humidity}%</p>
                        </div>
                    </div>
                </div>
                `;
            }
        });
}

function search() {
    var cityName = searchInputEl.value;
    currentWeather(cityName);
    fiveForecast(cityName);
}

searchBtnEl.addEventListener("click", search);

function clearHistory() {
    localStorage.removeItem('history');
    historyArr= [];
    displayHistory();
}

