
$(document).ready(function () {
    var searchBtn = $('#searchBtn');

    searchBtn.on("click", function (e) {
        e.preventDefault();
        var cityName = $("#city").val();
        var apiKey = "b873cc8e2dbadecf45255f14f31f8170";
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&cnt=5&units=imperial&appid=" + apiKey;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (results) {
            weatherForecast(results);
            addToSearchHist(results.name);
        });
        $("#city").val("")
    });
})

function weatherForecast(results) {
    $(".hide").attr("class", "row");
    var currentCityName = results.name;
    $("#currentCityInfo").text(currentCityName + " ");
    var currentCityLon = results.coord.lon;
    var currentCityLat = results.coord.lat;
    findWithCoords(currentCityLat, currentCityLon);
    var currentCityDate = results.sys.sunrise;
    dateConverter(currentCityDate);
    var currentWeatherIcon = results.weather[0].icon;
    weatherIcon(currentWeatherIcon);
};

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

function initialzeLocalStorage () {
    if (localStorage.getItem('prevSearch') === null) {
        localStorage.setItem('prevSearch', '[]');
    } else if (localStorage.getItem('prevSearch') === '[]') {
        return;
    }
}

