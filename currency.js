const currencyDB = [
    { code: "EUR", name: "Euro", symbol: "€" },
    { code: "GBP", name: "British Pound", symbol: "£" },
    { code: "JPY", name: "Japanese Yen", symbol: "¥" },
    { code: "KGS", name: "Kyrgyz Som", symbol: "⃀" },
    { code: "KZT", name: "Kazakh Tenge", symbol: "₸" },
    { code: "RUB", name: "Russian Ruble", symbol: "₽" },
    { code: "TJS", name: "Tajik Somoni", symbol: "Ѕ" },
    { code: "USD", name: "US Dollar", symbol: "$" },
    { code: "UZS", name: "Uzbek Som", symbol: "soʻm" }
].sort((a, b) => a.code.localeCompare(b.code));
