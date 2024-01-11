export const sortByName = (list) => {
    return list.sort(function (a, b) {
        if (a.name < b.name) {
            return -1;
        }
        if (a.name > b.name) {
            return 1;
        }
        return 0;
    }) 
}

export const sortByKey = (list, key='label') => {
    return list.sort(function (a, b) {
        if (a[key] < b[key]) {
            return -1;
        }
        if (a[key] > b[key]) {
            return 1;
        }
        return 0;
    }) 
}

export const copy = data => {
    return data ? JSON.parse(JSON.stringify(data)) : data
}