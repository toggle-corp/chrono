export type Map<T> = { [key: string]: T };
export type List<T> = T[];
interface MapFn<T, S> {
    (val: T, key: string): S;
}

interface FilterFn<S> {
    (val: S, key: string): boolean;
}

export const filterObject = <S>(obj: Map<S>, fn: FilterFn<S>): Map<S> => (
    Object.keys(obj).reduce(
        (acc, key) => {
            if (fn(obj[key], key)) {
                return { ...acc, [key]: obj[key] };
            }
            return acc;
        },
        {},
    )
);


export const mapObjectToObject = <T, S>(obj: Map<T>, fn: MapFn<T, S>): Map<S> => {
    const newObj: Map<S> = {};
    Object.keys(obj).forEach((key) => {
        newObj[key] = fn(obj[key], key);
    });
    return newObj;
};

export const mapObjectToArray = <T, S>(obj: Map<T>, fn: MapFn<T, S>): List<S> => {
    const newArray: List<S> = [];
    Object.keys(obj).forEach((key) => {
        const value = fn(obj[key], key);
        newArray.push(value);
    });
    return newArray;
};
