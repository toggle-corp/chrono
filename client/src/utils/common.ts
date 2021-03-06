import { isFalsy } from '#rsu/common.js';
/*
const padding = (number: number, length = 2, str = '0') => (
    String(number).padStart(length, str)
);

export const getHumanReadableTime = (seconds: number, invalidText = '-') => {
    if (!seconds) {
        return invalidText;
    }
    const hour = Math.floor(seconds / 3600);
    const minute = Math.floor((seconds % 3600) / 60);
    const second = Math.floor((seconds % 86400) % 60);

    return `${padding(hour)}:${padding(minute)}:${padding(second)}`;
};
 */

const getPrettyTime = (hour: number, minute: number, second: number) => {
    let prettyText = '';
    if (hour) {
        prettyText += `${hour}h `;
    }
    if (minute) {
        prettyText += `${minute}m `;
    }
    if (second) {
        prettyText += `${second}s`;
    }
    return prettyText;
};

export const getHumanReadableTime = (seconds: number = 0, invalidText = '-') => {
    if (isFalsy(seconds)) {
        return invalidText;
    }

    const hour = Math.floor(seconds / 3600);
    const minute = Math.floor((seconds % 3600) / 60);
    const second = Math.floor((seconds % 86400) % 60);

    return getPrettyTime(hour, minute, second);
};
