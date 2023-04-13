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
    futureForecastDiv.innerHTML = ""
    getAPI();
})


function getAPI(){

    var cityname = cityInput.value;

    // pulls data from API based on city name
    var geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityname}&appid=b2ee8d56fc475c850f7278f3bba52805`;

    fetch(geocodeURL)
        .then (function (response) {
            return response.json();
        })
        .then (function (data){
            // converts city name to latitude and longitude
            var lat = data[0].lat
            var lon = data[0].lon

            // use lat and lon to get usable data from API
            var requestURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=b2ee8d56fc475c850f7278f3bba52805&units=imperial`;


            fetch(requestURL)
                .then(function(response) {
                    return response.json();
                })

                .then (function(data){

                    // pushes 5 day forecast to array
                    futureForecastArray = []
                    for( let i=0; i<40; i=i+8 ){
                        futureForecastArray.push(data.list[i])
                    }
                    console.log(futureForecastArray)
                    generateContent();
                })

                // pushes latitude and longitude to local storage under city name as key
                var latlonArr = []
                latlonArr.push(lat, lon)
                localStorage.setItem(cityname, JSON.stringify(latlonArr))

                // pushes city name to array
                var citynameArr = []
                citynameArr.push(cityname)

                // uses array to create buttons
                for (i = 0; i < citynameArr.length; i++){
                    var searchHistoryBtn = document.createElement("button")
                    searchHistoryBtn.textContent = citynameArr[i]
                    searchHistoryBtn.setAttribute("id", citynameArr[i])
                    searchHistory.appendChild(searchHistoryBtn)
                }

                searchHistoryBtn.addEventListener("click", function(e){
                    e.preventDefault;
                    futureForecastDiv.innerHTML = ""

                    // pulls latitude and longitude from local storage using the button ID as a key
                    var latlonArr2 = JSON.parse(localStorage.getItem(searchHistoryBtn.id))

                    // sets as new latitude and longitude variables
                    var lati = latlonArr2[0]
                    var long = latlonArr2[1]

                    // do another request from the open weather API, using new variable names to prevent overlap
                    var rerequestUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lati}&lon=${long}&appid=b2ee8d56fc475c850f7278f3bba52805&units=imperial`; 

                    // rerun the same process as above but with the new variables from local storage
                    fetch(rerequestUrl)
                        .then(function(response) {
                            return response.json();
                        })

                        .then (function(data){

                            // pushes 5 day forecast to array
                            futureForecastArray = []
                            for( let i=0; i<40; i=i+8 ){
                                futureForecastArray.push(data.list[i])
                            }
                            console.log(futureForecastArray)
                            generateContent();
                    })
                })
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


        // append to site
        futureForecastDiv.appendChild(futureForecast);
        futureForecast.appendChild(futurecastDate)
        futureForecast.appendChild(weatherIcon)
        futureForecast.appendChild(temperatureForecast)
        futureForecast.appendChild(windForecast)
        futureForecast.appendChild(humidityForecast)
    }
}