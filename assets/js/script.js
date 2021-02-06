var searchInput = document.querySelector("#search-input")
var findCity = document.querySelector("#search-btn")
var listItemE1 = document.querySelector(".list-group")
var cityCard = document.querySelector("#city-container")
var clickForCity = document.querySelector(".list-group-item")
var saveCities = JSON.parse(localStorage.getItem(".list-group")) || [];

var getWeatherInfo = function(city) {

    // format the github api url
    var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=8d1c76621b3c56e2c6ba4131cbdbfec9";

    // make a repo request to the url
    fetch(apiUrl).then(function(response) {
        response.json().then(function(data) {
            var latitude = data.city.coord.lat
            var longitude = data.city.coord.lon
                // this is the api call needed to get the info for the uv index
            return fetch("https://api.openweathermap.org/data/2.5/uvi?lat=" + latitude + "&lon=" + longitude + "&appid=8d1c76621b3c56e2c6ba4131cbdbfec9").then(function(uvResponse) {
                uvResponse.json().then(function(uvData) {
                    displayWeather(data, city, uvData);

                })
            })





        });

    });


};


// function to receive the search input
var searchHandler = function(event) {

    event.preventDefault();
    // get value from input element
    var searchInput = document.querySelector("#search-input")
    var city = searchInput.value.trim();
    saveCities[saveCities.length] = city;
    // calls the city function to display the city onto card list 
    cityHistory(city);
    // calls the get weather function to receive weather info
    getWeatherInfo(city);

    searchInput.value = "";
    localStorage.setItem(".list-group", JSON.stringify(saveCities));
}


// saves city list on to page and able to click on again to see weather
window.addEventListener("load", function() {
    var list = document.getElementById("city-container")
    for (i = 0; i < saveCities.length; i++) {
        var city = document.createElement("li");
        city.classList.add("list-group-item");
        city.innerHTML = saveCities[i];
        list.appendChild(city)
    }

    // clears local storage 
    localStorage.clear();

});





var displayWeather = function(data, city, uvData) {


    // clear content
    document.querySelector(".weather-data").textContent = "";
    document.querySelector(".card-deck").innerHTML = "";
    // these variables are how the info is being pulled from the apis
    var currentTemp = data.list[0].main.temp;
    var currentHumid = data.list[0].main.humidity;
    var currentWind = data.list[0].wind.speed;
    var currentUv = uvData.value;

    // displays the current date
    var currentDate = moment().format("M/D/YYYY")
        // grabs the icons from open weather api
    var iconDisplay = "<img src= 'http://openweathermap.org/img/wn/" + data.list[0].weather[0].icon + "@2x.png' />"

    // the content below is how the info is being displayed onto screen
    var cityLocation = document.createElement("h2")
    cityLocation.classList = "bold-city"
    cityLocation.innerHTML = city + ": " + currentDate + iconDisplay

    var cityTemp = document.querySelector(".weather-data")
    var showConditions = document.createElement("h5")
    showConditions.classList = "temp"
    showConditions.innerHTML = "<h5> Temprature: " + currentTemp + "&#8457</h5>";




    var showHumidity = document.createElement("h5")
    showHumidity.classList = "humid"
    showHumidity.innerHTML = "<h5> Humidity: " + currentHumid + "% </h5>";

    var showWind = document.createElement("h5")
    showWind.classList = "wind"
    showWind.innerHTML = "<h5> Wind Speed: " + currentWind + " MPH <h5>";



    var uvIndex = document.createElement("h5")
    currentUv.setAttribute = "#current-uv"
    uvIndex.classList = "uvi"
    uvIndex.innerHTML = "<h5> UV Index:  <span id=show-uv>" + currentUv + "</span>" + "</h5>"

    cityTemp.appendChild(cityLocation)
    cityTemp.appendChild(showConditions)
    cityTemp.appendChild(showHumidity)
    cityTemp.appendChild(showWind)
    cityTemp.appendChild(uvIndex)
        // these conditional statements are to change the background color of the UV Index based on conditions
    if (currentUv > 10) {
        $("#show-uv").addClass("danger")
    } else if (currentUv >= 6 && currentUv <= 9.9) {
        $("#show-uv").addClass("moderate")
    } else {
        $("#show-uv").addClass("favorable")
    }


    var fiveHeader = document.querySelector("#five-day-header")
    fiveHeader.innerHTML = "<h2> 5 Day Forcast: </h2>"
    var cardDeck = document.querySelector(".card-deck")

    // this for loop iterates over the info in the list array to get the conditions for the 5 day display 
    for (var i = 0; i < data.list.length; i += 8) {
        var fiveDay = (data.list[i])
        var dayDate = moment.unix(fiveDay.dt).format("M/D/YYYY")
        var card = document.createElement("div")
        card.classList = "card bg-primary"
        var cardBody = document.createElement("div")
        cardBody.classList = "card-body"
        var dateDisplay = "<p id=date>" + dayDate + "</p>"
        var iconDisplay = "<img src= 'http://openweathermap.org/img/wn/" + fiveDay.weather[0].icon + "@2x.png' />"

        var tempDisplay = "<p> Temp: " + Math.floor(fiveDay.main.temp) + "&#8457</p>"
        var humidityDisplay = "<p> Humidity: " + fiveDay.main.humidity + "%</p>"
        cardBody.innerHTML = dateDisplay + iconDisplay + tempDisplay + humidityDisplay
        card.appendChild(cardBody)
        cardDeck.appendChild(card)


    }
}

// this function is how the cities are displayed onto the card list to be displayed
var cityHistory = function(showCity) {


    // create list item for each city
    var historyOne = document.createElement("li")
    historyOne.classList = "list-group-item"
    historyOne.textContent = showCity + "";
    historyOne.setAttribute("style", "cursor: pointer");

    cityCard.appendChild(historyOne)
    if (clickForCity != null) historyOne.onClick = clickCity
}

// this function is how the cities are able to be clicked on in the list to be viewed again
var clickCity = function(city) {

    if (city) {
        getWeatherInfo(city);


        searchInput.value = "";
    } else {
        alert("Please select a City")
    }
}


findCity.addEventListener("click", searchHandler);
// this allows the user to search by using the enter button instead of just the search button click event
searchInput.addEventListener("keyup", function(event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
        searchHandler(event)
    }
});
// makes list able to be clicked on again to display weather
listItemE1.addEventListener("click", function(e) {
    clickCity(e.target.innerText)
})