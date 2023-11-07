const API_KEY = 'YOj2k4kWDhu3eCR9VoiiL9saL9qFU3GQ';

export async function getCountries() {
    const response = await fetch(`https://calendarific.com/api/v2/countries?api_key=${API_KEY}`);

    if (!response.ok) {
        throw new Error(`Помилка запиту: ${response.status}`);
    }

    const { response: { countries } } = await response.json();

    return countries;
}

export async function getHolidays(country, year) {
    const response = await fetch(`https://calendarific.com/api/v2/holidays?&api_key=${API_KEY}&country=${country}&year=${year}`);
    
    if (!response.ok) {
        throw new Error(`Помилка запиту: ${response.status}`);
    }

    const { response: { holidays } } = await response.json();

    return holidays;
}