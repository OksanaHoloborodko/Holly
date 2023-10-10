'use strict';

const tab = document.querySelector('.tab');
const tabDate = document.querySelector('.tab-date');
const tabHoliday = document.querySelector('.tab-holiday');
const startDate = document.getElementById('startDate');
const endDate = document.getElementById('endDate');
const preset = document.querySelector('.preset');

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
};

const choosePreset = (event) => {
    const startDateValue = new Date(startDate.value);
    const newEndDate = new Date(startDateValue);

    if(event.target.textContent === 'Week') {
        newEndDate.setDate(newEndDate.getDate() + 7);

        const newEndDateValue = newEndDate.toISOString().split('T')[0];
        
        endDate.value = newEndDateValue;
    } else if(event.target.textContent === 'Month') {
        newEndDate.setDate(newEndDate.getDate() + 30);

        const newEndDateValue = newEndDate.toISOString().split('T')[0];
        
        endDate.value = newEndDateValue;
    }
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


tab.addEventListener('click', changeTab);
startDate.addEventListener('input', startDateListener);
endDate.addEventListener('input', endtDateListener);
preset.addEventListener('click', choosePreset);
