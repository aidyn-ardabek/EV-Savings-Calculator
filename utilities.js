// OVERVIEW ----------------------------------------------------------------------------------------------------
// This file contains some utility functions that are used across several other files.

// TRANSLATE ----------------------------------------------------------------------------------------------------
// Translate the whole page
import {dictionary} from './translation_index.js'

export function changeLanguage(lang) {
    // Get passed lang or check last saved lang or get default lang
    lang = lang || localStorage.getItem("lang") || "en";

    // Save the new language choice for future
    localStorage.setItem("lang", lang);

    // Set the new language choice
    for (let sentence in dictionary[lang]) {
        let element = document.getElementById(sentence);
        if (element) {
            element.textContent = dictionary[lang][sentence];
        }
    }
}

// document.getElementById("changeLanguage-buttons").addEventListener("click", (e) => {
//     changeLanguage(e.target.textContent.trim())
// });
