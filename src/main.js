const apiKey = import.meta.env.VITE_API_KEY;
const baseCurrency = 'SGD'; // Base currency is SGD

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
    const audRate = await fetchConversionRate('AUD');
    const inrRate = await fetchConversionRate('INR');
    const usdRate = await fetchConversionRate('USD');

    if (audRate !== null) {
        document.getElementById('aud-rate').textContent = audRate;
    }
    if (inrRate !== null) {
        document.getElementById('inr-rate').textContent = inrRate;
    }
    if (usdRate !== null) {
        document.getElementById('usd-rate').textContent = usdRate;
    }
}

window.onload = () => {
    updateRates();
};

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then(() => console.log('Service Worker Registered'))
        .catch((err) => console.log('Service Worker Registration Failed: ', err));
}