let latitude, longitude;

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
    } else {
        console.log('Geolocation is not supported.');
    }
}

function success(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;

    setCurrentInformation();
}

function error(err) {
    console.log('Error occurred:', err.message);
}

const chooseCity = document.querySelector('.search-choose');
const currentMore = document.querySelector('.current__nav-list');
const currentWeather = document.querySelector('.current__today');

const chooseFilter = document.querySelector('.filter__choose');
const btns = document.querySelectorAll('.btn');

const cards = document.querySelector('.cards-container');

async function getCurrentWeatherInfo() {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${"7e116dd2a795724c6bc7fcd06c96c407"}&units=metric&lang=ru`);

        if (!response.ok) return new Error('Network problem.');

        const data = await response.json();

        console.log(data);
        return data;
    } catch (err) {
        console.error('Error');
    }
}

async function setCurrentInformation() {
    const moreInfo = await getCurrentWeatherInfo();

    chooseCity.innerHTML = `<option value="1">${moreInfo.name}</option>`;

    const icon = moreInfo.weather[0]?.icon;

    currentWeather.innerHTML = `
        <div class="current__today__block">
                        <div class="current__today-left">
                            <div class="current__info">
                                <h3 class="current__temp">${Math.round(moreInfo.main.temp)}°</h3>
                                <h3 class="current__label">Сегодня</h3>
                            </div>
                        </div>
                        <div class="current__today-right">
                            <img class="current__icon" src=${`https://openweathermap.org/img/wn/${icon}@2x.png`} alt="Sunny" />
                        </div>
                    </div>
                    <div class="current__time">
                        <time class="current__time-current">${new Date().getHours()}</time>
                        <h3 class="current__time-city">Город: ${moreInfo.name}</h3>
                    </div>

    `;


    currentMore.innerHTML = `
        <li class="current__nav-item">
                                <img class="current__nav-icon" src="assets/icons/temp.svg" alt="Temperature" />
                                <h3 class="current__nav-header">Температура</h3>
                                <h3 class="current__nav-descr">${moreInfo.main.temp} - ощущается как ${moreInfo.main.feels_like}</h3>
                            </li>

                            <li class="current__nav-item">
                                <img class="current__nav-icon" src="assets/icons/pressure.svg" alt="Pressure" />
                                <h3 class="current__nav-header">Давление</h3>
                                <h3 class="current__nav-descr">${moreInfo.main.pressure} мм ртутного столба - нормальное</h3>
                            </li>

                            <li class="current__nav-item">
                                <img class="current__nav-icon" src="assets/icons/precipitation.svg"
                                    alt="Precipitation" />
                                <h3 class="current__nav-header">Осадки</h3>
                                <h3 class="current__nav-descr">${moreInfo.weather[0].description}</h3>
                            </li>

                            <li class="current__nav-item">
                                <img class="current__nav-icon" src="assets/icons/wind.svg" alt="Wind" />
                                <h3 class="current__nav-header">Ветер</h3>
                                <h3 class="current__nav-descr">${moreInfo.wind.speed}</h3>
                            </li>
    `;
}

async function getFiveDays() {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${51}&lon=${31}&appid=${"7e116dd2a795724c6bc7fcd06c96c407"}&units=metric&lang=ru`);


        const data = await response.json();

        console.log(data);

        const forecast = data.list.filter(item => item.dt_txt.includes("12:00:00"));

        cards.innerHTML = '';

        forecast.forEach(item => {
            const date = new Date(item.dt_txt);
            const day = date.toLocaleDateString('ru-RU', { weekday: 'short' });
            const shortDate = date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
            const temp = Math.round(item.main.temp);
            const icon = item.weather[0].icon;
            const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
            const descr = item.weather[0].description;
            const tempMin = item.main.temp_min;

            cards.innerHTML += `
                <div class="card">
                    <h3 class="card__title">${day}</h3>
                    <time class="card__date">${shortDate}</time>
                    <img src="${iconUrl}" alt="${descr}" class="card__img" />
                    <p class="card__temp">+${temp}°</p>
                    <small class="card__temp-night">${tempMin}°</small>
                    <p class="card__descr">${descr}</p>
                </div>
            `;
        }
    )} catch(err) {
        console.error('Error');
    }
}

function setFilter(container) {
    container.addEventListener('click', (event) => {
        if (event.target.classList.contains('btn')) {
            // console.log(event.target.getAttribute('data-choose'));

            if (event.target.getAttribute('data-choose') === 'five') {
                getFiveDays();
            } else if (event.target.getAttribute('data-choose') === 'month') {
                cards.textContent = '';
            } else {
                cards.textContent = '';

            }
        }
    });
};

function setTab(btns) {
    btns.forEach(item => {
        item.addEventListener('click', () => {
            btns.forEach(item => item.classList.remove('active'));
            item.classList.add('active');
        });
    });
}

getLocation();
setTab(btns);
setFilter(chooseFilter);
