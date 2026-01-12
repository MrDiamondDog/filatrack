export function duplicates<T>(acc: T, curr: T) {
    const x = acc.find(item => item.id === current.id);
    if (!x) {
        return acc.concat([current]);
    }
    return acc;
}
