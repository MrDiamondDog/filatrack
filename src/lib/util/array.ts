export function deleteFromArray<T>(arr: T[], item: T, idKey?: keyof T): T[] {
    const i = idKey ? arr.findIndex(o => o[idKey] === item[idKey]) : arr.indexOf(item);
    return [...arr.slice(0, i), ...arr.slice(i + 1)];
}

export function modifyArrayItem<T>(arr: T[], item: T, idKey?: keyof T): T[] {
    const i = idKey ? arr.findIndex(o => o[idKey] === item[idKey]) : arr.indexOf(item);
    return [...arr.slice(0, i), item, ...arr.slice(i + 1)];
}
