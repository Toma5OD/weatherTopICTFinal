"use strict";

const logger = require("../utils/logger");
const stationStore = require("../models/station-store");

const reading = {
  index(request, response) {
    const stationId = request.params.id;
    const readingId = request.params.readingid;
    logger.debug(`Editing Reading ${readingId} from Station ${stationId}`);
    const viewData = {
      title: "Edit Reading",
      station: stationStore.getStation(stationId),
      reading: stationStore.getReading(stationId, readingId)
    };
    response.render("reading", viewData);
  },

  update(request, response) {
    const stationId = request.params.id;
    const readingId = request.params.readingid;
    const code = request.body.code;
    let latestMain = null;
    let latestIcon = null;

    if (code == 200 && code <= 232)
      (latestIcon = "http://openweathermap.org/img/w/11d.png"),
        (latestMain = "Thunderstorm");
    else if (code >= 300 && code <= 321)
      (latestIcon = "http://openweathermap.org/img/w/09d.png"),
        (latestMain = "Drizzle");
    else if (code >= 500 && code <= 504)
      (latestIcon = "http://openweathermap.org/img/w/10d.png"),
        (latestMain = "Rain");
    else if (code >= 511)
      (latestIcon = "http://openweathermap.org/img/w/13d.png"),
        (latestMain = "Rain");
    else if (code >= 520 && code <= 531)
      (latestIcon = "http://openweathermap.org/img/w/09d.png"),
        (latestMain = "Rain");
    else if (code >= 600 && code <= 622)
      (latestIcon = "http://openweathermap.org/img/w/13d.png"),
        (latestMain = "Snow");
    else if (code >= 701)
      (latestIcon = "http://openweathermap.org/img/w/50d.png"),
        (latestMain = "Mist");
    else if (code >= 711)
      (latestIcon = "http://openweathermap.org/img/w/50d.png"),
        (latestMain = "Smoke");
    else if (code >= 721)
      (latestIcon = "http://openweathermap.org/img/w/50d.png"),
        (latestMain = "Haze");
    else if (code >= 731)
      (latestIcon = "http://openweathermap.org/img/w/50d.png"),
        (latestMain = "Dust");
    else if (code >= 741)
      (latestIcon = "http://openweathermap.org/img/w/50d.png"),
        (latestMain = "Fog");
    else if (code >= 751)
      (latestIcon = "http://openweathermap.org/img/w/50d.png"),
        (latestMain = "Sand");
    else if (code >= 761)
      (latestIcon = "http://openweathermap.org/img/w/50d.png"),
        (latestMain = "Dust");
    else if (code >= 762)
      (latestIcon = "http://openweathermap.org/img/w/50d.png"),
        (latestMain = "Ash");
    else if (code >= 771)
      (latestIcon = "http://openweathermap.org/img/w/50d.png"),
        (latestMain = "Squall");
    else if (code >= 781)
      (latestIcon = "http://openweathermap.org/img/w/50d.png"),
        (latestMain = "Tornado");
    else if (code == 800)
      (latestIcon = "http://openweathermap.org/img/w/01d.png"),
        (latestMain = "Clear");
    else if (code == 801)
      (latestIcon = "http://openweathermap.org/img/w/02d.png"),
        (latestMain = "Clouds");
    else if (code == 802)
      (latestIcon = "http://openweathermap.org/img/w/03d.png"),
        (latestMain = "Clouds");
    else if (code == 803 || code == 804)
      (latestIcon = "http://openweathermap.org/img/w/04d.png"),
        (latestMain = "Clouds");
    else latestIcon = "http://openweathermap.org/img/w/01n.png",
      latestMain = "Null";
    
    var unix_timestamp = Math.floor(Date.now() / 1000);
    // Create a new JavaScript Date object based on the timestamp
    // multiplied by 1000 so that the argument is in milliseconds, not seconds.
    var date = new Date(unix_timestamp * 1000);
    // Hours part from the timestamp
    date =
      date.getDate() +
      "/" +
      date.getMonth() +
      "/" +
      date.getFullYear() +
      " " +
      (1 + date.getHours()) +
      ":" +
      date.getMinutes();

    const reading = stationStore.getReading(stationId, readingId);

    const newReading = {
      date: date,
      code: request.body.code,
      temperature: request.body.temperature,
      windSpeed: request.body.windSpeed,
      windDirection: request.body.windDirection,
      pressure: request.body.pressure,
      icon: latestIcon,
      main: latestMain
    };
    logger.debug(`Updating Reading ${readingId} from Station ${stationId}`);
    stationStore.updateReading(reading, newReading);
    response.redirect("/station/" + stationId);
  }
};

module.exports = reading;
