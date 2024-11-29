import { ElevationHandler } from "./api_handling/ElevationHandler.js";

// Save elevation data to local cache
async function saveToLocalCache(latitude, longitude) {
  try {
    console.log("Fetching elevation data");
    const elevationData = await ElevationHandler(latitude, longitude);
    const cacheEntry = {
      data: elevationData,
      timestamp: Date.now()
    };
    localStorage.setItem("elevationData", JSON.stringify(cacheEntry));
  } catch (error) {
    console.error("Failed to fetch elevation data:", error);
    throw error;
  }
}

// Get elevation data from local cache
export function getFromLocalCache() {
  const elevationDataString = localStorage.getItem("elevationData");
  if (!elevationDataString) return null;
  const cacheEntry = JSON.parse(elevationDataString);
  return cacheEntry.data;
}

// Check if elevation data is in local cache
export async function CacheHandler(latitude, longitude) {
  const elevationData = getFromLocalCache();
  if (elevationData) {
    console.log("Elevation data found in cache");
  } else {
    console.log("Elevation data not found in cache");
    await saveToLocalCache(latitude, longitude);
  }
}