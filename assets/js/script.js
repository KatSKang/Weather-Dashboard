var searchInput = document.getElementById('city-search');
var submitBtn = document.querySelector('.btn');
var cardDeck = document.querySelector('.card-deck');

var listBtn = ''; // need to insert into HTML using JS
var apiKey = '&appid=060124fc13f557f4671002d9efa9f884';

//gets weather for current day
function getDailyWeather () {
    var geoUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + searchInput.value + apiKey;

    fetch(geoUrl) //get lat and long for city entered in search
        .then(function (response) {
        if(!response.ok){
            throw response.json();
        } else {
            return response.json();
        }
        })
        .then(function (data) { //use the lat and long as param for weather call
            var lat = data[0].lat;
            var lon = data[0].lon;
            console.log('The latitude is ' + data[0].lat + ', the longitude is ' + data[0].lon);
            var weatherUrl = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&' + 'lon=' + lon + apiKey + '&units=imperial';
            return fetch(weatherUrl) // get weather info
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(weatherData) { //insert weather data into html
            console.log(weatherData);
            $('#cityname').text(weatherData.name);
            $('#date').text(`(${moment().format("l")})`); 
            $('#icon').attr('src',`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`);
            $('#temp1').text(weatherData.main.temp);
            $('#hum1').text(weatherData.main.humidity);
            $('#wind1').text(weatherData.wind.speed);
        })
};

//gets UV index for current day & next 5 days info
function getUvAndFive() {
    var geoUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + searchInput.value + apiKey;

    fetch(geoUrl) //get lat and long for city entered in search
        .then(function (response) {
        if(!response.ok){
            throw response.json();
        } else {
            return response.json();
        }
        })
        .then(function (data) { //use the lat and long as param for weather call
            var lat = data[0].lat;
            var lon = data[0].lon;
            var oneCallUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&' + 'lon=' + lon + apiKey+ '&units=imperial';
            return fetch(oneCallUrl) // get UV index + next 5 days
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(data) { //UV info
            console.log(data);
            var uvIndex = data.current.uvi;
            if(uvIndex <= 2.0) {
                $('#uv1').text(uvIndex);
                $('#uv1').addClass('bg-success');    
            } else if (uvIndex > 2 && uvIndex < 6) {
                $('#uv1').text(uvIndex);
                $('#uv1').addClass('bg-warning');
            } else if (uvIndex >= 6) {
                $('#uv1').text(uvIndex);
                $('#uv1').addClass('bg-danger');
            }

            var cardHtml = ''; //create the cards for the next 5 days
            for(var i = 1; i < 6; i++) {
                var icon = data.daily[i].weather[0].icon;
                var date = moment.unix(data.daily[i].dt).format("MM-DD-YYYY");
                cardHtml += `
                <div class="card" id="small-cards">
                <h5 class="card-title">${date}</h5>
                <img src="http://openweathermap.org/img/wn/${icon}@2x.png" class="card-img-top" alt="Weather description">
                    <div class="card-body">
                        <p class="card-text">Temp: ${data.daily[i].temp.day}°F</p>
                        <p class="card-text">Humidty: ${data.daily[i].humidity}%</p>
                        <p class="card-text">Wind: ${data.daily[i].wind_speed} mph</p>
                    </div>
                </div>`;
                cardDeck.innerHTML = cardHtml;
            }
        });
    };

//add city to search history list
var searchList = document.querySelector('.list-group');
var city = document.getElementById('city-search').value;
var cities = [];



// EVENT LISTENSERS 
submitBtn.addEventListener('click',getDailyWeather);
submitBtn.addEventListener('click',getUvAndFive);