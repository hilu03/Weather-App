import "./styles.css";

getData("Đà Nẵng");

async function getData(location) {
  try {
    let respone = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=AK7CDA3UGA9PB59F9RYJHRDTE`, {mode: 'cors'});
    const json = await respone.json();
    console.log(json);
  }
  catch (e) {
    console.log("Error!");
  }
}