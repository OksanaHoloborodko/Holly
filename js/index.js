import { getResultsFromStorage, setResultsToStorage } from './storage.js';
import { getNormalizeDate, addWeek, addMonth, getDurationBetweenTimes } from './date.js';

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

renderResults();

tab.addEventListener('click', changeTab);
startDate.addEventListener('input', handleStartDateChange);
endDate.addEventListener('input', handleEndDateChange);
preset.addEventListener('click', choosePreset);
countBtn.addEventListener('click', showResults);