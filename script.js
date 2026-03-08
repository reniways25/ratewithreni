// Exchange rates (base: USD)
const exchangeRates = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
    JPY: 149.50,
    AUD: 1.53,
    CAD: 1.36,
    CHF: 0.88,
    CNY: 7.24,
    INR: 83.12,
    NGN: 1505.50
};

// Currency flags/symbols
const currencyFlags = {
    USD: '💵',
    EUR: '💶',
    GBP: '💷',
    JPY: '💴',
    AUD: '🇦🇺',
    CAD: '🇨🇦',
    CHF: '🇨🇭',
    CNY: '🇨🇳',
    INR: '🇮🇳',
    NGN: '🇳🇬'
};

// DOM Elements
const fromCurrency = document.getElementById('fromCurrency');
const toCurrency = document.getElementById('toCurrency');
const fromAmount = document.getElementById('fromAmount');
const toAmount = document.getElementById('toAmount');
const swapBtn = document.getElementById('swapBtn');

// Format number with commas
function formatNumber(num) {
    return num.toLocaleString('en-US', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
    });
}

// Remove formatting to get raw number
function parseFormattedNumber(str) {
    return parseFloat(str.replace(/,/g, '')) || 0;
}

// Convert currency
function convertCurrency() {
    const fromValue = parseFormattedNumber(fromAmount.value);
    const fromCurr = fromCurrency.value;
    const toCurr = toCurrency.value;

    // Convert to USD first, then to target currency
    const inUSD = fromValue / exchangeRates[fromCurr];
    const converted = inUSD * exchangeRates[toCurr];

    toAmount.value = formatNumber(converted);
    updateExchangeRates();
}

// Update exchange rates display
function updateExchangeRates() {
    const toCurr = toCurrency.value;
    const rateItems = document.querySelectorAll('.rate_item');
    
    // Update JPY rate
    const jpyRate = exchangeRates['JPY'] / exchangeRates[toCurr];
    rateItems[0].querySelector('.rate_value').textContent = jpyRate.toFixed(4);
    
    // Update GBP rate
    const gbpRate = exchangeRates['GBP'] / exchangeRates[toCurr];
    rateItems[1].querySelector('.rate_value').textContent = gbpRate.toFixed(4);
    
    // Update AUD rate
    const audRate = exchangeRates['AUD'] / exchangeRates[toCurr];
    rateItems[2].querySelector('.rate_value').textContent = audRate.toFixed(4);
}

// Update currency flag
function updateCurrencyFlag(selectElement, flagElement) {
    const currency = selectElement.value;
    flagElement.textContent = currencyFlags[currency];
}

// Swap currencies
function swapCurrencies() {
    // Swap currency selections
    const tempCurrency = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = tempCurrency;

    // Swap amounts
    const tempAmount = fromAmount.value;
    fromAmount.value = toAmount.value;
    toAmount.value = tempAmount;

    // Update flags
    const fromFlag = document.querySelectorAll('.currency-flag')[0];
    const toFlag = document.querySelectorAll('.currency-flag')[1];
    updateCurrencyFlag(fromCurrency, fromFlag);
    updateCurrencyFlag(toCurrency, toFlag);

    // Recalculate
    convertCurrency();
}

// Format input as user types
function formatInput(input) {
    let value = input.value.replace(/,/g, '');
    
    // Remove any non-numeric characters except decimal point
    value = value.replace(/[^\d.]/g, '');
    
    // Ensure only one decimal point
    const parts = value.split('.');
    if (parts.length > 2) {
        value = parts[0] + '.' + parts.slice(1).join('');
    }
    
    // Format with commas
    if (value) {
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
            const [intPart, decPart] = value.split('.');
            const formattedInt = parseInt(intPart).toLocaleString('en-US');
            input.value = decPart !== undefined ? formattedInt + '.' + decPart : formattedInt;
        }
    }
}

// Event Listeners
fromAmount.addEventListener('input', function() {
    formatInput(this);
    convertCurrency();
});

fromCurrency.addEventListener('change', function() {
    const fromFlag = document.querySelectorAll('.currency-flag')[0];
    updateCurrencyFlag(this, fromFlag);
    convertCurrency();
});

toCurrency.addEventListener('change', function() {
    const toFlag = document.querySelectorAll('.currency-flag')[1];
    updateCurrencyFlag(this, toFlag);
    convertCurrency();
});

swapBtn.addEventListener('click', swapCurrencies);

// Connect Wallet button (placeholder functionality)
document.querySelector('.connect_btn').addEventListener('click', function() {
    alert('Wallet connection feature coming soon!');
});

// Simulate live rate updates (every 5 seconds)
setInterval(function() {
    // Randomly fluctuate rates by ±0.5%
    Object.keys(exchangeRates).forEach(currency => {
        if (currency !== 'USD') {
            const fluctuation = (Math.random() - 0.5) * 0.01; // ±0.5%
            exchangeRates[currency] *= (1 + fluctuation);
        }
    });
    
    convertCurrency();
}, 5000);

// Initialize
convertCurrency();
