//---------------------------------------------------------
// Helpers: number formatting + currency selection
//---------------------------------------------------------
function fmtNumber(n) {
    return Number(n).toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });
}

function getSelectedCurrency() {
    const code = localStorage.getItem("currency") || "EUR";
    return currencyDB.find(c => c.code === code) || currencyDB[0];
}

function fmtCurrency(n) {
    const cur = getSelectedCurrency();
    return cur.symbol + " " + fmtNumber(n);
}

//---------------------------------------------------------
// Language system
//---------------------------------------------------------
let resultsLang = localStorage.getItem("lang") || "en";

function applyResultsTranslations(lang) {
    const dict = translations_results[lang];

    for (const key in dict) {
        const el = document.getElementById(key);
        if (el) el.textContent = dict[key];
    }

    document.title = dict.page_title;
}

function setLangResults(lang) {
    resultsLang = lang;
    localStorage.setItem("lang", lang);

    applyResultsTranslations(lang);
    injectAllLegends();
    updateChartLabels();
    updateTopSummary(calcInput, costSeries);
}

//---------------------------------------------------------
// Load calculator input
//---------------------------------------------------------
let calcInput = null;
let costSeries = null;

function loadCalcData() {
    const raw = localStorage.getItem("calcData");
    if (!raw) {
        alert("No calculator data found. Please fill the calculator first.");
        window.location.href = "calculator.html";
        return null;
    }
    const data = JSON.parse(raw);
    const toNum = v => Number(v) || 0;

    return {
        ev_price: toNum(data.ev_price),
        gas_price: toNum(data.gas_price),
        elec_price: toNum(data.elec_price),
        dist_day: toNum(data.dist_day),
        dist_week_extra: toNum(data.dist_week_extra),
        dist_month_extra: toNum(data.dist_month_extra),
        gas_fe: toNum(data.gas_fe),
        ev_use: toNum(data.ev_use),
        maint_gas: toNum(data.maint_gas),
        maint_ev: toNum(data.maint_ev)
    };
}

//---------------------------------------------------------
// Compute cost series
//---------------------------------------------------------
function buildCostSeries(input) {
    const {
        dist_day,
        dist_week_extra,
        dist_month_extra,
        gas_fe,
        ev_use,
        elec_price,
        gas_price
    } = input;

    const evCost = d => d * (ev_use / 100) * elec_price;
    const gasCost = d => d * (gas_fe / 100) * gas_price;

    const Dday = dist_day;
    const Dweek = dist_day * 7 + dist_week_extra;
    const Dmonth = dist_day * 30 + dist_week_extra * 4.5 + dist_month_extra;
    const Dyear = Dmonth * 12;

    // Days 1–7
    const dayLabels = [];
    const dayEv = [];
    const dayGas = [];
    for (let n = 1; n <= 7; n++) {
        const d = Dday * n;
        dayLabels.push(n);
        dayEv.push(evCost(d));
        dayGas.push(gasCost(d));
    }

    // Weeks 1–5
    const weekLabels = [];
    const weekEv = [];
    const weekGas = [];
    for (let n = 1; n <= 5; n++) {
        const d = Dweek * n;
        weekLabels.push(n);
        weekEv.push(evCost(d));
        weekGas.push(gasCost(d));
    }

    // Months 1–12
    const monthLabels = [];
    const monthEv = [];
    const monthGas = [];
    for (let n = 1; n <= 12; n++) {
        const d = Dmonth * n;
        monthLabels.push(n);
        monthEv.push(evCost(d));
        monthGas.push(gasCost(d));
    }

    // Years 1–10
    const yearLabels = [];
    const yearEv = [];
    const yearGas = [];
    for (let n = 1; n <= 10; n++) {
        const d = Dyear * n;
        yearLabels.push(n);
        yearEv.push(evCost(d));
        yearGas.push(gasCost(d));
    }

    return {
        Dyear,
        dayLabels, dayEv, dayGas,
        weekLabels, weekEv, weekGas,
        monthLabels, monthEv, monthGas,
        yearLabels, yearEv, yearGas
    };
}

//---------------------------------------------------------
// CHART handlers
//---------------------------------------------------------
let chartDays, chartWeeks, chartMonths, chartYears;
let chartYearNoMaint, chartYearWithMaint;

//---------------------------------------------------------
// Inline legend generator
//---------------------------------------------------------
function makeLegendHTML(type) {
    const dict = translations_results[resultsLang];

    if (type === "simple") {
        return `
      <span class="legend-color" style="background:#00C853"></span>${dict.legend_ev_electricity}
      <span class="legend-color" style="background:#424242; margin-left:14px"></span>${dict.legend_gas_fuel}
    `;
    }

    if (type === "maint") {
        return `
      <span class="legend-color" style="background:#00C853"></span>${dict.legend_ev_electricity}
      <span class="legend-color" style="background:rgba(0,200,83,0.35); margin-left:14px"></span>${dict.legend_ev_maintenance}
      <span class="legend-color" style="background:#424242; margin-left:14px"></span>${dict.legend_gas_fuel}
      <span class="legend-color" style="background:rgba(66,66,66,0.35); margin-left:14px"></span>${dict.legend_gas_maintenance}
    `;
    }
}

function injectAllLegends() {
    const simple = document.getElementById("legend_simple");
    const maint = document.getElementById("legend_maint");
    if (simple) simple.innerHTML = makeLegendHTML("simple");
    if (maint) maint.innerHTML = makeLegendHTML("maint");
}

//---------------------------------------------------------
// Simple bar chart builder
//---------------------------------------------------------
function makeSimpleBarChart(ctx, labels, ev, gas, prefix) {
    const dict = translations_results[resultsLang];
    const xLabels = labels.map(n => dict[prefix] + n);

    return new Chart(ctx, {
        type: "bar",
        data: {
            labels: xLabels,
            datasets: [
                { label: dict.ev_cost_label, data: ev, backgroundColor: "#00C853" },
                { label: dict.gas_cost_label, data: gas, backgroundColor: "#424242" }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: ctx => ctx.dataset.label + ": " + fmtCurrency(ctx.parsed.y)
                    }
                }
            },
            scales: {
                y: {
                    ticks: { callback: v => fmtCurrency(v) }
                }
            }
        }
    });
}

//---------------------------------------------------------
// Build the 4 standard charts
//---------------------------------------------------------
function buildMainCharts() {
    const s = costSeries;

    chartDays = makeSimpleBarChart(
        document.getElementById("chart_days"),
        s.dayLabels, s.dayEv, s.dayGas, "x_days_label_prefix"
    );

    chartWeeks = makeSimpleBarChart(
        document.getElementById("chart_weeks"),
        s.weekLabels, s.weekEv, s.weekGas, "x_weeks_label_prefix"
    );

    chartMonths = makeSimpleBarChart(
        document.getElementById("chart_months"),
        s.monthLabels, s.monthEv, s.monthGas, "x_months_label_prefix"
    );

    chartYears = makeSimpleBarChart(
        document.getElementById("chart_years"),
        s.yearLabels, s.yearEv, s.yearGas, "x_years_label_prefix"
    );
}

//---------------------------------------------------------
// Build maintenance charts (FIXED STACKED VERSION)
//---------------------------------------------------------
function buildMaintenanceCharts() {
    const s = costSeries;
    const d = calcInput;
    const dict = translations_results[resultsLang];

    const labels = s.yearLabels;

    const evNo = s.yearEv.slice();
    const gasNo = s.yearGas.slice();

    const evMaint = [];
    const gasMaint = [];
    const evTotal = [];
    const gasTotal = [];

    for (let i = 0; i < labels.length; i++) {
        const n = labels[i];
        const mEv = d.maint_ev * n;
        const mGas = d.maint_gas * n;

        evMaint.push(mEv);
        gasMaint.push(mGas);
        evTotal.push(evNo[i] + mEv);
        gasTotal.push(gasNo[i] + mGas);
    }

    const maxAll = Math.max(...evTotal, ...gasTotal) * 1.05;
    const xLabels = labels.map(n => dict.x_years_label_prefix + n);

    // No maintenance chart
    chartYearNoMaint = new Chart(
        document.getElementById("chart_year_no_maint"),
        {
            type: "bar",
            data: {
                labels: xLabels,
                datasets: [
                    { label: dict.ev_cost_label, data: evNo, backgroundColor: "#00C853" },
                    { label: dict.gas_cost_label, data: gasNo, backgroundColor: "#424242" }
                ]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                    y: { max: maxAll, ticks: { callback: v => fmtCurrency(v) } }
                }
            }
        }
    );

    // WITH maintenance — FIXED STACKS
    chartYearWithMaint = new Chart(
        document.getElementById("chart_year_with_maint"),
        {
            type: "bar",
            data: {
                labels: xLabels,
                datasets: [
                    {
                        label: dict.ev_cost_label,
                        data: evNo,
                        backgroundColor: "#00C853",
                        stack: "EV"
                    },
                    {
                        label: dict.ev_maint_label,
                        data: evMaint,
                        backgroundColor: "rgba(0,200,83,0.35)",
                        stack: "EV"
                    },
                    {
                        label: dict.gas_cost_label,
                        data: gasNo,
                        backgroundColor: "#424242",
                        stack: "GAS"
                    },
                    {
                        label: dict.gas_maint_label,
                        data: gasMaint,
                        backgroundColor: "rgba(66,66,66,0.35)",
                        stack: "GAS"
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                    x: { stacked: true },
                    y: {
                        stacked: true,
                        max: maxAll,
                        ticks: { callback: v => fmtCurrency(v) }
                    }
                }
            }
        }
    );
}

//---------------------------------------------------------
// Update chart labels when switching language
//---------------------------------------------------------
function updateChartLabels() {
    const dict = translations_results[resultsLang];
    if (!costSeries) return;

    const upd = (chart, labels, prefix) => {
        chart.data.labels = labels.map(n => dict[prefix] + n);
        chart.update();
    };

    upd(chartDays, costSeries.dayLabels, "x_days_label_prefix");
    upd(chartWeeks, costSeries.weekLabels, "x_weeks_label_prefix");
    upd(chartMonths, costSeries.monthLabels, "x_months_label_prefix");
    upd(chartYears, costSeries.yearLabels, "x_years_label_prefix");

    const yearLabels = costSeries.yearLabels.map(
        n => dict.x_years_label_prefix + n
    );

    if (chartYearNoMaint) {
        chartYearNoMaint.data.labels = yearLabels;
        chartYearNoMaint.update();
    }

    if (chartYearWithMaint) {
        chartYearWithMaint.data.labels = yearLabels;
        chartYearWithMaint.update();
    }
}

function updateTopSummary(calcInput, costSeries) {
    const dict = translations_results[resultsLang];

    // Distances based on your model
    const Dday = calcInput.dist_day;
    const Dweek = calcInput.dist_day * 7 + calcInput.dist_week_extra;
    const Dmonth = calcInput.dist_day * 30 + calcInput.dist_week_extra * 4.5 + calcInput.dist_month_extra;
    const Dyear = Dmonth * 12;

    // Cost per distance
    const evCost = km => km * (calcInput.ev_use / 100) * calcInput.elec_price;
    const gasCost = km => km * (calcInput.gas_fe / 100) * calcInput.gas_price;

    // Fuel-only savings
    const saveDay = gasCost(Dday) - evCost(Dday);
    const saveWeek = gasCost(Dweek) - evCost(Dweek);
    const saveMonth = gasCost(Dmonth) - evCost(Dmonth);
    const saveYear = gasCost(Dyear) - evCost(Dyear);

    // Maintenance savings (per year)
    const maintSaveYear = calcInput.maint_gas - calcInput.maint_ev;

    // Total yearly saving (fuel + maintenance)
    const totalSavingYear = saveYear + maintSaveYear;

    // ---------- Breakeven (EV price / annual savings) ----------
    let breakevenHTML = "";
    if (totalSavingYear > 0) {
        const years = calcInput.ev_price / totalSavingYear;
        const yearsRounded = Math.ceil(years);

        breakevenHTML = `
      <p><strong>${dict.breakeven_title}</strong></p>
      <p>${dict.breakeven_prefix} <strong>${yearsRounded}</strong> ${dict.breakeven_suffix}</p>
    `;
    } else {
        breakevenHTML = `
      <p><strong>${dict.breakeven_title}</strong></p>
      <p>${dict.breakeven_impossible}</p>
    `;
    }

    // ---------- 5-year resale scenario (50% residual) ----------
    const resaleValue = calcInput.ev_price * 0.50;
    const fiveYearSavings = totalSavingYear * 5;
    const netFiveYear = fiveYearSavings + resaleValue - calcInput.ev_price;

    let resaleHTML = `
    <p><strong>${dict.resale_title}</strong></p>
    <p>${dict.resale_description_prefix}</p>
  `;

    if (netFiveYear >= 0) {
        resaleHTML += `
      <p>${dict.resale_gain_prefix} <strong>${fmtCurrency(netFiveYear)}</strong></p>
    `;
    } else {
        resaleHTML += `
      <p>${dict.resale_loss_prefix} <strong>${fmtCurrency(Math.abs(netFiveYear))}</strong></p>
    `;
    }

    // ----- RESALE AFTER 5 YEARS (70% RESIDUAL VALUE) -----
    const resaleValue70 = calcInput.ev_price * 0.70;
    const netFiveYear70 = fiveYearSavings + resaleValue70 - calcInput.ev_price;

    let resaleHTML70 = `
  <p><strong>${dict.resale_title_70}</strong></p>
  <p>${dict.resale_description_prefix_70}</p>
`;

    if (netFiveYear70 >= 0) {
        resaleHTML70 += `
    <p>${dict.resale_gain_prefix_70} <strong>${fmtCurrency(netFiveYear70)}</strong></p>
  `;
    } else {
        resaleHTML70 += `
    <p>${dict.resale_loss_prefix_70} <strong>${fmtCurrency(Math.abs(netFiveYear70))}</strong></p>
  `;
    }


    // ---------- Final summary HTML ----------
    const summaryHTML = `
    <p><strong>${dict.fuel_savings_title}</strong></p>
    <ul>
      <li>${dict.fuel_savings_per_day}: <strong>${fmtCurrency(saveDay)}</strong></li>
      <li>${dict.fuel_savings_per_week}: <strong>${fmtCurrency(saveWeek)}</strong></li>
      <li>${dict.fuel_savings_per_month}: <strong>${fmtCurrency(saveMonth)}</strong></li>
      <li>${dict.fuel_savings_per_year}: <strong>${fmtCurrency(saveYear)}</strong></li>
    </ul>

    <p><strong>${dict.maint_savings_title}</strong></p>
    <ul>
      <li>${dict.maint_savings_year}: <strong>${fmtCurrency(maintSaveYear)}</strong></li>
      <li>${dict.maint_savings_total}: <strong>${fmtCurrency(totalSavingYear)}</strong></li>
    </ul>

    ${breakevenHTML}
${resaleHTML}
${resaleHTML70}

  `;

    document.getElementById("top_summary_body").innerHTML = summaryHTML;
}



//---------------------------------------------------------
// INIT
//---------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    applyResultsTranslations(resultsLang);

    calcInput = loadCalcData();
    if (!calcInput) return;

    costSeries = buildCostSeries(calcInput);

    buildMainCharts();
    buildMaintenanceCharts();

    injectAllLegends();
    updateTopSummary(calcInput, costSeries);
});
