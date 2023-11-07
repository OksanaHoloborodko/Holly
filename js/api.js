import { renderHolidays } from './index.js';

const countrySelect = document.getElementById("selectCountry");
const API_KEY = 'YOj2k4kWDhu3eCR9VoiiL9saL9qFU3GQ';
export const errorPopup = document.querySelector('.error-popup');
export let holidaysData = [];

export async function getCountries() {
    try {
        const response = await fetch(`https://calendarific.com/api/v2/countries?api_key=${API_KEY}`);
        if (!response.ok) {
            throw new Error(`Помилка запиту: ${response.status}`);
        }
        const data = await response.json();
        const { countries } = data.response;
        
        countries.forEach(country => {
            const option = document.createElement("option");
            option.value = country['iso-3166'];
            option.text = country.country_name;
            countrySelect.appendChild(option);
        });
    } catch (error) {
        console.error(error);

		errorPopup.style.opacity = 1;
		errorPopup.style.visibility = "visible";
    }
}

export async function getHolidays(country, year) {
    try {
        const response = await fetch(`https://calendarific.com/api/v2/holidays?&api_key=${API_KEY}&country=${country}&year=${year}`);
        if (!response.ok) {
            throw new Error(`Помилка запиту: ${response.status}`);
        }
        const data = await response.json();
        const { holidays } = data.response;

        holidaysData = holidays.map(holiday => ({
            date: holiday.date.iso.split('T')[0],
            name: holiday.name
        }));

        const resultBlock = document.querySelector('.result-holiday');

        resultBlock.classList.remove('result');

        renderHolidays();
    } catch (error) {
        console.error(error);

		errorPopup.style.opacity = 1;
		errorPopup.style.visibility = "visible";
    }
}