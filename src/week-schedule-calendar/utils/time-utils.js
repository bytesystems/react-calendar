import {SCHEDULE_EVENT_TYPE} from "./schedule-event-type";


export const format24H = (minutes) => {
    return `${Math.floor(minutes / 60)}h${minutes % 60 < 10 ? '0' : ''}${minutes % 60}`;
}

export const calculateTotalTime = (schedule) => {
    let workTime = 0;
    let restTime = 0;
    for (const chunk of schedule) {
        if(chunk.type === SCHEDULE_EVENT_TYPE.WORK) {
            workTime += chunk.duration.minutes
        } else {
            restTime += chunk.duration.minutes
        }
    }
    return { workTime, restTime }
}