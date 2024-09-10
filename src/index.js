import "./styles.css";


const data = getData("Đà Nẵng").then(processJson).then(console.log);

async function getData(location) {
  try {
    let respone = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=AK7CDA3UGA9PB59F9RYJHRDTE`, {mode: 'cors'});
    const json = await respone.json();
    console.log(json);
    return json;
  }
  catch (e) {
    console.log("Error: " + e);
  }
}

async function processJson(json) {
  const data = {};
  data["address"] = json["resolvedAddress"];
  data["temp"] = json["currentConditions"]["temp"];
  data["feel"] = json["currentConditions"]["feelslike"];
  data["humidity"] = json["currentConditions"]["humidity"];
  data["uv"] = json["currentConditions"]["uvindex"];
  data["icon"] = json["currentConditions"]["icon"];
  return data;
}