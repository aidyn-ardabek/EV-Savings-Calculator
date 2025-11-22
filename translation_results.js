const translations_results = {
    en: {

        top_summary_title: "Overall Summary",
        top_description_body: "A full summary will be generated automatically based on your inputs.",

        page_title: "Results",
        nav_title: "EV vs Gas",

        // Section: 4-chart block
        all_charts_title: "Cumulative Cost Comparison (Without Maintenance)",
        all_charts_desc:
            "The charts below show how total electricity cost for an EV compares to gasoline cost " +
            "over days, weeks, months, and years. Maintenance is excluded in this section.",

        chart_days_title: "Days 1–7",
        chart_weeks_title: "Weeks 1–5",
        chart_months_title: "Months 1–12",
        chart_years_title: "Years 1–10",

        // Section: Maintenance block
        maint_section_title: "Costs With and Without Maintenance",
        maint_section_desc:
            "These charts compare cumulative yearly costs over 10 years. The left chart shows electricity vs fuel only. " +
            "The right chart includes maintenance costs on top using stacked bars, and both charts share the same vertical scale.",

        chart_year_no_maint_title: "Years 1–10 (Fuel vs Electricity Only)",
        chart_year_with_maint_title: "Years 1–10 (Including Maintenance)",

        // Legend labels
        legend_ev_electricity: "EV electricity",
        legend_ev_maintenance: "EV maintenance",
        legend_gas_fuel: "Gas fuel",
        legend_gas_maintenance: "Gas maintenance",

        // Dataset labels for charts
        ev_cost_label: "EV electricity cost",
        gas_cost_label: "Gasoline fuel cost",
        ev_maint_label: "EV maintenance",
        gas_maint_label: "Gas maintenance",

        // X-axis label prefixes
        x_days_label_prefix: "Day ",
        x_weeks_label_prefix: "Week ",
        x_months_label_prefix: "Month ",
        x_years_label_prefix: "Year ",

        fuel_savings_title: "Fuel savings:",
        fuel_savings_per_day: "Per day",
        fuel_savings_per_week: "Per week",
        fuel_savings_per_month: "Per month",
        fuel_savings_per_year: "Per year",

        maint_savings_title: "Savings including maintenance:",
        maint_savings_year: "Maintenance per year",
        maint_savings_total: "Total per year",

        breakeven_positive: "The EV is financially better from the very first year.",
        breakeven_negative: "The EV is not financially favorable under current costs.",

        breakeven_title: "Breakeven:",
        breakeven_prefix: "EV pays for itself in approximately",
        breakeven_suffix: "year(s).",
        breakeven_impossible: "The EV cannot pay for itself under current conditions.",

        resale_title: "5-year resale scenario:",
        resale_description_prefix: "If the owner sells the EV after 5 years at 50% of the purchase price, the net financial result is:",
        resale_loss_prefix: "Total 5-year net loss:",
        resale_gain_prefix: "Total 5-year net gain:",

        resale_title_70: "5-year resale scenario (70%):",
        resale_description_prefix_70: "If the owner sells the EV after 5 years at 70% of the purchase price, the net financial result is:",
        resale_loss_prefix_70: "Total 5-year net loss:",
        resale_gain_prefix_70: "Total 5-year net gain:"
    },

    ru: {

        top_summary_title: "Общая сводка",
        top_description_body: "Итоговая сводка будет автоматически рассчитана на основе ваших данных.",

        page_title: "Результаты",
        nav_title: "EV vs Gas",

        all_charts_title: "Сравнение накопленных затрат (Без обслуживания)",
        all_charts_desc:
            "Графики ниже показывают, как стоимость электроэнергии для EV сравнивается со стоимостью " +
            "бензина по дням, неделям, месяцам и годам. Обслуживание здесь не учитывается.",

        chart_days_title: "Дни 1–7",
        chart_weeks_title: "Недели 1–5",
        chart_months_title: "Месяцы 1–12",
        chart_years_title: "Годы 1–10",

        maint_section_title: "Затраты с обслуживанием и без",
        maint_section_desc:
            "Эти графики сравнивают накопленные годовые затраты за 10 лет. Левый график показывает только " +
            "электричество и топливо. Правый добавляет обслуживание поверх в виде составных столбцов. " +
            "Обе диаграммы используют одинаковый вертикальный масштаб.",

        chart_year_no_maint_title: "Годы 1–10 (Только электричество/топливо)",
        chart_year_with_maint_title: "Годы 1–10 (С обслуживанием)",

        legend_ev_electricity: "Электричество EV",
        legend_ev_maintenance: "Обслуживание EV",
        legend_gas_fuel: "Топливо (бензин)",
        legend_gas_maintenance: "Обслуживание ДВС",

        ev_cost_label: "Затраты на электричество (EV)",
        gas_cost_label: "Затраты на топливо (бензин)",
        ev_maint_label: "Обслуживание EV",
        gas_maint_label: "Обслуживание ДВС",

        x_days_label_prefix: "День ",
        x_weeks_label_prefix: "Неделя ",
        x_months_label_prefix: "Месяц ",
        x_years_label_prefix: "Год ",

        fuel_savings_title: "Экономия на топливе:",
        fuel_savings_per_day: "В день",
        fuel_savings_per_week: "В неделю",
        fuel_savings_per_month: "В месяц",
        fuel_savings_per_year: "В год",

        maint_savings_title: "Экономия с учётом обслуживания:",
        maint_savings_year: "Обслуживание в год",
        maint_savings_total: "Итого в год",

        breakeven_positive: "EV выгоднее уже с первого года эксплуатации.",
        breakeven_negative: "EV не выгоден при текущих затратах.",

        breakeven_title: "Окупаемость:",
        breakeven_prefix: "EV окупается примерно за",
        breakeven_suffix: "год(а/лет).",
        breakeven_impossible: "EV не окупится при текущих условиях.",

        resale_title: "Сценарий перепродажи через 5 лет:",
        resale_description_prefix: "Если владелец продаёт EV через 5 лет за 50% от начальной цены, итоговый финансовый результат составляет:",
        resale_loss_prefix: "Итоговый убыток за 5 лет:",
        resale_gain_prefix: "Итоговая выгода за 5 лет:",

        resale_title_70: "Сценарий перепродажи через 5 лет (70%):",
        resale_description_prefix_70: "Если владелец продаёт EV через 5 лет за 70% от начальной цены, итоговый финансовый результат составляет:",
        resale_loss_prefix_70: "Итоговый убыток за 5 лет:",
        resale_gain_prefix_70: "Итоговая выгода за 5 лет:"
    }
};
