import moment from "moment";
import { SCHEDULE_EVENT_TYPE } from "./schedule-event-type";

class ErrorsBuilder {
  #errors = {};
  #formsCount;
  constructor(formsCount = 0) {
    this.#formsCount = formsCount;
  }

  push(formIndex, field, error) {
    if(this.#errors[formIndex]) {
      if(this.#errors[formIndex][field]) {
        this.#errors[formIndex][field].add(error)
      } else {
        this.#errors[formIndex][field] = new Set([error])
      }
    } else {
      this.#errors[formIndex] = {[field]: new Set([error])}
    }
  }

  getErrors() {
    if(Object.keys(this.#errors).length) {
      const out = {schedule: []};
      for(let i = 0; i < this.#formsCount; i++) {
        out.schedule[i] = this.#errors[i] ?? null;
      }

      out.schedule = out.schedule.map((form) => {
        if(form) {
          for(const field in form) {
            form[field] = [...form[field].values()];
          }
        }
        return form;
      });

      return out;
    }
    return {};
  }
}

export function validate (values) {
  const { schedule: value } = values;

  if (!value || value.length < 2) {
    return true; // allow empty array
  }
  // sort the intervals by start time
  const mappedIntervals = value.reduce((acc, current) => {
    acc.push({
      ...current,
      start: moment(current.start),
      stop: moment(current.stop),
    });
    return acc;
  }, []);

  const errorsBuilder = new ErrorsBuilder(mappedIntervals.length);

  for (let i = 0; i < mappedIntervals.length; i++) {
    const target = mappedIntervals[i];

    for (let j = 0; j < mappedIntervals.length; j++) {
      if (i === j || (target.type !== mappedIntervals[j].type 
        && target.type === SCHEDULE_EVENT_TYPE.BREAK 
        && mappedIntervals[j].type !== SCHEDULE_EVENT_TYPE.BREAK)) {
        continue;
      }

      const { start: targetStart, stop: targetStop } = target;
      const { start: iteratedStart, stop: iteratedStop } = mappedIntervals[j];

      if (iteratedStart.isValid() && iteratedStop.isValid()) {

        if (targetStart.isValid()) {
          if (
            moment(targetStart).isSameOrAfter(iteratedStart) &&
            moment(targetStart).isBefore(iteratedStop)
          ) {
            errorsBuilder.push(i, "start", "Date range overlaps");
            errorsBuilder.push(j, "start", "Date range overlaps");
            errorsBuilder.push(j, "stop", "Date range overlaps");
          }
        }
        if (targetStop.isValid()) {
          if (
            moment(targetStop).isAfter(iteratedStart) &&
            moment(targetStop).isSameOrBefore(iteratedStop)
          ) {
            errorsBuilder.push(i, "stop", "Date range overlaps");
            errorsBuilder.push(j, "start", "Date range overlaps");
            errorsBuilder.push(j, "stop", "Date range overlaps");
          }
        }
      }
    }
  }
  return errorsBuilder.getErrors();
}