"use strict";

const accounts = require("./accounts.js");
const logger = require("../utils/logger");
const stationStore = require("../models/station-store");
const uuid = require("uuid");
const stationAnalytics = require("../utils/station-analytics");

const dashboard = {
  index(request, response) {
    const stationId = request.params.id;
    logger.info("dashboard rendering");
    const loggedInUser = accounts.getCurrentUser(request);
    const station = stationStore.getStation(stationId);
    const allStations = stationStore.getAllStations();
    const readingId = request.params.readingid;
    logger.debug("Station id = ", stationId);
    const stations = stationStore.getUserStations(loggedInUser.id);

    for (let i = 0; i < allStations.length; i++) {
      const station = allStations[i];
      station.maxTemperature = stationAnalytics.getMaxTemperature(station);
      station.minTemperature = stationAnalytics.getMinTemperature(station);
      station.latestIcon = stationAnalytics.getLatestIcon(station);
      station.latestMain = stationAnalytics.getLatestMain(station);
      station.minWindSpeed = stationAnalytics.getMinWindSpeed(station);
      station.maxWindSpeed = stationAnalytics.getMaxWindSpeed(station);
      station.minPressure = stationAnalytics.getMinPressure(station);
      station.maxPressure = stationAnalytics.getMaxPressure(station);
      station.tempTrend = stationAnalytics.getTempTrend(station);
      station.windTrend = stationAnalytics.getWindTrend(station);
      station.pressureTrend = stationAnalytics.getPressureTrend(station);
      station.getTempOne = stationAnalytics.getTempOne(station);
      station.getTempTwo = stationAnalytics.getTempTwo(station);
      station.getWindOne = stationAnalytics.getWindOne(station);
      station.getWindTwo = stationAnalytics.getWindTwo(station);
      station.getPressureOne = stationAnalytics.getPressureOne(station);
      station.getPressureTwo = stationAnalytics.getPressureTwo(station);
    }
    const viewData = {
      title: "Stations Dashboard",
      stations: stationStore.getUserStations(loggedInUser.id)
    };
    logger.info("about to render", stationStore.getAllStations());
    response.render("dashboard", viewData);
  },

  deleteStation(request, response) {
    const stationId = request.params.id;
    logger.debug(`Deleting Station ${stationId}`);
    stationStore.removeStation(stationId);
    response.redirect("/dashboard");
  },

  addStation(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    const newstation = {
      id: uuid.v1(),
      userid: loggedInUser.id,
      title: request.body.title,
      lat: request.body.lat,
      lng: request.body.lng,
      readings: []
    };
    logger.debug("Creating a new Station", newstation);
    stationStore.addStation(newstation);
    response.redirect("/dashboard");
  }
};

module.exports = dashboard;
