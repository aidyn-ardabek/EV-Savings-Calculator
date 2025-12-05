// OVERVIEW ----------------------------------------------------------------------------------------------------
// This file serves as a main javascript file for the index page

// DEFAULT ----------------------------------------------------------------------------------------------------
// The following has to run immediately after website is loaded.
import {changeLanguage} from './utilities.js'

document.addEventListener("DOMContentLoaded", () => {
    
    // Translate the whole page or set a default language
    changeLanguage()

    // Load saved currency or default to EUR
    const dropdown = document.getElementById("currency_select");
    if (dropdown) {
        const saved = localStorage.getItem("currency");
        if (saved) dropdown.value = saved;

        dropdown.addEventListener("change", () => {
            localStorage.setItem("currency", dropdown.value);
        });
    }
});


// Populate currency dropdown from currencyDB
function loadCurrencyList() {
    const dropdown = document.getElementById("currency_select");
    if (!dropdown) return;

    dropdown.innerHTML = "";

    currencyDB.forEach(cur => {
        const opt = document.createElement("option");
        opt.value = cur.code;
        opt.textContent = `${cur.code} – ${cur.name} (${cur.symbol})`;
        dropdown.appendChild(opt);
    });

    const saved = localStorage.getItem("currency");
    if (saved) dropdown.value = saved;
}


