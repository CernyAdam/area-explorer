import { writeFileSync } from 'fs';
import { join } from 'path';

//API call to Open Meteo API to get elevation data
async function getElevation(latitude, longitude) {
  let latitudes = "";
  let longitudes = "";
  //Create a string of latitudes and longitudes to pass to the API
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      latitudes += `${latitude}.${i},`;
      longitudes += `${longitude}.${j},`;
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
        console.log(`The elevation at latitude ${latitude}.${i}, longitude ${longitude}.${j} is ${elevation} meters.`);
        elevationData.push({"latitude": parseFloat(latitude + '.' + i), "longtitude": parseFloat(longitude + '.' + j), "elevation": elevation});
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
    writeFileSync(filePath, JSON.stringify(elevationData, null, 2));
    console.log(`Elevation data saved to ${filePath}`);
  } catch (error) {
    console.error('Error:', error);
  }
}
//Call the getElevation function for each coordinate in the array and wait for all promises to resolve
async function fetchAndSaveElevations(coordinates) {
  const promises = coordinates.map(coord => getElevation(coord.latitude, coord.longitude));
  await Promise.all(promises);
  await saveElevationToFile();
}

//Generate an array of coordinates to get elevation data for
function generateCoordinates() {
  const coordinates = [];
  for (let lat = -90; lat <= 90; lat++) {
    for (let lon = -180; lon <= 180; lon++) {
      coordinates.push({ latitude: lat, longitude: lon });
    }
  }
  return coordinates;
}
  //const coordinates = generateCoordinates();
  const coordinates = [{latitude: 40, longitude: -100}];
  const elevationData = [];
  fetchAndSaveElevations(coordinates);
