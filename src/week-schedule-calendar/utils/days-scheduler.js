import moment from 'moment';

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

    const calculatedTimes = this.#calculateWorkTime(schedule);
    return this.#map.get(day)
  }

  #calculateWorkTime(schedule) {

  }
}

