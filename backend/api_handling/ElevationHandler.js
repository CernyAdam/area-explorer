import { writeFileSync } from 'fs';
import { join } from 'path';

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
        elevationData.push({"latitude": addDecimalPoint(latitude, i), "longtitude": addDecimalPoint(longitude, j), "elevation": elevation});
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
    writeFileSync(filePath, JSON.stringify(elevationData, null, 1));
    console.log(`Elevation data saved to ${filePath}`);
  } catch (error) {
    console.error('Error:', error);
  }
}
//Fetch and save elevations in batches of 10
async function fetchAndSaveElevations(coordinates) {
  const batchSize = 10;
  for (let i = 0; i < coordinates.length; i += batchSize) {
    const batch = coordinates.slice(i, i + batchSize);
    const promises = batch.map(coord => getElevation(coord.latitude, coord.longitude));
    await Promise.all(promises);
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`Fetched elevations for ${i + 1} to ${i + batchSize} coordinates`);
  }
  await saveElevationToFile();
}
//Generate an array of coordinates to get elevation data for
function generateCoordinates() {
  const coordinates = [];
  for (let lat = -89; lat <= 90; lat++) {
    for (let lon = -179; lon <= 180; lon++) {
      if(lat == 0) coordinates.push({ latitude: -0, longitude: lon });
      if(lon == 0) coordinates.push({ latitude: lat, longitude: -0 });
      coordinates.push({ latitude: lat, longitude: lon });
    }
  }
  return coordinates;
}

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
  const coordinates = generateCoordinates();
  /*const coordinates = [
    { latitude: 34, longitude: -118 },
    { latitude: 40, longitude: -74 },
    { latitude: 51, longitude: -0 },
    { latitude: 48, longitude: 2 },
    { latitude: 35, longitude: 139 },
    { latitude: -33, longitude: 151 },
    { latitude: 55, longitude: 37 },
    { latitude: 39, longitude: 116 },
    { latitude: 19, longitude: 72 },
    { latitude: -23, longitude: -46 },
    { latitude: 37, longitude: -122 },
    { latitude: 52, longitude: 13 },
    { latitude: 41, longitude: 12 },
    { latitude: 45, longitude: -73 },
    { latitude: 28, longitude: 77 },
    { latitude: -34, longitude: -58 },
    { latitude: 1, longitude: 103 },
    { latitude: 31, longitude: 121 },
    { latitude: 13, longitude: 100 },
    { latitude: 22, longitude: 114 },
    { latitude: 40, longitude: 116 },
    { latitude: 35, longitude: -106 },
    { latitude: 59, longitude: 18 },
    { latitude: -0, longitude: 14 },
    { latitude: 0, longitude: 14 },
    { latitude: 0, longitude: 25 }
  ];
  */
  const elevationData = [];
  fetchAndSaveElevations(coordinates);
