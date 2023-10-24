import { getResults, handleStartDateChange, handleEndDateChange, choosePreset, showResults, startDate, endDate, preset, countBtn } from './date.js';

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

getResults();

tab.addEventListener('click', changeTab);
startDate.addEventListener('input', handleStartDateChange);
endDate.addEventListener('input', handleEndDateChange);
preset.addEventListener('click', choosePreset);
countBtn.addEventListener('click', showResults);