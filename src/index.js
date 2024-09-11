import "./styles.css";
import temperatureIcon from "./icons/temp.png";

const icons = importAllIcons(require.context('./icons', false, /.svg$/));


const searchButton = document.querySelector(".search-button");
const inputLocation = document.querySelector(".location-input");
const degreeSelect = document.querySelector("#degree");
const result = document.querySelector(".result");

searchButton.addEventListener("click", async () => {
  const location = inputLocation.value;
  if (location.trim().length === 0) {
    alert("Please input location first!!!");
  }
  else {    
    try {
      const json = await getData(location);
      const data = await processJson(json);
      document.querySelector("body").style.background = `url(${await getGif(data["icon"])}) no-repeat fixed center center / cover`;
      const degreeUnit = degreeSelect.value;
      displayResult(data, degreeUnit);
    }
    catch(e) {
      displayError(e);
    }
  }
});

async function getGif(condition) {
  let response = await fetch(`//api.giphy.com/v1/gifs/translate?api_key=f0S3OQshNUs0ZdWgaQaYiBIqqwEuYK6D&s=${condition}`, {mode: 'cors'});
  if (response.status !== 200) {
    throw new Error("HTTP status " + response.status);
  }
  const json = await response.json();
  return json.data.images.original.url;
}

function importAllIcons(r) {
  const img = {}
  r.keys().forEach(key => {
    img[`${key.substring(2, key.indexOf(".svg"))}`] = r(key);
  });
  return img;
}

function CelsiusToFahrenheit(cTemp) {
  return ((Number(cTemp) * 9 / 5) + 32).toFixed(1);
}

function displayResult(data, degreeUnit) {
  if (degreeUnit === "F") {
    data["temp"] = CelsiusToFahrenheit(data["temp"]);
    data["feel"] = CelsiusToFahrenheit(data["feel"]);
  }
  const html = 
  `
    <div class="left">
      <div class="location">${data["location"]}</div>
      <div class="condition">${data["conditions"]}</div>
      <div class="humidity">Humidity: ${data["humidity"]}%</div>
      <div class="wind">Wind speed: ${data["windspeed"]}km/h</div>
    </div>
    <div class="right">
      <img class="icon" src="${icons[data['icon']]}">
      <div class="temperature">
        <div class=temp-icon>
          <img src=${temperatureIcon}>
        </div>
        <div class="temp">
          ${data["temp"]}&deg;${degreeUnit}
        </div>
      </div>
      <div class="feel">Feel: ${data["feel"]}&deg;${degreeUnit}</div>
      <div class="uv">UV: ${data["uv"]}</div>
    </div>
  `;
  result.innerHTML = html;
}

function displayError(e) {
  const html = "-_- Location not found! :(";
  result.innerHTML = html;
  console.log(e);
}

async function getData(location) {
  let response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=AK7CDA3UGA9PB59F9RYJHRDTE&unitGroup=metric`, {mode: 'cors'});
  if (response.status !== 200) {
    throw new Error("HTTP status " + response.status);
  }
  return response.json();
}

async function processJson(json) {
  const data = {};
  data["location"] = json["resolvedAddress"];
  data["temp"] = json["currentConditions"]["temp"];
  data["feel"] = json["currentConditions"]["feelslike"];
  data["humidity"] = json["currentConditions"]["humidity"];
  data["uv"] = json["currentConditions"]["uvindex"];
  data["windspeed"] = json["currentConditions"]["windspeed"];
  data["conditions"] = json["currentConditions"]["conditions"];
  data["icon"] = json["currentConditions"]["icon"];
  return data;
}