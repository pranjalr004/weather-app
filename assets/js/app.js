'use strict';

import { fetchData, url } from "./api.js";
import * as module from "./module.js"

/**
 * 
 * @param {NodeList} elements Elements node array
 * @param {string} eventType Event Type ex-"click","mouseover"
 * @param {Function} callback Callback function
 */

const addEventOnElements = function (elements, eventType, callback) {
    for (const element of elements) element.addEventListener(eventType, callback);
}

/**
 * Toggle Search in mobile devices
 */

const searchView = document.querySelector("[data-search-view]");
const searchTogglers = document.querySelectorAll("[data-search-toggler]");

const toggleSearch = () => searchView.classList.toggle("active");
addEventOnElements(searchTogglers, "click", toggleSearch)


/**
 * Search Integration
 */

const searchField = document.querySelector("[data-search-field]")
const searchResult = document.querySelector("[data-search-result]");

let searchTimeout = null;
let searchTimeoutDuration = 500;

searchField.addEventListener("input", function () {
    searchTimeout ?? clearTimeout(searchTimeout);

    if (searchField.value) {
        searchResult.classList.remove("active");
        searchResult.innerHTML = "";
        searchField.classList.remove("searching");
    }
    else {
        searchField.classList.add("searching");
    }

    if (searchField.value) {
        searchTimeout = setTimeout(() => {
            fetchData(url.geo(searchField.value), function (locations) {
                searchField.classList.remove("searching");
                searchField.classList.add("active");
                searchResult.innerHTML = `
                <ul class="view-list" data-search-list></ul>
                `;
                const /**{NodeList} | [] */  items = [];
                for (const { name, lat, country, lon, state } of locations) {
                    const searchItem = document.createElement("li")
                    searchItem.classList.add("view-item");

                    searchItem.innerHTML = `
                    <span class="m-icon">location_on</span>
                            <div>
                                <p class="item-title">${name}</p>
                                <p class="label-2 item-subtitle">${state || ""} ${country}</p>
                            </div>

                            <a href="#/weather?lat=${lat}&lon=${lon}" class="item-link has-state" arial-label=${name} weather data-search-toggler=""></a>
                    `;
                    searchResult.querySelector("[data-search-list]").appendChild(searchItem);
                    items.push(searchItem.querySelector("[data-search-toggler]"));
                }
                addEventOnElements(items,"click",function(){
                    toggleSearch();
                    searchResult.classList.remove("active")
                })
            })
        }, searchTimeoutDuration)
    }
})

const container = document.querySelector("[data-container]")
const loading = document.querySelector("[data-loading]")
const currentLocationBtn = document.querySelector("[data-current-location-btn]");
const errorContent = document.querySelector("[data-error-content]")


/**
 * Render all weather data in html page
 * @param {number} lat latitude 
 * @param {number} lon  longitude
 */

export const updateWeather = function (lat, lon) {
    // loading.style.display = "grid";
    container.style.overflowY = "hidden";
    // container.classList.remove("fade-in")
    errorContent.style.display = "none";

    const currentWeatherSection = document.querySelector("[data-current-weather]")
    const highlightSection = document.querySelector("[data-highlights]")
    const hourlySection = document.querySelector("[data-hourly-forecast]")
    const forecastSection = document.querySelector("[data-5-day-forecast]")

    currentWeatherSection.innerHTML = "";
    highlightSection.innerHTML = "";
    hourlySection.innerHTML = "";
    forecastSection.innerHTML = "";

    if (window.location.hash === "#/current-location") {
        currentLocationBtn.setAttribute("disabled", "");
    }
    else {
        currentLocationBtn.removeAttribute("disabled");
    }

    /**
     * Current Weather Section
     */

    fetchData(url.currentWeather(lat, lon), function (currentWeather) {
        const {
            weather,
            dt: dateUnix,
            sys: { sunrise: sunriseUnixUTC, sunset: sunsetUnixUTC },
            main: { temp, feels_like, pressure, humidity },
            visibility,
            timezone
        } = currentWeather
        const [{ description, icon }] = weather

        const card = document.createElement("div");
        card.classList.add("card", "card-lg", "current-weather-card");

        card.innerHTML = `
        <h2 class="title-2 card-title">Now</h2>
                        <div class="weapper">
                            <p class="heading">${parseInt(temp)}&deg;<sup>c</sup></p>
                            <img src="./assets/images/weather_icons/${icon}.png" height="64" width="64" class="weather-icon" alt="${description}">
                        </div>
                        <p class="body-3">Overcast Clouds</p>
                        <ul class="meta-list">
                            <li class="meta-item">
                                <span class="m-icon">calendar_today</span>
                                <p class="title-3 meta-text">${module.getDate(dateUnix,timezone)}</p>
                            </li>
                            <li class="meta-item">
                                <span class="m-icon">location_on</span>
                                <p class="title-3 meta-text" data-location></p>
                            </li>

                        </ul>
        `;

        fetchData(url.reverseGeo(lat,lon),function([{name,country}]){
            card.querySelector("[data-location]").innerHTML=`${name},${country}`
        })

        currentWeatherSection.appendChild(card);
    })

}

export const error404=function(){

}