const currentMoment = moment();
const currentDate = moment().format("(M/DD/YYYY)");

let searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
fillSearchHistory(searchHistory);

// fillDashboard(data, "Costa Mesa", currentDate.toString());

document.querySelector("#searchBtn").addEventListener("click", function() {
    localStorage.removeItem("lat");
    localStorage.removeItem("lng");

    let cityInput = $("textarea").val();
    localStorage.setItem("cityInput", cityInput);
    console.log(cityInput);

    if (typeof searchHistory !== 'object' || searchHistory == null) {
        searchHistory = [];
    }
    console.log(searchHistory);

    searchAndSet(cityInput);
      });

function searchAndSet(input) {
    const geocodeApiUrl = "https://maps.googleapis.com/maps/api/geocode/json?address=" + input + "&key=AIzaSyDvL3NSHoK97XAjeaDmISONa46hOyECb5U";
    fetch(geocodeApiUrl).then(function (response) {
        response.json().then(function (data) {
            console.log(data);
            localStorage.setItem("lat", data.results[0].geometry.location.lat);
            localStorage.setItem("lng", data.results[0].geometry.location.lng);

            searchHistory.unshift(data.results[0].address_components[0].long_name);
            console.log(searchHistory.length);
            if (searchHistory.length >= 11) {
                searchHistory = searchHistory.slice(0, 10);
            }

            console.log(searchHistory);
            localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
            
            geocodeToLocation();
            fillSearchHistory(searchHistory);
        }
        )}
    )}
    
function geocodeToLocation() {
    let lat = "?lat=" + localStorage.getItem("lat");
    let lng = "&lon=" + localStorage.getItem("lng");

    let weatherApiUrl = 'https://api.openweathermap.org/data/2.5/onecall'+lat+lng+'&units=imperial&appid=bf7562bea0d64a1445487582825c9ec6';
    console.log(weatherApiUrl);
    fetch(weatherApiUrl).then(function (response) {
        if (response.ok) {
        response.json().then(function (data) {
            console.log(data);

            fillDashboard(data, localStorage.getItem("cityInput"), currentDate.toString());
            fillForecast(data);
        });
        } else {
        console.log('Error: ' + response.statusText);
        }
    });
}

function fillDashboard(weather, city, date) {
    const uviP = document.createElement("p");
    let uvi = "";

    if (weather.current.uvi < 2) {
        uvi = '<span class="uvi green">'+ weather.current.uvi + '</span>';
    } else if (weather.current.uvi < 5) {
        uvi = '<span class="uvi yellow">'+ weather.current.uvi + '</span>';
    } else if (weather.current.uvi < 7) {
        uvi = '<span class="uvi orange">'+ weather.current.uvi + '</span>';
    } else {
        uvi = '<span class="uvi red">'+ weather.current.uvi + '</span>';
    }

    uviP.innerHTML = 'UV Index: ' + uvi;

    document.getElementById("dashboard").innerHTML = 
        '<h2 id="city">'+ city + ' ' + date + '</h2>\n' +
        '<p id="temp">Temp: '+weather.current.temp+'°F</p>\n' +
        '<p id="wind">Wind: ' + weather.current.wind_speed +' MPH</p>\n' +
        '<p id="humidity">Humidity: ' + weather.current.humidity + '%</p>\n';
     document.getElementById("dashboard").appendChild(uviP);
};

function fillForecast(weather) {
    document.getElementById("forecast").remove();

    const forecastContainer = document.createElement("div");
    forecastContainer.setAttribute("id", "forecast");

    let dayAhead = 0;

    for (let i = 0; i < 5; i++) {
        dayAhead++;
        let date = currentMoment.add(dayAhead, 'days').format("(M/DD/YYYY)");
        console.log(date);

        const forecastCard = document.createElement("div");
        forecastCard.setAttribute("id", "forecastCard");

        forecastCard.innerHTML = 
            '<h2 id="fcDate">' + date + '</h2>\n' +
            '<h2 id="fcIcon">' + "Icon" + '</h2>\n' +
            '<p id="fcTemp">Temp: '+weather.daily[i].temp.day +'°F</p>\n' +
            '<p id="fcWind">Wind: ' + weather.daily[i].wind_speed +' MPH</p>\n' +
            '<p id="fcHumidity">Humidity: ' + weather.daily[i].humidity + '%</p>\n';
        
        forecastContainer.appendChild(forecastCard);
        date = currentMoment.subtract(dayAhead, 'days');
    }

    $(".column").append(forecastContainer);
};

function fillSearchHistory(array) {
    let oldSHL = document.getElementById("searchHistoryList")
    oldSHL.remove();

    let searchHistoryList = document.createElement("ul");
    searchHistoryList.setAttribute("id","searchHistoryList");

    for (let i = 0; i < array.length; i++) {
        let searchHistoryLi = document.createElement("li");
        searchHistoryLi.innerHTML = "<button id='suggestedSearch'>" + array[i] + "</button>";
        searchHistoryList.appendChild(searchHistoryLi);
    }
    document.getElementById("asideColumn").appendChild(searchHistoryList);

    const searchUL = $("#searchHistoryList");

    for (let li = 0; li < searchUL.children().length; li++) {
        const element = searchUL.children()[li];
        
        element.addEventListener("click", function(event) {
            event.preventDefault();
            localStorage.removeItem("lat");
            localStorage.removeItem("lng");
    
            let cityInput = $(event.target).text();
            localStorage.setItem("cityInput", cityInput);
            console.log(cityInput);
    
            if (typeof searchHistory !== 'object' || searchHistory == null) {
                searchHistory = [];
            }
            console.log(searchHistory);
    
            searchAndSet(cityInput);
        })
    }
    }
















//     let searchHistoryButtonList = document.querySelectorAll("#suggestedSearch");
//     for (let i = 0; i < searchHistoryButtonList.length; i++) {
//         searchHistoryButtonList[i].addEventListener("click", function() {
//             fillDashboard(, searchHistoryButtonList[i].val(),)
//         });
//     }
// }