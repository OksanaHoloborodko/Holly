const countrySelect = document.getElementById("selectCountry");
export let holidaysData = [];

export async function getCountries() {
    try {
        const response = await fetch("https://calendarific.com/api/v2/countries?api_key=YOj2k4kWDhu3eCR9VoiiL9saL9qFU3GQ");
        if (!response.ok) {
            throw new Error(`Помилка запиту: ${response.status}`);
        }
        const data = await response.json();
        const countries = data.response.countries;
        
        countries.forEach(country => {
            const option = document.createElement("option");
            option.value = country['iso-3166'];
            option.text = country.country_name;
            countrySelect.appendChild(option);
        });
    } catch (error) {
        console.error(error);
    }
}

export async function getHolidays(country, year) {
    try {
        const response = await fetch(`https://calendarific.com/api/v2/holidays?&api_key=YOj2k4kWDhu3eCR9VoiiL9saL9qFU3GQ&country=${country}&year=${year}`);
        if (!response.ok) {
            throw new Error(`Помилка запиту: ${response.status}`);
        }
        const data = await response.json();
        const holidays = data.response.holidays;

        holidaysData = holidays.map(holiday => ({
            date: holiday.date.iso.split('T')[0],
            name: holiday.name
        }));

        const resultBlock = document.querySelector('.result-holiday');
        const resultHolidays = document.querySelector('.result-holidays');

        resultBlock.classList.remove('result');

        resultHolidays.innerHTML = '';

        holidays.forEach(holiday => {
            const li = document.createElement("li");
            li.className = 'result-value';

            const spanDate = document.createElement("span");
            spanDate.textContent = holiday.date.iso.split('T')[0];
            li.append(spanDate);

            const spanHoliday = document.createElement("span");
            spanHoliday.textContent = holiday.name;
            li.append(spanHoliday);

            resultHolidays.appendChild(li);
        });
    } catch (error) {
        console.error(error);
    }
}