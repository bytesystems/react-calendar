import moment from "moment";

import { SCHEDULE_EVENT_TYPE } from "../week-schedule-calendar/utils/schedule-event-type";

const mockMap = new Map();

mockMap.set(new moment("Mon Mar 06 2023 00:00:00 GMT+0200 (Eastern European Standard Time)"), [
  {
    type: SCHEDULE_EVENT_TYPE.WORK,
    start: "2023-03-06T08:00:00 +02:00",
    stop: "2023-03-06T12:00:00 +02:00",
  },
  {
    type: SCHEDULE_EVENT_TYPE.BREAK,
    start: "2023-03-06T12:00:00 +02:00",
    stop: "2023-03-06T12:30:00 +02:00",
  },
  {
    type: SCHEDULE_EVENT_TYPE.WORK,
    start: "2023-03-06T12:30:00 +02:00",
    stop: "2023-03-06T14:00:00 +02:00",
  },
  {
    type: SCHEDULE_EVENT_TYPE.BREAK,
    start: "2023-03-06T14:00:00 +02:00",
    stop: "2023-03-06T14:30:00 +02:00",
  },
  {
    type: SCHEDULE_EVENT_TYPE.WORK,
    start: "2023-03-06T14:30:00 +02:00",
    stop: "2023-03-06T16:00:00 +02:00",
  },
]);

export default mockMap;