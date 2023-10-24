import { getResultsFromStorage, setResultsToStorage } from './storage.js';

export const startDate = document.getElementById('startDate');
export const endDate = document.getElementById('endDate');
export const preset = document.querySelector('.preset');
export const countBtn = document.querySelector('.count__button');
const resultText = document.querySelector('.result__text');
const resultHistory = document.querySelector('.result-history');
const resultBlock = document.querySelector('.result-date');

function getNormalizeDate(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`;
    const day = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`;

    return `${year}-${month}-${day}`;
}

export const handleStartDateChange = () => {
    const startDateValue = new Date(startDate.value);
    const endDateValue = new Date(endDate.value);

    endDate.setAttribute('min', getNormalizeDate(startDateValue));

    endDate.removeAttribute('disabled');
};

export const handleEndDateChange = () => {
    const startDateValue = new Date(startDate.value);
    const endDateValue = new Date(endDate.value);

    startDate.setAttribute('max', getNormalizeDate(endDateValue));
    countBtn.removeAttribute("disabled");
};

export const choosePreset = (event) => {
    const startDateValue = new Date(startDate.value);
    const newEndDate = new Date(startDateValue);

    const preset = event.target.dataset.preset;

    if(preset === 'week') {
        newEndDate.setDate(newEndDate.getDate() + 7);

        const newEndDateValue = newEndDate.toISOString().split('T')[0];
        
        endDate.value = newEndDateValue;
    } else if(preset === 'month') {
        newEndDate.setMonth(newEndDate.getMonth() + 1);

        const newEndDateValue = newEndDate.toISOString().split('T')[0];

        endDate.value = newEndDateValue;
    }

    countBtn.removeAttribute("disabled");
}

function isWeekend(date) {
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6;
}

function countWeekends(startDate, endDate) {
    let currentDate = new Date(startDate);
    let finishDate = new Date(endDate);
    let count = 0;

    while (currentDate < finishDate) {
        if(isWeekend(currentDate)) {
            count++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return count;
};

function countWeekdays(startDate, endDate) {
    let currentDate = new Date(startDate);
    let finishDate = new Date(endDate);
    let count = 0;

    while (currentDate < finishDate) {
        if(!isWeekend(currentDate)) {
            count++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return count;
};

function normalizeDimension(result, dimension) {
    return result == 1 ? dimension.slice(0, -1).toLowerCase() : dimension.toLowerCase();
}

export const getResults = () => {
    const results = getResultsFromStorage();

    resultHistory.innerHTML = '';

    if (results.length !== 0) {
        resultBlock.classList.remove('result');
    }

    results.forEach((result) => {
        const li = document.createElement("li");
        li.className = 'result-value';

        const spanDate = document.createElement("span");
        spanDate.textContent = result.dateRange;
        li.append(spanDate);

        const spanResult = document.createElement("span");
        spanResult.textContent = result.result;
        li.append(spanResult);

        resultHistory.appendChild(li);
    });
}

function getDurationBetweenTimes(startDateValue, endDateValue, dayOption, dimension) {
    const DAY_IN_MILLISECONDS = 86400000;
    const HOURS_IN_DAY = 24;
    const MINUTES_IN_DAY = 1440;
    const SECONDS_IN_DAY = 86400;

    let durationDays;

    if(dayOption === 'all') {
        durationDays = (endDateValue - startDateValue) / DAY_IN_MILLISECONDS;
    } else if (dayOption === 'weekdays') {
        durationDays = countWeekdays(startDateValue, endDateValue);
    } else if (dayOption === 'weekends') {
        durationDays = countWeekends(startDateValue, endDateValue);
    }

    let result;

    switch (dimension) {
        case 'days':
            result = durationDays;
            break;
        case 'hours':
            result = durationDays * HOURS_IN_DAY;
            break;
        case 'minutes':
            result = durationDays * MINUTES_IN_DAY;
            break;
        case 'seconds':
            result = durationDays * SECONDS_IN_DAY;
            break;
    }

    return `${result} ${normalizeDimension(result, dimension)}`;
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

    setResultsToStorage({dateRange: `${getNormalizeDate(startDateValue)} - ${getNormalizeDate(endDateValue)}`, result: resultStr});
}

export const showResults = () => {
    const startDateValue = new Date(startDate.value);
    const endDateValue = new Date(endDate.value);
    const dayOption = document.getElementById('selectDays').value;
    const dimension = document.getElementById('selectUnits').value;

    showDurationResults(startDateValue, endDateValue, dayOption, dimension);
}