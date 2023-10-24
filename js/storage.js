import { getResults } from './date.js';

const STORAGE_KEY = "resultHistory";

export const getResultsFromStorage = () => {
    const results = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    return results;
}

export const setResultsToStorage = (result) => {
    const results = getResultsFromStorage();

    if(results.length === 10) {
        results.pop();
    }

    results.unshift(result);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(results));

    getResults();
}