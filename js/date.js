export function getNormalizeDate(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`;
    const day = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`;

    return `${year}-${month}-${day}`;
}

export function addWeek(newEndDate) {
    newEndDate.setDate(newEndDate.getDate() + 7);

    return newEndDate.toISOString().split('T')[0];
}

export function addMonth(newEndDate) {
    newEndDate.setMonth(newEndDate.getMonth() + 1);

    return newEndDate.toISOString().split('T')[0];
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

export function getDurationBetweenTimes(startDateValue, endDateValue, dayOption, dimension) {
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