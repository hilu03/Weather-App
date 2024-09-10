import "./styles.css";


const searchButton = document.querySelector(".search-button");
const inputLocation = document.querySelector(".location");
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
      console.log(data);
      displayResult(data);
    }
    catch(e) {
      displayError();
    }
  }
});

function displayResult(data) {
  const html = 
  `
    <div class="location">${data["location"]}</div>
    <div class="temperature">${data["temp"]}</div>
    <div class="humidity">${data["humidity"]}%</div>
    <div class="feel">${data["feel"]}</div>
    <div class="uv">${data["uv"]}</div>
    <div class="wind">${data["windspeed"]}</div>
    <div class="condition">${data["conditions"]}</div>
  `;
  result.innerHTML = html;
}

function displayError() {
  const html = "-_- Location not found! :(";
  result.innerHTML = html;
}

async function getData(location) {
  let response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=AK7CDA3UGA9PB59F9RYJHRDTE`, {mode: 'cors'});
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
  return data;
}