import moment from 'moment';
import { SCHEDULE_EVENT_TYPE } from './schedule-event-type';

export class DaysScheduler { 
  #map
  constructor (map) {
    this.#map = map ?? new Map();
  }



  getSheduleForDay(day) {
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
      const {start, stop} = chunk;      
      const diff = Math.abs(moment(start).diff(moment(stop), 'minutes'))

      if(chunk.type === SCHEDULE_EVENT_TYPE.WORK) {
        workTime += diff
      } else {
        restTime += diff
      }
    }
    return { workTime, restTime }
  }
}

