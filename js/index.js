import { getResultsFromStorage, setResultsToStorage } from './storage.js';
import { getNormalizeDate, addWeek, addMonth, getDurationBetweenTimes } from './date.js';
import { getCountries, getHolidays, holidaysData } from './requests.js';

const startDate = document.getElementById('startDate');
const endDate = document.getElementById('endDate');
const preset = document.querySelector('.preset');
const countBtn = document.querySelector('.count__button');
const resultText = document.querySelector('.result__text');
const resultHistory = document.querySelector('.result-history');
const resultBlock = document.querySelector('.result-date');
const tab = document.querySelector('.tab');
const tabDate = document.querySelector('.tab-date');
const tabHoliday = document.querySelector('.tab-holiday');
const countriesList = document.getElementById('selectCountry');
const yearsList = document.getElementById('selectYear');
const showBtn = document.querySelector('.show__button');
const sortBtn = document.querySelector('.arrow');
const sortDate = document.querySelector('.result__date');
const resultHolidays = document.querySelector('.result-holidays');
let isCountryLoad = false;

const changeTab = (event) => {
    const tabButtons = document.querySelectorAll('.tab__button');

    if(event.target.className.includes('tab__button_active')) {
        return;
    }

    tabButtons.forEach((tabButton) => {
        tabButton.classList.toggle('tab__button_active');
    });

    if(event.target.textContent === 'Date range') {
        tabDate.hidden = false;
        tabHoliday.hidden = true;
    } else if(event.target.textContent === 'Holiday date') {
        tabDate.hidden = true;
        tabHoliday.hidden = false;
        if(!isCountryLoad) {
            getCountries();
        }
        isCountryLoad = true;
    }
};

const handleStartDateChange = () => {
    const startDateValue = new Date(startDate.value);
    const endDateValue = new Date(endDate.value);

    endDate.setAttribute('min', getNormalizeDate(startDateValue));

    endDate.removeAttribute('disabled');
};

const handleEndDateChange = () => {
    const startDateValue = new Date(startDate.value);
    const endDateValue = new Date(endDate.value);

    startDate.setAttribute('max', getNormalizeDate(endDateValue));
    countBtn.removeAttribute("disabled");
};

const choosePreset = (event) => {
    const startDateValue = new Date(startDate.value);
    const newEndDate = new Date(startDateValue);

    const preset = event.target.dataset.preset;

    if(preset === 'week') {
        endDate.value = addWeek(newEndDate);
    } else if(preset === 'month') {
        endDate.value = addMonth(newEndDate);
    }

    countBtn.removeAttribute("disabled");
}

const renderResults = () => {
    const results = getResultsFromStorage();

    resultHistory.innerHTML = '';

    if (results.length !== 0) {
        resultBlock.classList.remove('result');
    }

    results.forEach((result) => {
        const li = document.createElement("li");
        li.className = 'result-value';

        const spanDate = document.createElement("span");
        spanDate.textContent = `${result.startDate} - ${result.endDate}`;
        li.append(spanDate);

        const spanResult = document.createElement("span");
        spanResult.textContent = result.result;
        li.append(spanResult);

        resultHistory.appendChild(li);
    });
}

function showDurationResults(startDateValue, endDateValue, dayOption, dimension) {
    const resultStr = getDurationBetweenTimes(startDateValue, endDateValue, dayOption, dimension);

    let paragraph = resultText.querySelector("p");

    if(!paragraph) {
        paragraph = document.createElement('p');
        paragraph.textContent = resultStr;
        resultText.appendChild(paragraph);

        resultBlock.classList.remove('result');
    } else {
        paragraph.textContent = resultStr;
    }

    setResultsToStorage({startDate: getNormalizeDate(startDateValue), endDate: getNormalizeDate(endDateValue), result: resultStr});
    renderResults();
}

const showResults = () => {
    const startDateValue = new Date(startDate.value);
    const endDateValue = new Date(endDate.value);
    const dayOption = document.getElementById('selectDays').value;
    const dimension = document.getElementById('selectUnits').value;

    showDurationResults(startDateValue, endDateValue, dayOption, dimension);
}

const selectCountry = () => {
    yearsList.removeAttribute('disabled');
    showBtn.removeAttribute("disabled");
}

const renderYearsList = () => {
    const defaultYear = (new Date()).getFullYear();

    for(let year = 2001; year <= 2049; year++) {
        const optionYear = document.createElement("option");
        optionYear.text = year;
        optionYear.value = year;

        if (year === defaultYear) {
            optionYear.selected = true;
        }
        yearsList.appendChild(optionYear);
    }
}

const showHolidays = () => {
    const countryValue = countriesList.value;
    const yearValue = yearsList.value;
    sortBtn.setAttribute('data-direction', '<');
    sortBtn.style = "";

    getHolidays(countryValue, yearValue);
}

function sortByDate(direction) {
	if(direction === '>') {
        return (a, b) => {
            return (new Date(a.date)) - (new Date(b.date));
        };
    } else if(direction === '<') {
        return (a, b) => {
            return (new Date(b.date)) - (new Date(a.date));
        };
    }
}

const showSortedHolidays = () => {
    const direction = sortBtn.getAttribute('data-direction');
    sortBtn.setAttribute('data-direction', direction === '>' ? '<' : '>');

    sortBtn.style.transform = direction === '<' ? 'rotate(180deg)' : 'rotate(0deg)';

    holidaysData.sort(sortByDate(direction));

    resultHolidays.innerHTML = '';

    holidaysData.forEach(holiday => {
        const li = document.createElement("li");
        li.className = 'result-value';

        const spanDate = document.createElement("span");
        spanDate.textContent = holiday.date;
        li.append(spanDate);

        const spanHoliday = document.createElement("span");
        spanHoliday.textContent = holiday.name;
        li.append(spanHoliday);

        resultHolidays.appendChild(li);
    });
}

renderResults();
renderYearsList();

tab.addEventListener('click', changeTab);
startDate.addEventListener('input', handleStartDateChange);
endDate.addEventListener('input', handleEndDateChange);
preset.addEventListener('click', choosePreset);
countBtn.addEventListener('click', showResults);
countriesList.addEventListener('change', selectCountry);
showBtn.addEventListener('click', showHolidays);
sortDate.addEventListener('click', showSortedHolidays);