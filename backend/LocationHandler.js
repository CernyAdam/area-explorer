//Get users current location
export function LocationHandler() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const roundedLatitude = parseFloat(position.coords.latitude.toFixed(1));
                    const roundedLongitude = parseFloat(position.coords.longitude.toFixed(1));
                    resolve({ latitude: roundedLatitude, longitude: roundedLongitude });
                },
                (error) => {
                    reject(error);
                }
            );
        } else {
            reject(new Error("Geolocation is not supported by this browser."));
        }
    });
}

//Save users latitude and longtitude to local storage
export function saveLocation(latitude, longitude) {
    localStorage.setItem("latitude", latitude);
    localStorage.setItem("longitude", longitude);
}

//Get users latitude and longtitude from local storage
export function getLocation() {
    const latitude = localStorage.getItem("latitude");
    const longitude = localStorage.getItem("longitude");
    return { latitude, longitude };
}
