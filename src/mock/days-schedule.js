import moment from "moment";

import { SCHEDULE_EVENT_TYPE } from "../week-schedule-calendar/utils/schedule-event-type";

const mockMap = new Map();



mockMap.set("20230306", [
  {
    "_id": "6405aa2430d1ab86f5afa1f8",
    type: SCHEDULE_EVENT_TYPE.WORK,
    start: "08:00",
    stop: "12:00",
    duration: {minutes: 240, text:"4h"}
  },
  {
    "_id": "6405aa24f2229b8281270a75",
    type: SCHEDULE_EVENT_TYPE.BREAK,
    start: "12:30",
    stop: "13:00",
    duration: {minutes: 30, text:"0h30"}
  },
  {
    "_id": "6405aa2424d50365424bd761",
    type: SCHEDULE_EVENT_TYPE.WORK,
    start: "13:00",
    stop: "15:30",
    duration: {minutes: 150, text:"2h30"}
  },
]);

export default mockMap;