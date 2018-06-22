const padding = (number: number, length = 2, str = '0') => (
    String(number).padStart(length, str)
);

export const getHumanReadableTime = (seconds: number) => {
    const hour = Math.floor(seconds / 3600);
    const minute = Math.floor((seconds % 3600) / 60);
    const second = Math.floor((seconds % 86400) % 60);

    return `${padding(hour)}:${padding(minute)}:${padding(second)}`;
};
