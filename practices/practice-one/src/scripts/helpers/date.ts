export const getCurrentDate = (): string => {
    const date = new Date();
    const formatDate = `${date.getDate()}-${date.getMonth() + 1
        }-${date.getFullYear()}`;
    const formatTime = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    const currentDate = `${formatDate} ${formatTime}`;
    return currentDate;
};
