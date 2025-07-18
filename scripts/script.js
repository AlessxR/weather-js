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
    alert(err);
}

const chooseCity = document.querySelector('.search-choose');
const currentMore = document.querySelector('.current__nav-list');
const currentWeather = document.querySelector('.current__today');

const chooseFilter = document.querySelector('.filter__choose');
const btns = document.querySelectorAll('.btn');

const cards = document.querySelector('.cards-container');

const theme = document.querySelector('.theme');

const newCity = document.querySelector('.newCity');

let date = new Date();

const spinner = document.querySelector('.spinners');

async function getCurrentWeatherInfo() {
    showSpinner(spinner);
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${"7e116dd2a795724c6bc7fcd06c96c407"}&units=metric&lang=ru`);

        if (!response.ok) throw new Error(`${response.status}`);

        const data = await response.json();

        return data;
    } catch (err) {
        console.error('Error');
    } finally {
        removeSpinner(spinner);
    }
}

async function setCurrentInformation() {
    showSpinner(spinner);
    try {
        const moreInfo = await getCurrentWeatherInfo();

        chooseCity.innerHTML = `<option value="1">${moreInfo.name}</option>`;
        const icon = moreInfo.weather[0]?.icon;

        renderCurrentWeather(moreInfo.main.temp, icon, moreInfo.name, moreInfo.timezone);
        renderCurrentMoreWeather(moreInfo.main.temp, moreInfo.main.feels_like, moreInfo.main.pressure, moreInfo.weather[0].description, moreInfo.wind.speed);
    } catch(err) {
        console.error('Что-то пошло не так...')
    } finally {
        removeSpinner(spinner);
    }
}

function renderCurrentWeather(temp, icon, city, timeZone) {
    currentWeather.innerHTML = `
        <div class="current__today__block">
                        <div class="current__today-left">
                            <div class="current__info">
                                <h3 class="current__temp">${temp}°</h3>
                                <h3 class="current__label">Сегодня</h3>
                            </div>
                        </div>
                        <div class="current__today-right">
                            <img class="current__icon" src=${`https://openweathermap.org/img/wn/${icon}@2x.png`} alt="Sunny" />
                        </div>
                    </div>
                    <div class="current__time">
                        <time class="current__time-current">Время: ${date.getHours(timeZone)}:${date.getMinutes(timeZone)}</time>
                        <h3 class="current__time-city">Город: ${city}</h3>
                    </div>

    `;
}

function renderCurrentMoreWeather(temp, feelsLike, pressure, description, windSpeed) {
    currentMore.innerHTML = `
        <li class="current__nav-item">
                                <img class="current__nav-icon" src="assets/icons/temp.svg" alt="Temperature" />
                                <h3 class="current__nav-header">Температура</h3>
                                <h3 class="current__nav-descr">${temp} - ощущается как ${feelsLike}</h3>
                            </li>

                            <li class="current__nav-item">
                                <img class="current__nav-icon" src="assets/icons/pressure.svg" alt="Pressure" />
                                <h3 class="current__nav-header">Давление</h3>
                                <h3 class="current__nav-descr">${pressure} мм ртутного столба - нормальное</h3>
                            </li>

                            <li class="current__nav-item">
                                <img class="current__nav-icon" src="assets/icons/precipitation.svg"
                                    alt="Precipitation" />
                                <h3 class="current__nav-header">Осадки</h3>
                                <h3 class="current__nav-descr">${description}</h3>
                            </li>

                            <li class="current__nav-item">
                                <img class="current__nav-icon" src="assets/icons/wind.svg" alt="Wind" />
                                <h3 class="current__nav-header">Ветер</h3>
                                <h3 class="current__nav-descr">${windSpeed}</h3>
                            </li>
    `;
}

async function getFiveDays() {
    showSpinner(spinner);
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${"7e116dd2a795724c6bc7fcd06c96c407"}&units=metric&lang=ru`);

        if (!response.ok) throw new Error(`Ошибка ${response.status}`);

        const data = await response.json();
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
    } finally {
        removeSpinner(spinner);
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
}

function setTab(btns) {
    btns.forEach(item => {
        item.addEventListener('click', () => {
            btns.forEach(item => item.classList.remove('active'));
            item.classList.add('active');
        });
    });
}

function addDarkTheme() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'css/dark.css';
    link.id = 'dark-css';
    document.head.appendChild(link);
}

theme.addEventListener('click', () => {
    const isDark = document.getElementById('dark-css');

    if (isDark) {
        isDark.remove();
    } else {
        addDarkTheme();
    }
});

async function getInformationCity() {
    const cityName = newCity.value.trim();

    if (!cityName) {
        newCity.classList.add('red');
        return;
    }



    try {
        const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${"7e116dd2a795724c6bc7fcd06c96c407"}&units=metric&lang=ru`);

        if (!response.ok) throw new Error(`Что-то не так: ${response.status}`);

        const data = await response.json();

        renderCurrentWeather(data.main.temp, data.weather[0].icon, data.name);

    } catch (error) {
        console.error("Ошибка при получении данных о погоде:", error);
    }
}

function showSpinner(spinner) {
    spinner.classList.remove('spinner');
}

function removeSpinner(spinner) {
    spinner.classList.add('spinner');
}

newCity.addEventListener('change', getInformationCity);

getLocation();
setTab(btns);
setFilter(chooseFilter);
getInformationCity();
