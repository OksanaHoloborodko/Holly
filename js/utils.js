export function sortByDate(direction) {
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