// Function to load and display JSON file
async function loadAndDisplayJSON(url, callback) {
    try {
        const response = await fetch(url, { headers: { 'Content-Type': 'application/json' } });
        if (response.ok) {
            const data = await response.json();
            callback(data);
        } else {
            console.error('Failed to load JSON:', response.status);
        }
    } catch (error) {
        console.error('Error fetching JSON:', error);
    }
}

// Function to set cookie with an optional expiration
function setCookie(name, value, days = 7) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = `${name}=${value};${expires};path=/`;
    displayCookie(name, value); // Call function to display the updated cookie
}

// Function to get cookie
function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const [key, value] = cookie.trim().split('=');
        if (key === name) {
            return value;
        }
    }
    return 'en'; // Default language if cookie not found
}

// Function to update lang-cookie element with language code
function updateLangCookieElement(languageCode) {
    const langCookieElement = document.querySelector('.lang-cookie');
    if (langCookieElement) {
        langCookieElement.id = languageCode;
    }
}

// Function to display cookie value
function displayCookie(name, value) {
    console.log(`${name} cookie value: ${value}`);
    // You can replace console.log with code to display the cookie value on the page
}

// Main function to load JSON file, parse data, and display
const lang = getCookie('lang');
loadAndDisplayJSON(`locales/${lang}/lang.json`, () => {
    // Other code to execute after displaying JSON, if needed
    updateLangCookieElement(lang);
    displayCookie('lang', lang); // Call function to display the initial cookie value
});

// Event listener to update displayed cookie value when the cookie changes
window.addEventListener('load', function() {
    const currentLang = getCookie('lang');
    displayCookie('lang', currentLang);
});
