var searchInput = document.getElementById('city-name');
var submitBtn = document.querySelector('.btn');
var temp1 = document.getElementById('temp1');



var listBtn = ''; // need to insert into HTML using JS
var apiKey = '&appid=060124fc13f557f4671002d9efa9f884';

function getDailyWeather () {
    var geoUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + searchInput.value + apiKey;

    fetch(geoUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var lat = data[0].lat;
            var lon = data[0].lon;
            console.log('The latitude is ' + data[0].lat + ', the longitude is ' + data[0].lon);
            var weatherUrl = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&' + 'lon=' + lon + apiKey;
            return fetch(weatherUrl)
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);
            console.log('The temp is ' + data.main.temp);


        })
        .catch(function(error) {
            console.log('Request failed', error);
        });
};













// EVENT LISTENSERS 
submitBtn.addEventListener('click',getDailyWeather);

