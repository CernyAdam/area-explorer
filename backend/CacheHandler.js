import { ElevationHandler } from "./api_handling/ElevationHandler.js";

// Save elevation data to local cache
async function saveToLocalCache(latitude, longitude) {
  console.log("Fetching elevation data");
  const elevationData = await ElevationHandler(latitude, longitude);
  localStorage.setItem("elevationData", JSON.stringify(elevationData));
}
// Get elevation data from local cache
export function getFromLocalCache() {
    const elevationDataString = localStorage.getItem("elevationData");
    return JSON.parse(elevationDataString);
}
// Check if elevation data is in local cache
export function CacheHandler(latitude, longitude) {
  const elevationData = getFromLocalCache();
  if (elevationData) {
    console.log(`Elevation data found in cache: ${elevationData}`);
  } else {
    console.log("Elevation data not found in cache");
    saveToLocalCache(latitude, longitude);
  }
}