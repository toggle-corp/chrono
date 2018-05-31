export type Map<T> = { [key: string]: T };
export type List<T> = T[];
interface MapFn<T, S> {
    (val: T, key: string): S;
}

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

interface GroupFn<S> {
    (val: S): string;
}

export const groupObjectToObject = <S>(obj: Map<S>, fn: GroupFn<S>): Map<Map<S>> => {
    const op: Map<Map<S>> = {};
    Object.keys(obj).forEach((key) => {
        const value = obj[key];

        const derivedKey = fn(value);
        if (op[derivedKey]) {
            op[derivedKey][key] = value;
        } else {
            op[derivedKey] = { [key]: value };
        }
    });

    return op;
};

export const getCanonicalDate = (year: number, month: number, day: number) => (
    `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
);

export const matchesCanonicalDate = (
    date: string, year: number, month?: number, day?: number,
) => {
    if (!month) {
        return date.startsWith(`${year}`);
    }
    if (!day) {
        return date.startsWith(`${year}-${String(month).padStart(2, '0')}`);
    }
    return date === getCanonicalDate(year, month, day);
};
