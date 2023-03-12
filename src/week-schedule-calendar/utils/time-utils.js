

export const format24H = (minutes) => {
    return `${Math.floor(minutes / 60)}h${minutes % 60 < 10 ? '0' : ''}${minutes % 60}`;
}