import { SCHEDULE_EVENT_TYPE } from './schedule-event-type';

export class DaysScheduler { 
  #map
  constructor (map) {
    this.#map = map ?? new Map();
  }

  getTotalTimeForDay(day) {
    const schedule = this.#map.get(day);

    if (!schedule) {
      return null
    }

    return this.#calculateTotalTime(schedule);
  }

  #calculateTotalTime(schedule) {
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

  getScheduleForDay(day) {
    return this.#map.get(day) ?? null;
  }
}

