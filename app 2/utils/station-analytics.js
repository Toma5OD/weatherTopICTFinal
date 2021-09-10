"use strict";

const stationAnalytics = {
  getLatestReading(station) {
    let latestReading = null;

    if (station.readings.length > 0) {
      latestReading = station.readings[station.readings.length - 1];
    }

    station.latestBft = stationAnalytics.convertToWindSpeedBft(
      latestReading.windSpeed
    );

    station.pressure = latestReading.pressure;
    station.temperature = latestReading.temperature;
    station.temperatureF = stationAnalytics.temperatureF(
      latestReading.temperature
    );
    station.windCompass = stationAnalytics.showWindCompass(
      latestReading.windDirection
    );
    station.windChill = stationAnalytics
      .showWindChill(latestReading.temperature, latestReading.windSpeed)
      .toFixed(2);

    return latestReading;
  },

  getLatestIcon(station) {
    let latestIcon = null;
    if (station.readings.length > 0) {
      const code = station.readings[station.readings.length - 1].code;

      if (code >= 200 && code <= 232)
        latestIcon = "http://openweathermap.org/img/w/11d.png";
      else if (code >= 300 && code <= 321)
        latestIcon = "http://openweathermap.org/img/w/09d.png";
      else if (code >= 500 && code <= 504)
        latestIcon = "http://openweathermap.org/img/w/10d.png";
      else if (code == 511)
        latestIcon = "http://openweathermap.org/img/w/13d.png";
      else if (code >= 520 && code <= 531)
        latestIcon = "http://openweathermap.org/img/w/09d.png";
      else if (code >= 600 && code <= 622)
        latestIcon = "http://openweathermap.org/img/w/13d.png";
      else if (code == 701)
        latestIcon = "http://openweathermap.org/img/w/50d.png";
      else if (code == 711)
        latestIcon = "http://openweathermap.org/img/w/50d.png";
      else if (code == 721)
        latestIcon = "http://openweathermap.org/img/w/50d.png";
      else if (code == 731)
        latestIcon = "http://openweathermap.org/img/w/50d.png";
      else if (code == 741)
        latestIcon = "http://openweathermap.org/img/w/50d.png";
      else if (code == 751)
        latestIcon = "http://openweathermap.org/img/w/50d.png";
      else if (code == 761)
        latestIcon = "http://openweathermap.org/img/w/50d.png";
      else if (code == 762)
        latestIcon = "http://openweathermap.org/img/w/50d.png";
      else if (code == 771)
        latestIcon = "http://openweathermap.org/img/w/50d.png";
      else if (code == 781)
        latestIcon = "http://openweathermap.org/img/w/50d.png";
      else if (code == 800)
        latestIcon = "http://openweathermap.org/img/w/01d.png";
      else if (code == 801)
        latestIcon = "http://openweathermap.org/img/w/02d.png";
      else if (code == 802)
        latestIcon = "http://openweathermap.org/img/w/03d.png";
      else if (code >= 803 && code <= 804)
        latestIcon = "http://openweathermap.org/img/w/04d.png";
      else latestIcon = "http://openweathermap.org/img/w/01n.png";

      return latestIcon;
    }
  },

  getLatestMain(station) {
    let latestMain = null;
    if (station.readings.length > 0) {
      const code = station.readings[station.readings.length - 1].code;

      if (code >= 200 && code <= 232) latestMain = "Thunderstorm";
      else if (code >= 300 && code <= 321) latestMain = "Drizzle";
      else if (code >= 500 && code <= 504) latestMain = "Rain";
      else if (code == 511) latestMain = "Rain";
      else if (code >= 520 && code <= 531) latestMain = "Rain";
      else if (code >= 600 && code <= 622) latestMain = "Snow";
      else if (code == 701) latestMain = "Mist";
      else if (code == 711) latestMain = "Smoke";
      else if (code == 721) latestMain = "Haze";
      else if (code == 731) latestMain = "Dust";
      else if (code == 741) latestMain = "Fog";
      else if (code == 751) latestMain = "Sand";
      else if (code == 761) latestMain = "Dust";
      else if (code == 762) latestMain = "Ash";
      else if (code == 771) latestMain = "Squall";
      else if (code == 781) latestMain = "Tornado";
      else if (code == 800) latestMain = "Clear";
      else if (code == 801) latestMain = "Clouds";
      else if (code == 802) latestMain = "Clouds";
      else if (code >= 803 && code <= 804) latestMain = "Clouds";
      else latestMain = "Null";

      return latestMain;
    }
  },

  convertToWindSpeedBft(windSpeed) {
    if (windSpeed == 1) return 0;
    else if (windSpeed >= 1 && windSpeed <= 5) return 1;
    else if (windSpeed >= 6 && windSpeed <= 11) return 2;
    else if (windSpeed >= 12 && windSpeed <= 19) return 3;
    else if (windSpeed >= 20 && windSpeed <= 28) return 4;
    else if (windSpeed >= 29 && windSpeed <= 38) return 5;
    else if (windSpeed >= 39 && windSpeed <= 49) return 6;
    else if (windSpeed >= 50 && windSpeed <= 61) return 7;
    else if (windSpeed >= 62 && windSpeed <= 74) return 8;
    else if (windSpeed >= 75 && windSpeed <= 88) return 9;
    else if (windSpeed >= 89 && windSpeed <= 102) return 10;
    else if (windSpeed >= 103 && windSpeed <= 117) return 11;
    else return 0;
  },

  showWindCompass(windDirection) {
    if (windDirection >= 0 && windDirection <= 11.25) return "North";
    else if (windDirection >= 11.25 && windDirection <= 33.75)
      return "North North East";
    else if (windDirection >= 33.75 && windDirection <= 56.25)
      return "North East";
    else if (windDirection >= 56.25 && windDirection <= 78.75)
      return "East North East";
    else if (windDirection >= 78.75 && windDirection <= 101.25) return "East";
    else if (windDirection >= 101.25 && windDirection <= 123.75)
      return "East South East";
    else if (windDirection >= 123.75 && windDirection <= 146.25)
      return "South East";
    else if (windDirection >= 146.25 && windDirection <= 168.75)
      return "South South East";
    else if (windDirection >= 168.75 && windDirection <= 191.25) return "South";
    else if (windDirection >= 191.25 && windDirection <= 213.75)
      return "South South West";
    else if (windDirection >= 213.75 && windDirection <= 236.25)
      return "South West";
    else if (windDirection >= 236.25 && windDirection <= 258.75)
      return "West South West";
    else if (windDirection >= 258.75 && windDirection <= 281.25) return "West";
    else if (windDirection >= 281.25 && windDirection <= 303.75)
      return "West North West";
    else if (windDirection >= 303.75 && windDirection <= 326.25)
      return "North West";
    else if (windDirection >= 326.25 && windDirection <= 348.75)
      return "North North West";
    return "invalid code";
  },

  temperature(temperature) {
    return temperature;
  },

  temperatureF(temperature) {
    if (temperature) {
      let number = temperature * 1.8 + 32;
      return Math.round(number * 100) / 100;
    }
  },

  showWindChill(temperature, windSpeed) {
    var number = null;
    if (temperature && windSpeed) {
      number =
        13.12 +
        0.6215 * temperature -
        11.37 * Math.pow(windSpeed, 0.16) +
        0.3965 * temperature * Math.pow(windSpeed, 0.16);
    }
    return Math.round(number * 100) / 100;
  },

  getMaxTemperature(station) {
    let maxTemperature = 0;
    if (station.readings.length > 0) {
      maxTemperature = station.readings[0].temperature;
      for (let i = 1; i < station.readings.length; i++) {
        if (station.readings[i].temperature > maxTemperature) {
          maxTemperature = station.readings[i].temperature;
        }
      }
    }
    return maxTemperature;
  },
  
  getChartTemperatureData(){
    let chartData = [45, 40, 30, 60];
    
    // if (station.readings.length > 0) {
    //   for (let i = 0; i < station.readings.length; i++) {
    //     chartData[i] = station.readings[i].temperature;
    //   }
    // }
    return chartData;
  },

  getMinTemperature(station) {
    let minTemperature = 0;
    if (station.readings.length > 0) {
      minTemperature = station.readings[0].temperature;
      for (let i = 1; i < station.readings.length; i++) {
        if (station.readings[i].temperature < minTemperature) {
          minTemperature = station.readings[i].temperature;
        }
      }
    }
    return minTemperature;
  },

  getMaxWindSpeed(station) {
    let maxWindSpeed = 0;
    if (station.readings.length > 0) {
      maxWindSpeed = station.readings[0].windSpeed;
      for (let i = 1; i < station.readings.length; i++) {
        if (station.readings[i].windSpeed > maxWindSpeed) {
          maxWindSpeed = station.readings[i].windSpeed;
        }
      }
    }
    return maxWindSpeed;
  },

  getMinWindSpeed(station) {
    let minWindSpeed = 0;
    if (station.readings.length > 0) {
      minWindSpeed = station.readings[0].windSpeed;
      for (let i = 1; i < station.readings.length; i++) {
        if (station.readings[i].windSpeed < minWindSpeed) {
          minWindSpeed = station.readings[i].windSpeed;
        }
      }
    }
    return minWindSpeed;
  },

  getMaxPressure(station) {
    let maxPressure = 0;
    if (station.readings.length > 0) {
      maxPressure = station.readings[0].pressure;
      for (let i = 1; i < station.readings.length; i++) {
        if (station.readings[i].pressure > maxPressure) {
          maxPressure = station.readings[i].pressure;
        }
      }
    }
    return maxPressure;
  },

  getMinPressure(station) {
    let minPressure = 0;
    if (station.readings.length > 0) {
      minPressure = station.readings[0].pressure;
      for (let i = 1; i < station.readings.length; i++) {
        if (station.readings[i].pressure < minPressure) {
          minPressure = station.readings[i].pressure;
        }
      }
    }
    return minPressure;
  },

  getTempOne(station) {
    let tempTrend = null;
    if (station.readings.length > 1) {
      tempTrend = station.readings[station.readings.length - 1].temperature;
    }
    return tempTrend;
  },

  getTempTwo(station) {
    let tempTrend = null;
    if (station.readings.length > 1) {
      tempTrend = station.readings[station.readings.length - 2].temperature;
    }
    return tempTrend;
  },

  getWindOne(station) {
    let windTrend = null;
    if (station.readings.length > 1) {
      windTrend = station.readings[station.readings.length - 1].windSpeed;
    }
    return windTrend;
  },

  getWindTwo(station) {
    let windTrend = null;
    if (station.readings.length > 1) {
      windTrend = station.readings[station.readings.length - 2].windSpeed;
    }
    return windTrend;
  },

  getPressureOne(station) {
    let pressureTrend = null;
    if (station.readings.length > 1) {
      pressureTrend = station.readings[station.readings.length - 1].pressure;
    }
    return pressureTrend;
  },

  getPressureTwo(station) {
    let pressureTrend = null;
    if (station.readings.length > 1) {
      pressureTrend = station.readings[station.readings.length - 2].pressure;
    }
    return pressureTrend;
  },

  getTempTrend(getTempOne, getTempTwo) {
    if (getTempOne > getTempTwo) return "big green sort up icon";
    else if (getTempTwo > getTempOne) return "big red sort down icon";
    return "big yellow sort icon";
  },

  getWindTrend(getWindOne, getWindTwo) {
    if (getWindOne > getWindTwo) return "big green sort up icon";
    else if (getWindTwo > getWindOne) return "big red sort down icon";
    return "big yellow sort icon";
  },

  getPressureTrend(getPressureOne, getPressureTwo) {
    if (getPressureOne > getPressureTwo) return "big green sort up icon";
    else if (getPressureTwo > getPressureOne) return "big red sort down icon";
    return "big yellow sort icon";
  },
  
  getChartTemp(station){
     for (let i=0; i<station.readings.length; i++) {
        report.windyTrend.push(trends[i].wind_speed.day);
        const date1 = new Date(trends[i].dt * 1001);
        report.trendLabels1.push(`${date1.getDate()}/${date1.getMonth()}/${date1.getFullYear()}` );
      }
  }
};

module.exports = stationAnalytics;
