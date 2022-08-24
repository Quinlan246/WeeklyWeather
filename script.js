var apiKey = "b873cc8e2dbadecf45255f14f31f8170";

$(document).ready(function () {
    var searchBtn = $('#searchBtn');

    searchBtn.on("click", function (e) {
        e.preventDefault();
        var cityName = $("#city").val();
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

function initialzeLocalStorage () {
    if (localStorage.getItem('prevSearch') === null) {
        localStorage.setItem('prevSearch', '[]');
    } else if (localStorage.getItem('prevSearch') === '[]') {
        return;
    }
}