export function deleteFromArray<T>(arr: T[], item: T, idKey?: keyof T): T[] {
    const i = idKey ? arr.findIndex(o => o[idKey] === item[idKey]) : arr.indexOf(item);
    if (i === -1)
        return arr;
    return [...arr.slice(0, i), ...arr.slice(i + 1)];
}

export function modifyArrayItem<T>(arr: T[], item: T, idKey?: keyof T): T[] {
    const i = idKey ? arr.findIndex(o => o[idKey] === item[idKey]) : arr.indexOf(item);
    if (i === -1)
        return arr;
    return [...arr.slice(0, i), item, ...arr.slice(i + 1)];
}

export function moveArrayItem<T>(arr: T[], index: number, dir: "up" | "down"): T[] {
    if (dir === "up" && index === 0)
        return arr;
    if (dir === "down" && index === arr.length - 1)
        return arr;

    let newArr = [...arr];

    if (dir === "up")
        [newArr[index - 1], newArr[index]] = [newArr[index], newArr[index - 1]];
    if (dir === "down")
        [newArr[index], newArr[index + 1]] = [newArr[index + 1], newArr[index]];

    return newArr;
}
