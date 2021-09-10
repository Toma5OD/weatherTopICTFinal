"use strict";

const logger = require("../utils/logger");
const stationStore = require("../models/station-store");
const uuid = require("uuid");
const axios = require("axios");
const oneCallRequest = `https://api.openweathermap.org/data/2.5/onecall?lat=52.160858&lon=-7.152420&units=metric&appid=6f24f9a7a44944d32189a230464945f8`;
const stationAnalytics = require("../utils/station-analytics");

const station = {
  index(request, response) {
    const stationId = request.params.id;
    logger.debug("Station id = ", stationId);
    const station = stationStore.getStation(stationId);
    const readingId = request.params.readingid;

    if (station.readings.length > 0) {
      const latestReading = stationAnalytics.getLatestReading(station);
      console.log(latestReading);
      const latestMain = stationAnalytics.getLatestMain(station);
      const latestIcon = stationAnalytics.getLatestIcon(station);
      const maxTemperature = stationAnalytics.getMaxTemperature(station);
      const minTemperature = stationAnalytics.getMinTemperature(station);
      const maxPressure = stationAnalytics.getMaxPressure(station);
      const minPressure = stationAnalytics.getMinPressure(station);
      const temperature = stationAnalytics.temperature(station);
      const getTempOne = stationAnalytics.getTempOne(station);
      const getTempTwo = stationAnalytics.getTempTwo(station);
      const getWindOne = stationAnalytics.getWindOne(station);
      const getWindTwo = stationAnalytics.getWindTwo(station);
      const getPressureOne = stationAnalytics.getPressureOne(station);
      const getPressureTwo = stationAnalytics.getPressureTwo(station);
      const getTempTrend = stationAnalytics.getTempTrend(getTempOne, getTempTwo);
      const getWindTrend = stationAnalytics.getTempTrend(getWindOne, getWindTwo);
      const getPressureTrend = stationAnalytics.getTempTrend(getPressureOne, getPressureTwo);
      const temperatures = stationAnalytics.getChartTemperatureData();

      station.maxTemperature = stationAnalytics.getMaxTemperature(station);
      station.minTemperature = stationAnalytics.getMinTemperature(station);
      station.maxWindSpeed = stationAnalytics.getMaxWindSpeed(station);
      station.minWindSpeed = stationAnalytics.getMinWindSpeed(station);
      station.maxPressure = stationAnalytics.getMaxPressure(station);
      station.minPressure = stationAnalytics.getMinPressure(station);
      station.latestIcon = stationAnalytics.getLatestIcon(station);
      station.latestMain = stationAnalytics.getLatestMain(station);
      
      station.getTempOne = stationAnalytics.getTempOne(station);
      station.getTempTwo = stationAnalytics.getTempTwo(station);
      station.getTempTrend = getTempTrend;
      station.getWindOne = stationAnalytics.getWindOne(station);
      station.getWindTwo = stationAnalytics.getWindTwo(station);
      station.getWindTrend = getWindTrend;
      station.getPressureOne = stationAnalytics.getPressureOne(station);
      station.getPressureTwo = stationAnalytics.getPressureTwo(station);
      station.getPressureTrend = getPressureTrend;
      station.getChartTemp = stationAnalytics.getChartTemperatureData();
      

      const viewData = {
        title: "Station",
        station: stationStore.getStation(stationId),
        latestIcon: latestIcon,
        latestMain: latestMain,
        maxTemperature: maxTemperature,
        minTemperature: minTemperature,
        maxPressure: maxPressure,
        minPressure: minPressure,
        latestBft: stationAnalytics.convertToWindSpeedBft(
          latestReading.windSpeed
        ),
        windCompass: stationAnalytics.showWindCompass(
          latestReading.windDirection
        ),
        windChill: stationAnalytics.showWindChill(
          latestReading.temperature,
          latestReading.windSpeed
        ),
        getTempOne: getTempOne,
        getTempTwo: getTempTwo,
        getWindOne: getWindOne,
        getWindTwo: getWindTwo,
        getPressureOne: getPressureOne,
        getPressureTwo: getPressureTwo,
        getTempTrend: getTempTrend,
        getWindTrend: getWindTrend,
        getPressureTrend: getPressureTrend,
        temperatures: temperatures,
        
      };
      logger.info("about to test test", stationAnalytics.getChartTemperatureData());
      response.render("station", viewData);
    } else {
      const viewData = {
        title: "Station",
        station: stationStore.getStation(stationId)
      };
      response.render("station", viewData);
    }
  },

  deleteReading(request, response) {
    const stationId = request.params.id;
    const readingId = request.params.readingid;
    logger.debug(`Deleting Reading ${readingId} from Station ${stationId}`);
    stationStore.removeReading(stationId, readingId);
    response.redirect("/station/" + stationId);
  },
  
  async addReading(request, response) {
    logger.info("rendering new report");
    let report = {};
    const stationId = request.params.id;
    const station = stationStore.getStation(stationId);
    const readingId = request.params.readingid;
    const lat = stationStore.getLat(stationId);
    const lng = stationStore.getLng(stationId);
    const requestUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&units=metric&appid=6f24f9a7a44944d32189a230464945f8`;
    const result = await axios.get(requestUrl);
    if (result.status == 200) {
      const reading = result.data.current;

      let unix_timestamp = reading.dt;
      // Create a new JavaScript Date object based on the timestamp
      // multiplied by 1000 so that the argument is in milliseconds, not seconds.
      var date = new Date(unix_timestamp * 1000);
      // Hours part from the timestamp
      report.date =
        date.getDate() +
        "/" +
        date.getMonth() +
        "/" +
        date.getFullYear() +
        " " +
        (1 + date.getHours()) +
        ":" +
        date.getMinutes();

      report.code = reading.weather[0].id;
      report.temperature = reading.temp;
      report.windSpeed = reading.wind_speed;
      report.pressure = reading.pressure;
      report.windDirection = reading.wind_deg;
      report.icon = reading.weather[0].icon;
      report.main = reading.weather[0].main;
      report.temperatureF = stationAnalytics.temperatureF(reading.temperature);
    }
    const newReading = {
      id: uuid.v1(),
      date: report.date,
      code: report.code,
      temperature: report.temperature,
      windSpeed: report.windSpeed,
      windDirection: report.windDirection,
      pressure: report.pressure,
      main: report.main,
      icon: "http://openweathermap.org/img/w/" + report.icon + ".png"
    };
    logger.debug("New Reading = ", newReading);
    stationStore.addReading(stationId, newReading);
    response.redirect("/station/" + stationId);
  },

  addReadingManually(request, response) {
    const stationId = request.params.id;
    const station = stationStore.getStation(stationId);
    var code = request.body.code;
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
    else
      (latestIcon = "http://openweathermap.org/img/w/01n.png"),
        (latestMain = "Null");

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
    const newReading = {
      id: uuid.v1(),
      date: date,
      code: request.body.code,
      temperature: request.body.temperature,
      windSpeed: request.body.windSpeed,
      windDirection: request.body.windDirection,
      pressure: request.body.pressure,
      icon: latestIcon,
      main: latestMain
    };
    logger.debug("New Reading = ", newReading);
    stationStore.addReading(stationId, newReading);
    response.redirect("/station/" + stationId);
  }
};

module.exports = station;
