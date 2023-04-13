var city;
var searchButton = document.getElementById("search-weather-btn")
var futureForecastDiv = document.getElementById("fivedayforecast")
var currentForecastDiv = document.getElementById("current-forecast")
var cityInput = document.getElementById("city-search")
var searchHistory = document.getElementById("search-history")
var currentForecast
var futureForecast
var futureForecastArray = []

searchButton.addEventListener("click", function(e){
    e.preventDefault;
    currentForecastDiv.innerHTML = ""
    futureForecastDiv.innerHTML = ""
    getAPI();
})


function getAPI(){

    var cityname = cityInput.value;

    var geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityname}&appid=b2ee8d56fc475c850f7278f3bba52805`;

    fetch(geocodeURL)
        .then (function (response) {
            return response.json();
        })
        .then (function (data){
            var lat = data[0].lat
            var lon = data[0].lon

            var requestURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=b2ee8d56fc475c850f7278f3bba52805&units=imperial`;


            fetch(requestURL)
                .then(function(response) {
                    return response.json();
                })

                .then (function(data){

                    for( let i=0; i<40; i=i+8 ){
                        futureForecastArray.push(data.list[i])
                    }
                    console.log(futureForecastArray)
                    generateContent();
                })


                var latlonArr = []
                latlonArr.push(lat, lon)
                localStorage.setItem(cityname, JSON.stringify(latlonArr))

                var citynameArr = []
                citynameArr.push(cityname)

                for (i = 0; i < citynameArr.length; i++){
                    var searchHistoryBtn = document.createElement("button")
                    searchHistoryBtn.textContent = citynameArr[i]
                    searchHistoryBtn.setAttribute("id", citynameArr[i])
                    searchHistory.appendChild(searchHistoryBtn)
                }

                searchHistoryBtn.addEventListener("click", function(e){
                    e.preventDefault;
                    console.log("click")
                })
                
                //for(var i = 0; i < data.length; i++){

                // // creates a card showing the current weather for a given location
                // var currentForecast = document.createElement("section");
                // currentForecast.setAttribute("class", "card")
                // currentForecastDiv.appendChild(currentForecast)
            //}
        })
}

function generateContent(){
    for (var i = 0; i < futureForecastArray.length; i++){
            futureForecast = document.createElement("section");
            futureForecast.setAttribute("class", "card col-2");

            //format unix timestamps to dates
            var futurecastDate = document.createElement("h4")
            var futurecastDateConversion = futureForecastArray[i].dt
            var futurecasteDateText = dayjs.unix(futurecastDateConversion)
            futurecastDate.textContent = futurecasteDateText.format("MMM DD, YYYY")

            // include icons
            var weatherIcon = document.createElement("img")
            var imageSource = futureForecastArray[i].weather[0].icon
            weatherIcon.setAttribute("src", "http://openweathermap.org/img/wn/" + imageSource + "@2x.png")

            // temperature
            var temperatureForecast = document.createElement("div")
            temperatureForecast.textContent = "Temp: " + futureForecastArray[i].main.temp + "°F"

            // wind
            var windForecast = document.createElement("div")
            windForecast.textContent = "Wind: " + futureForecastArray[i].wind.speed + " MPH"

            // humidity
            var humidityForecast = document.createElement("div")
            humidityForecast.textContent = "Humidity: " + futureForecastArray[i].main.humidity + "%"

        futureForecastDiv.appendChild(futureForecast);
        futureForecast.appendChild(futurecastDate)
        futureForecast.appendChild(weatherIcon)
        futureForecast.appendChild(temperatureForecast)
        futureForecast.appendChild(windForecast)
        futureForecast.appendChild(humidityForecast)
    }
}