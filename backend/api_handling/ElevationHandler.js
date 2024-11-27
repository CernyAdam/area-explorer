import { writeFileSync } from 'fs';
import { join } from 'path';

//Array to store elevation data
const elevationData = [];
//Range of coordinates to get elevation data for
const range = 1;
//API call to Open Meteo API to get elevation data
async function getElevation(latitude, longitude) {
  let latitudes = "";
  let longitudes = "";
  //Create a string of latitudes and longitudes to pass to the API
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      latitudes += `${addDecimalPoint(latitude, i)},`;
      longitudes += `${addDecimalPoint(longitude,j)},`;
    }
  }
  // Base URL for Open Meteo Elevation API
  const apiUrl = `https://api.open-meteo.com/v1/elevation?latitude=${latitudes}&longitude=${longitudes}`;
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch data from Open Meteo API');
    }
    const data = await response.json();
    //Extract elevation data and log it to the console
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const elevation = data.elevation[(i * 10) + j];
        console.log(`The elevation at latitude ${addDecimalPoint(latitude, i)}, longitude ${addDecimalPoint(longitude, j)} is ${elevation} meters.`);
        elevationData.push({"la": addDecimalPoint(latitude, i), "lo": addDecimalPoint(longitude, j), "el": elevation});
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

//Save elevation data to a JSON file
async function saveElevationToFile() {
  try {
    const filePath = join('backend/data/', 'elevationData.json');
    writeFileSync(filePath, JSON.stringify(elevationData, null, 0));
    console.log(`Elevation data saved to ${filePath}`);
  } catch (error) {
    console.error('Error:', error);
  }
}
//Fetch elevations in batches of 10
async function fetchElevations(coordinates) {
  const batchSize = 10;
  for (let i = 0; i < coordinates.length; i += batchSize) {
    const batch = coordinates.slice(i, i + batchSize);
    const promises = batch.map(coord => getElevation(coord.latitude, coord.longitude));
    await Promise.all(promises);
    await new Promise(resolve => setTimeout(resolve, 50));
    console.log(`Fetched elevations for ${i + 1} to ${i + batchSize} coordinates`);
  }
}
//Fetch and save elevations in batches of 10
async function fetchAndSaveElevations(coordinates) {
  const batchSize = 10;
  for (let i = 0; i < coordinates.length; i += batchSize) {
    const batch = coordinates.slice(i, i + batchSize);
    const promises = batch.map(coord => getElevation(coord.latitude, coord.longitude));
    await Promise.all(promises);
    await new Promise(resolve => setTimeout(resolve, 50));
    console.log(`Fetched elevations for ${i + 1} to ${i + batchSize} coordinates`);
  }
  await saveElevationToFile();
}
//Generate an array of coordinates to get elevation data for
function generateCoordinates(lt = 7.0, ln = 7.0) {
  const coordinates = [];
  for (let lat = lt - range; lat <= lt + range ; lat += 0.1) {
    lat = Math.round(lat * 10) / 10;
    for (let lon = ln - range; lon <= ln + range; lon += 0.1) {
      lon = Math.round(lon * 10) / 10;
      console.log(`Latitude: ${lat}, Longitude: ${lon}`);
      if(lat == 0) coordinates.push({ latitude: -0, longitude: lon });
      if(lon == 0) coordinates.push({ latitude: lat, longitude: -0 });
      coordinates.push({ latitude: lat, longitude: lon });
    }
  }
  return coordinates;
}

function addDecimalPoint(num, decimalValue) {
  const isNegativeZero = Object.is(num, -0);
  const decimalTemp = "0.0" + decimalValue.toString();
  decimalValue = parseFloat(decimalTemp);
  if(isNegativeZero) {
    return -0.01;
  }
  if (num < 0) {
    return Math.round((num - decimalValue) * 100) / 100;
  } else {
   return Math.round((num + decimalValue) * 100) / 100;
  }
}
/* DEPRECATED
//Add a decimal point to a number with respect to -0  
function addDecimalPoint(num, decimalValue) {
  const isNegativeZero = Object.is(num, -0);
  let numStr = num.toString();
  if (isNegativeZero) {
    numStr = "-0";
  }
  if (numStr.indexOf('.') === -1) {
    numStr += '.' + decimalValue;
  } else {
    numStr += decimalValue;
  }
  let result = parseFloat(numStr);
  return result;
}
*/
//Export the getElevation function
export  function ElevationHandler(latitude, longitude) {

  const coordinates = generateCoordinates(latitude, longitude);
  fetchElevations(coordinates);
  return elevationData;

}

/* TESTING ONLY
const coordinates = generateCoordinates();
fetchAndSaveElevations(coordinates);
*/