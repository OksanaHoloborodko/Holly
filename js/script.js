'use strict';

const tab = document.querySelector('.tab');
const tabDate = document.querySelector('.tab-date');
const tabHoliday = document.querySelector('.tab-holiday');
const startDate = document.getElementById('startDate');
const endDate = document.getElementById('endDate');
const preset = document.querySelector('.preset');
const countBtn = document.querySelector('.count__button');
const resultText = document.querySelector('.result__text');
const resultHistory = document.querySelector('.result-history');
const resultBlock = document.querySelector('.result-date');

const STORAGE_KEY = "resultHistory";

const getResultsFromStorage = () => {
    const results = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    return results;
}

const setResultsToStorage = (result) => {
    const results = getResultsFromStorage();

    if(results.length === 10) {
        results.pop();
    }

    results.unshift(result);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
}

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
    }
};

function getNormalizeDate(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`;
    const day = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`;

    return `${year}-${month}-${day}`;
}

const startDateListener = () => {
    const startDateValue = new Date(startDate.value);
    const endDateValue = new Date(endDate.value);

    endDate.setAttribute('min', getNormalizeDate(startDateValue));

    endDate.removeAttribute('disabled');
};

const endtDateListener = () => {
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

const getResults = () => {
    const results = getResultsFromStorage();

    if(results.length !== 0) {
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

        resultHistory.append(li);
    });
}

const createResultTable = (startDateValue, endDateValue, result) => {
    const maxLiElements = 11;
    let currentLiElements = resultHistory.getElementsByTagName('li').length;

    if (currentLiElements >= maxLiElements) {
        resultHistory.removeChild(resultHistory.lastElementChild);
    }

    const li = document.createElement("li");
    li.className = 'result-value';

    const spanDate = document.createElement("span");
    spanDate.textContent = `${getNormalizeDate(startDateValue)} - ${getNormalizeDate(endDateValue)}`;
    li.append(spanDate);

    const spanResult = document.createElement("span");
    spanResult.textContent = result;
    li.append(spanResult);

    resultHistory.insertBefore(li, resultHistory.children[1]);
}

const durationBetweenDates = () => {
    const startDateValue = new Date(startDate.value);
    const endDateValue = new Date(endDate.value);
    const dayOption = document.getElementById('selectDays').value;
    const dimension = document.getElementById('selectUnits').value;
    let durationDays;

    const DAY_IN_MILLISECONDS = 86400000;
    const HOURS_IN_DAY = 24;
    const MINUTES_IN_DAY = 1440;
    const SECONDS_IN_DAY = 86400;

    if(dayOption === 'All days') {
        durationDays = (endDateValue - startDateValue) / DAY_IN_MILLISECONDS;
    } else if (dayOption === 'Weekdays') {
        durationDays = countWeekdays(startDateValue, endDateValue);
    } else if (dayOption === 'Weekends') {
        durationDays = countWeekends(startDateValue, endDateValue);
    }

    let result;

    switch (dimension) {
        case 'Days':
            result = durationDays;
        break;
        case 'Hours':
            result = durationDays * HOURS_IN_DAY;
        break;
        case 'Minutes':
            result = durationDays * MINUTES_IN_DAY;
        break;
        case 'Seconds':
            result = durationDays * SECONDS_IN_DAY;
        break;
    }

    let paragraph = resultText.querySelector("p");

    if(!paragraph) {
        paragraph = document.createElement('p');
        paragraph.textContent = `${result} ${normalizeDimension(result, dimension)}`;
        resultText.appendChild(paragraph);

        resultBlock.classList.remove('result');
    } else {
        paragraph.textContent = `${result} ${normalizeDimension(result, dimension)}`;
    }

    createResultTable(startDateValue, endDateValue, paragraph.textContent);
    setResultsToStorage({dateRange: `${getNormalizeDate(startDateValue)} - ${getNormalizeDate(endDateValue)}`, result: paragraph.textContent});
}

getResults();

tab.addEventListener('click', changeTab);
startDate.addEventListener('input', startDateListener);
endDate.addEventListener('input', endtDateListener);
preset.addEventListener('click', choosePreset);
countBtn.addEventListener('click', durationBetweenDates);

