const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

const grantAccessButton = document.querySelector("[data-grantAccess]");
const searchInput = document.querySelector("[data-searchInput]");

let currentTab = userTab;
const API_KEY = "6b3be39c1cb0374bc34a8236cd1a50e3";
currentTab.classList.add("current-tab");

getfromSessionStorage();

function renderWeatherInfo(weatherInfo) {

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    console.log(weatherInfo)

    // fetch values from weatherInfo and render them
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;

}

async function fetchUserWeatherInfo(coordinates) {

    const {lat, lon} = coordinates;

    // making the grant access container invisible
    grantAccessContainer.classList.remove("active");

    // making loader visible
    loadingScreen.classList.add("active");

    //API CALL
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);

        const data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch (err) {
        loadingScreen.classList.remove("active");
    }

}

function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");

    if (!localCoordinates) {
        grantAccessContainer.classList.add("active");
    }
    else {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

function switchTab(clickedTab) {
    if (clickedTab !== currentTab) {
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if (!searchForm.classList.contains("active")) {
            //checking if search form container invisible?
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active"); 
        }
        else {
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            
            // check for saved coordinates in local storage
            getfromSessionStorage();
        }
    }
}

userTab.addEventListener('click', () => {

    // pass clicked tab as input parameter 
    switchTab(userTab);
})

searchTab.addEventListener('click', () => {

    // pass clicked tab as input parameter
    switchTab(searchTab);
})

function showPosition(position) {
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);

}

function getLocation() {

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition)
    }
    else {
        // show an alert for no geoloaction support available
        window.alert("Geolocation Support is not Available")
    }

}

grantAccessButton.addEventListener('click', getLocation);

async function fetchSearchWeatherInfo(city) {

    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);

        const data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        console.log(data);
        renderWeatherInfo(data);
    }
    catch (err) {
        console.log("error received " + err)
    }
}

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "")
        return;
    else 
        fetchSearchWeatherInfo(cityName);
})