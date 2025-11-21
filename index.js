function setLang(lang) {
  localStorage.setItem("lang", lang);

  const dict = translations_index[lang];
  for (const key in dict) {
    const el = document.getElementById(key);
    if (el) el.textContent = dict[key];
  }

  loadCurrencyList();  // update dropdown with correct content
}

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

document.addEventListener("DOMContentLoaded", () => {
  // Load saved language or default to English
  const lang = localStorage.getItem("lang") || "en";
  setLang(lang);

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
