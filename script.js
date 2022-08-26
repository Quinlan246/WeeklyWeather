
$(document).ready(function () {
    var searchBtn = $('#searchBtn');

    initialzeLocalStorage()

    searchBtn.on("click", function (e) {
        e.preventDefault();
        var cityName = $("#city").val();
        var apiKey = "b873cc8e2dbadecf45255f14f31f8170";
        var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${apiKey}`;
        $.ajax({
            url: queryURL,
            method: "GET"
        }) .then(function (response) {
            weatherForecast(response);
            addToSearchHist(response.name);
        });
        $("#city").val("")
    })


    function weatherForecast(response) {
        $(".hide").attr("class", "row");
        var currentCityName = response.name;
        $("#currentCityInfo").text(currentCityName + " ");
        var currentCityLon = response.coord.lon;
        var currentCityLat = response.coord.lat;
        findWithCoords(currentCityLat, currentCityLon);
        var currentCityDate = response.sys.sunrise;
        dateConverter(currentCityDate);
        var currentWeatherIcon = response.weather[0].icon;
        weatherIcon(currentWeatherIcon);
    };console.log(weatherForecast())

    function findWithCoords(currentCityCoLat, currentCityCoLon) {
        var apiKey = "b873cc8e2dbadecf45255f14f31f8170";
        var queryURL2 = "https://api.openweathermap.org/data/2.5/forecast?lat=" + currentCityCoLat + "&lon=" + currentCityCoLon + "&exclude=minutely,hourly&units=imperial&appid=" + apiKey;
        $.ajax({
            url: queryURL2,
            method: "GET"
        }).then(function (results) {
            var currentCityTemp = results.current.temp;
            $("#currentTemp").text("Temperature: " + currentCityTemp + " \u00B0F");
            var currentCityHumidity = results.current.humidity;
            $("#currentHumid").text("Humidity: " + currentCityHumidity + "%");
            var currentCityWindSpeed = results.current.wind_speed;
            $("#currentWind").text("Wind Speed: " + currentCityWindSpeed + " MPH");
            var currentCityUvi = results.current.uvi;
            uviIndexSeverity(currentCityUvi);
            fiveDayForecast(results);
        }); 
    };

    function dateConverter(dt) {
        var inMilliseconds = dt * 1000;
        var inDateFormat = new Date(inMilliseconds);
        var currentIntMonth = inDateFormat.getMonth() + 1;
        var currentIntDay = inDateFormat.getDate();
        var currentIntYear = inDateFormat.getFullYear();
        $("#currentCityInfo").append("<span>" + "(" + currentIntMonth + "/" + currentIntDay + "/" + currentIntYear + ")" + "</span>");
    };

    function weatherIcon(currentWeatherIcon) {
        var currentWeatherImg = "assets/images/" + currentWeatherIcon + "@2x.png";
        var currentWeatherIconImg = $("<img>");
        currentWeatherIconImg.attr("src", currentWeatherImg);
        $("#currentCity").append(currentWeatherIconImg);
    };

    function uviIndexSeverity(currentCityUvi) {
        $("#currentUvi").text("");
        var uviIndexText = $("<span>");
        uviIndexText.text("UV Index: ");
        $("#currentUvi").append(uviIndexText);
        var currentCityUviHolder = $("<span>");
        if (currentCityUvi >= 0 && currentCityUvi <= 3) {
            currentCityUviHolder.attr("class", "low-uvi");
        } else if (currentCityUvi > 3 && currentCityUvi <= 6) {
            currentCityUviHolder.attr("class", "moderate-uvi");
        } else if (currentCityUvi > 6 && currentCityUvi <= 9) {
            currentCityUviHolder.attr("class", "high-uvi");
        };
    };

    function fiveDayForecast(results) {
        $("#forecast").text("");
        var forecastHeader = $("<h4>");
        forecastHeader.text("5-Day Forecast:");
        $("#forecast").append(forecastHeader);
        for (i = 1; i < 6; i++) {
            var forecastSquare = $("<div>");
            forecastSquare.attr("class", "col forecast-square");
            var forecastDateP = $("<p>");
            var forecastDate = results.daily[i].sunrise;
            var inMilliseconds = forecastDate * 1000;
            var inDateFormat = new Date(inMilliseconds);
            var currentIntMonth = inDateFormat.getMonth() + 1;
            var currentIntDay = inDateFormat.getDate();
            var currentIntYear = inDateFormat.getFullYear();
            var monthDayYear = currentIntMonth + "/" + currentIntDay + "/" + currentIntYear;
            forecastDateP.append(monthDayYear);
            var forecastWethImg = "assets/images/" + results.daily[i].weather[0].icon + "@2x.png";
            var forecastWethIcon = $("<img>");
            forecastWethIcon.attr("src", forecastWethImg);
            var forecastTempP = $("</p>");
            var forecastTemp = "Temp: " + results.daily[i].temp.max + " \u00B0F";
            forecastTempP.append(forecastTemp);
            var forecastHumP = $("<p>");
            var forecastHum = "Humidity: " + results.daily[i].humidity + "%";
            forecastHumP.append(forecastHum);
            forecastSquare.append(forecastDateP, forecastWethIcon, forecastTempP, forecastHumP);
            $("#forecast").append(forecastSquare);
        };
    };

    function initialzeLocalStorage () {
        if (localStorage.getItem('prevSearch') === null) {
            localStorage.setItem('prevSearch', '[]');
        } else if (localStorage.getItem('prevSearch') === '[]') {
            return;
        }
    }

    function addToSearchHist(newCityName) {
        initialzeLocalStorage()
        var searchHistory = JSON.parse(localStorage.getItem('prevSearch'));
        searchHistory.unshift(newCityName);
        localStorage.setItem('prevSearch', JSON.stringify(searchHistory));
        displaySearchHistory()
    }

    function displaySearchHistory() {
        $("#searchHistory").text("");
        var searchHistory = JSON.parse(localStorage.getItem("prevCityWeatherSrch"));
        for (i = 0; i < searchHistory.length; i++) {
            $("#searchHistory").append("<br>");
            var searchBtn = $("<button>");
            searchBtn.addClass("btn btn-info prvCity");
            searchBtn.attr("type", "button");
            searchBtn.attr("id", searchHistory[i]);
            searchBtn.text(searchHistory[i]);
            $("#searchHistory").append(citySrchBtn);
            if ([i] > 5) {
                return;
            };
        };
    };
})