import moment from "moment";

import { SCHEDULE_EVENT_TYPE } from "../week-schedule-calendar/utils/schedule-event-type";

const mockMap = new Map();

mockMap.set(new moment("Mon Mar 06 2023 00:00:00 GMT+0200 (Eastern European Standard Time)"), [
  {
    "_id": "6405aa2430d1ab86f5afa1f8",
    type: SCHEDULE_EVENT_TYPE.WORK,
    start: "2023-03-06T08:00:00+02:00",
    stop: "2023-03-06T12:00:00+02:00",
  },
  // {
  //   "_id": "6405aa24f2229b8281270a75",
  //   type: SCHEDULE_EVENT_TYPE.BREAK,
  //   start: "2023-03-06T12:00:00+02:00",
  //   stop: "2023-03-06T12:30:00+02:00",
  // },
  // {
  //   "_id": "6405aa2424d50365424bd761",
  //   type: SCHEDULE_EVENT_TYPE.WORK,
  //   start: "2023-03-06T12:30:00+02:00",
  //   stop: "2023-03-06T14:00:00+02:00",
  // },
  // {
  //   "_id": "6405aa2484cd2852ae90895f",
  //   type: SCHEDULE_EVENT_TYPE.BREAK,
  //   start: "2023-03-06T14:00:00+02:00",
  //   stop: "2023-03-06T14:30:00+02:00",
  // },
  // {
  //   "_id": "6405aa24d0c6ff51d2906951",
  //   type: SCHEDULE_EVENT_TYPE.WORK,
  //   start: "2023-03-06T14:30:00+02:00",
  //   stop: "2023-03-06T16:00:00+02:00",
  // },
]);

export default mockMap;