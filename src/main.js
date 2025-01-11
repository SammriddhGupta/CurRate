const apiKey = import.meta.env.VITE_API_KEY;
let baseCurrency = 'USD';

async function fetchConversionRate(targetCurrency) {
    const response = await fetch(
        `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${baseCurrency}/${targetCurrency}`
    );
    const data = await response.json();
    if (data.result === 'success') {
        return data.conversion_rate;
    } else {
        console.error('Error fetching rate:', data);
        return null;
    }
}

async function updateRates() {
    const currencyRows = document.querySelectorAll('.currency-row');
    for (const row of currencyRows) {
        const currCode = row.querySelector('.currency-code').textContent;
        const rateEl = row.querySelector('.currency-rate');
        if (rateEl) {
            const rate = await fetchConversionRate(currCode);
            if (rate != null) {
                rateEl.textContent = rate.toFixed(4);
            }
        }
    }
}

document.getElementById('base-currency').addEventListener('input', (e) => {
    const newBaseCurr = e.target.value.toUpperCase();
    if (newBaseCurr.length === 3) {
        baseCurrency = newBaseCurr;
        updateRates();
    }
})

// Add a new currency
document.getElementById('add-currency-btn').addEventListener('click', () => {
    const newCurrency = document.getElementById('new-currency').value.toUpperCase();
    const currencyList = document.getElementById('currency-list');

    if (!newCurrency || newCurrency.length !== 3) {
        alert('Please enter a valid 3-digit currency code.');
        return;
    }

    const existingCurrencies = Array.from(currencyList.querySelectorAll('.currency-code')).map(el => el.textContent);
    if (existingCurrencies.includes(newCurrency)) {
        alert('Currency already added!');
        return;
    }

    const newRow = document.createElement('div');
    newRow.className = 'currency-row';
    newRow.innerHTML = `
        <span class="currency-code">${newCurrency}</span>
        <span class="currency-rate">--</span>
    `;
    currencyList.appendChild(newRow);

    updateRates();
    document.getElementById('new-currency').value = '';
});


window.onload = () => {
    updateRates();
};

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then(() => console.log('Service Worker Registered'))
        .catch((err) => console.log('Service Worker Registration Failed: ', err));
}