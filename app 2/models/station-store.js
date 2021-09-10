"use strict";

const logger = require("../utils/logger");
const _ = require("lodash");
const JsonStore = require("./json-store");
const stationAnalytics = require("../utils/station-analytics");
const axios = require("axios");
const oneCallRequest = `https://api.openweathermap.org/data/2.5/onecall?lat=52.160858&lon=-7.152420&units=metric&appid=6f24f9a7a44944d32189a230464945f8`;

const stationStore = {
  store: new JsonStore("./models/station-store.json", {
    stationCollection: []
  }),
  collection: "stationCollection",

  getAllStations() {
    return this.store.findAll(this.collection);
  },

  getStation(id) {
    return this.store.findOneBy(this.collection, { id: id });
  },

  getUserStations(userid) {
    let stations = this.store.findBy(this.collection, { userid: userid });
    const orderedStations = _.sortBy(stations, o => o.title);
    return orderedStations;
  },

  addStation(station) {
    this.store.add(this.collection, station);
    this.store.save();
  },

  removeStation(id) {
    const station = this.getStation(id);
    this.store.remove(this.collection, station);
    this.store.save();
  },

  removeAllStations() {
    this.store.removeAll(this.collection);
    this.store.save();
  },

  addReading(id, reading) {
    const station = this.getStation(id);
    station.readings.push(reading);

    this.store.save();
  },

  station(name, lat, lng) {
    this.name = name;
    this.latitude = lat;
    this.longitude = lng;
  },

  removeReading(id, readingId) {
    const station = this.getStation(id);
    const readings = station.readings;
    _.remove(readings, { id: readingId });
    this.store.save();
  },

  getReading(id, readingId) {
    const station = this.store.findOneBy(this.collection, { id: id });
    const readings = station.readings.filter(
      reading => reading.id == readingId
    );
    return readings[0];
  },

  getLat(id, reading) {
    const station = this.getStation(id);
    const readings = station.readings;
    var lat = station.lat;
    return lat;
  },

  getLng(id, reading) {
    const station = this.store.findOneBy(this.collection, { id: id });
    const readings = station.readings;
    var lng = station.lng;
    return lng;
  },

  updateReading(reading, updatedReading) {
    reading.date = updatedReading.date;
    reading.code = updatedReading.code;
    reading.temperature = updatedReading.temperature;
    reading.windSpeed = updatedReading.windSpeed;
    reading.windDirection = updatedReading.windDirection;
    reading.pressure = updatedReading.pressure;
    reading.icon = updatedReading.icon;
    reading.main = updatedReading.main;
    this.store.save();
  }
};

module.exports = stationStore;
