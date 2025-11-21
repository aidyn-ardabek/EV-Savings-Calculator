//---------------------------------------------------------
// NUMBER FORMATTING
//---------------------------------------------------------

// Format a visible input field as 1,234.56
function formatInputValue(el) {
  let v = el.value;

  // Allow digits and dots only
  v = v.replace(/[^0-9.]/g, "");

  // If first character is a dot → prepend 0.
  if (v.startsWith(".")) v = "0" + v;

  // Prevent more than ONE dot
  const firstDot = v.indexOf(".");
  if (firstDot !== -1) {
    // Keep only the part up to the first dot + digits
    const intPart = v.slice(0, firstDot);
    const decPart = v.slice(firstDot + 1).replace(/\./g, ""); // remove all extra dots

    // Format integer part with commas
    const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // Do NOT force decimal digits while typing
    v = decPart ? `${formattedInt}.${decPart}` : `${formattedInt}.`;
  } else {
    // No dot → just format integer
    v = v.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  el.value = v;
}


// Convert formatted text → clean raw number
function getRawNumber(el) {
  return Number(el.value.replace(/,/g, ""));
}

// For distance preview formatting
function fmt(n) {
  return Number(n).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
}

//---------------------------------------------------------
// CURRENCY HANDLING
//---------------------------------------------------------

function getSelectedCurrency() {
  const code = localStorage.getItem("currency") || "EUR";
  return currencyDB.find(c => c.code === code) || currencyDB[0];
}

function updateCurrencySymbols() {
  const cur = getSelectedCurrency();
  const ids = [
    "ev_price_symbol",
    "gas_price_symbol",
    "elec_price_symbol",
    "maint_gas_symbol",
    "maint_ev_symbol"
  ];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = cur.symbol;
  });
}



//---------------------------------------------------------
// DISTANCE CALCULATIONS
//---------------------------------------------------------

function updateDistanceFields() {
  const day = getRawNumber(dist_day) || 0;
  const weekExtra = getRawNumber(dist_week_extra) || 0;
  const monthExtra = getRawNumber(dist_month_extra) || 0;

  // Format day once for clean display
  const dayFmt = fmt(day);
  const weekExtraFmt = fmt(weekExtra);

  // WEEK preview: “50,000.06 × 7 +”
  dist_week_calc.textContent = `${dayFmt} × 7 + `;

  // MONTH preview: “50,000.06 × 30 + 20 × 4.5 +”
  // weekly extra is multiplied by 4.5
  const weekTimes = fmt(weekExtra * 4.5);
  dist_month_calc.textContent = `${dayFmt} × 30 + ${weekExtraFmt} × 4.5 + `;
}




//---------------------------------------------------------
// TRANSLATION APPLICATION
//---------------------------------------------------------

function applyTranslations(lang) {
  const dict = translations_calc[lang];
  for (const key in dict) {
    const el = document.getElementById(key);
    if (el) el.textContent = dict[key];
  }
}

function setLangCalc(lang) {
  localStorage.setItem("lang", lang);
  applyTranslations(lang);
  updateCurrencySymbols();
  updateDistanceFields();
}



//---------------------------------------------------------
// SAVE AND CONTINUE
//---------------------------------------------------------

function saveAndNext() {
  const data = {
    ev_price: getRawNumber(ev_price),
    gas_price: getRawNumber(gas_price),
    elec_price: getRawNumber(elec_price),

    dist_day: getRawNumber(dist_day),
    dist_week_extra: getRawNumber(dist_week_extra),
    dist_month_extra: getRawNumber(dist_month_extra),

    gas_fe: getRawNumber(gas_fe),
    ev_use: getRawNumber(ev_use),
    maint_gas: getRawNumber(maint_gas),
    maint_ev: getRawNumber(maint_ev)
  };

  localStorage.setItem("calcData", JSON.stringify(data));
  window.location.href = "results.html";
}



//---------------------------------------------------------
// INIT
//---------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  // Apply saved language
  const lang = localStorage.getItem("lang") || "en";
  applyTranslations(lang);

  // Currency symbols
  updateCurrencySymbols();

  // Distance previews
  updateDistanceFields();

  // Strict numeric formatting inputs
  const numericFields = [
    "ev_price", "gas_price", "elec_price",
    "dist_day", "dist_week_extra", "dist_month_extra",
    "gas_fe", "ev_use",
    "maint_gas", "maint_ev"
  ];

  numericFields.forEach(id => {
    const el = document.getElementById(id);
    el.addEventListener("input", () => {
      formatInputValue(el);
      updateDistanceFields();
    });

    // Initial format if any default value exists
    formatInputValue(el);
  });

  // Next button
  next_btn.addEventListener("click", saveAndNext);
});
