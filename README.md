# User enters:
* EV purchase price
* gas price
* electricity price
* daily or monthly or weekly distance driven

What I would estimate but still let user to change:
- Fuel economy of the gas car (L/100km)
- Energy use of the EV (kWh/100km)
- Maintenance costs per year for each

Formulas I would use:
$$
\begin{aligned}
D_{yearly} &= 365 \times D_{daily}\\
D_{yearly} &= 52 \times  D_{weekly} \\
D_{yearly} &= 12 \times  D_{monthly} \\
D_{yearly} &= 1 \times D_{yearly}
\end{aligned}
$$
Then I would calculate the consumption per year
$$
\begin{aligned}
C_{EV-yearly} &= D_{yearly} \times \frac{C_{EV-100km}}
{100km}
\\
C_{Gas-yearly} &= D_{yearly} \times \frac{C_{Gas-100km}}{100km}
\end{aligned}
$$

$$
\begin{align}

\end{align}
$$

You’d build a program where the user enters things like:
EV price and gas-car price
Annual distance driven (km/year)
Fuel economy of the gas car (L/100 km)
Energy use of the EV (kWh/100 km)
Fuel price (€/L) and electricity price (€/kWh)
Maintenance costs per year for each
CO₂ per liter of fuel and CO₂ per kWh of electricity (can be user inputs)
Then your code:
Computes yearly total cost for EV vs gas car
Computes cumulative cost over years and finds the breakeven year (EV becomes cheaper overall)
Computes yearly and cumulative CO₂ emissions and how much CO₂ is saved by choosing the EV
Optionally plots cost vs time and CO₂ vs time
Tools:
Python
Pandas (for structured calculations, not strictly necessary but nice)
Matplotlib (for graphs)
Optional: Streamlit to make a simple interactive web app UI

HTML links:
https://www.chartjs.org/docs/latest/getting-started/

Useful links:
https://pierreh.eu/ev-calc-app/?bs=52&bmuco2_nom=90&bmuco2_lb=60&bmuco2_ub=110&evc_nom=16&evc_lb=14&evc_ub=18&cl_nom=18&cl_lb=17&cl_ub=19&cco2_nom=60&cco2_lb=40&cco2_ub=80&icec_nom=6.0&icec_lb=5.0&icec_ub=7.0&gco2_nom=2.80&gco2_lb=2.75&gco2_ub=2.85&round=true