function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
    } else {
        console.log('Geolocation is not supported.');
    }
}

function success(position) {
    console.log('Latitude:', position.coords.latitude);
    console.log('Longitude:', position.coords.longitude);
}

function error(err) {
    console.log('Error occurred:', err.message);
}

getLocation();

async function getCurrentWeatherInfo() {
    
}

fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${51}&lon=${31}&appid=${"7e116dd2a795724c6bc7fcd06c96c407"}`)
.then(data => data.json())
.then(data => console.log(data))
.catch(console.log('ERRORR!!!'));

const chooseCity = document.querySelector('.search-choose');
chooseCity.textContent = `<option value="1">${data.name}</option>`