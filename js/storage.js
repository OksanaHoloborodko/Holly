const STORAGE_KEY = "resultHistory";
const STORAGE_LIMIT = 10;

export const getResultsFromStorage = () => {
    const results = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    return results;
}

export const setResultsToStorage = (result) => {
    const results = getResultsFromStorage();

    if(results.length === STORAGE_LIMIT) {
        results.pop();
    }

    results.unshift(result);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
}