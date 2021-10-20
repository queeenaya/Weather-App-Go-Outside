const express = require("express");
const ejs = require("ejs");
const request = require("request");
const moment = require("moment");

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res) {

    res.render("index", {
        weather: null, 
        error: null,
        city: "Nur-Sultan",
        temp: -1,
        pressure: 1014,
        image: null,
        desc: "smoke",
        visibility: 8.1,
        humidity: 73,
        speed: 6,
        day: "Monday",
        formattedDay: "18 October, 2020",
        sunrise: "07:45 am",
        sunset: "18:01 pm"
    });
    
});


app.post("/", function(req, res) {
    
    const city = req.body.city;
    const apiKey = "API KEY";
    const unit = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?appid=" + apiKey + "&q=" + city + "&units=" + unit;

    request(url, function(err, responce, body) {
        
        if (err) {
            res.render("index", {weather: null, error: "Error, please try again!"});
        } else {
            const weather = JSON.parse(body);
            
            console.log(weather);

            if (weather.main == undefined) {
                res.render('index', { weather: null, error: 'Error, please try again' });
            } else {
                // let unix_timestamp = `${weather.sys.sunrise}`;
                // const date = new Date(unix_timestamp * 1000);
                // const sunrise = date.getHours() + ":" + getMinutes().substr(-2);
                const temp = `${weather.main.temp}`,
                desc = `${weather.weather[0].description}`,
                icon = `${weather.weather[0].icon}`,
                imageURL =  `${"http://openweathermap.org/img/wn/" + icon + "@2x.png"}`,
                pressure = `${weather.main.pressure}`,
                humidity = `${weather.main.humidity}`,
                visibility = `${weather.visibility}`,
                speed = `${weather.wind.speed}`,
                sunrise = `${weather.sys.sunrise}`,
                sunset = `${weather.sys.sunset}`;
                
                const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];                
                const currentDay = new Date();

                const formattedDay = currentDay.getDate() + " " + months[currentDay.getMonth()] + ", " + currentDay.getFullYear();

                const formattedSunrise = moment(sunrise * 1000).format('HH:mm a');

                const formattedSunset = moment(sunset * 1000).format('HH:mm a');

                res.render("index", {
                    weather: weather,
                    error: null,
                    city: city,
                    temp: temp,
                    pressure: pressure,
                    image: imageURL,
                    desc: desc,
                    visibility: visibility,
                    humidity: humidity,
                    speed: speed,
                    day: days[currentDay.getDay()],
                    formattedDay: formattedDay,
                    sunrise: formattedSunrise,
                    sunset: formattedSunset
                });
            }
        }  
    });
});


app.listen(process.env.PORT || 3000, function() {
    console.log("Server is running on port 3000.");

});
