import "./styles.css";


const searchButton = document.querySelector(".search-button");
const inputLocation = document.querySelector(".location");
const img = document.querySelector("img");
searchButton.addEventListener("click", () => {
  const location = inputLocation.value;
  getData(location).then(processJson).then(console.log).catch(console.log);
  
});

async function getData(location) {
  let response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=AK7CDA3UGA9PB59F9RYJHRDTE`, {mode: 'cors'});
  if (response.status !== 200) {
    throw new Error("HTTP status " + response.status);
  }
  return response.json();
}

async function processJson(json) {
  const data = {};
  data["address"] = json["resolvedAddress"];
  data["timezone"] = json["tzoffset"];
  data["temp"] = json["currentConditions"]["temp"];
  data["feel"] = json["currentConditions"]["feelslike"];
  data["humidity"] = json["currentConditions"]["humidity"];
  data["uv"] = json["currentConditions"]["uvindex"];
  data["icon"] = json["currentConditions"]["icon"];
  data["conditions"] = json["currentConditions"]["conditions"];
  return data;
}