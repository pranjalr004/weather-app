'use strict';

import { fetchData,url } from "./api.js";
import * as module from "./module.js"

/**
 * 
 * @param {NodeList} elements Elements node array
 * @param {string} eventType Event Type ex-"click","mouseover"
 * @param {Function} callback Callback function
 */

const addEventOnElements=function(elements,eventType,callback){
    for(const element of elements) element.addEventListener(eventType,callback);
}

/**
 * Toggle Search in mobile devices
 */

const searchView=document.querySelector("[data-search-view]");
const searchTogglers=document.querySelectorAll("[data-search-toggler]");

const toggleSearch=()=>searchView.classList.toggle("active");
addEventOnElements(searchTogglers,"click",toggleSearch)