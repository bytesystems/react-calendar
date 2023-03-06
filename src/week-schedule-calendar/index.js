import React, { useLayoutEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { DaysScheduler } from "./utils/days-scheduler";
import {TotalTimeInDay} from "./components/total-time-in-day";
import { ScheduleDisplay } from "./components/schedule-display";
import moment from "moment";

import './custom.scss'

export const WeekScheduleCalendar = (props) => {
  const {map} = props;

  const [dateScheduler, setDateScheduler] = useState(null);

  useLayoutEffect(() => {
    const deepCopy = JSON.parse(JSON.stringify([...map]));
    const deepCopyMap = new Map(deepCopy.map(([key, value]) => [moment(key).toDate().toString(), value]));
    
    setDateScheduler(new DaysScheduler(deepCopyMap));
  }, [map, setDateScheduler]);

  const dayCellContent = (props) => {
    const { date, dayNumberText } = props
    
    if(!dateScheduler) {
      return <div>loading</div>
    }
    const schedule = dateScheduler.getSheduleForDay(date.toString());

    if (schedule) {
      const { workTime, restTime } = schedule

      return (
        <div className="custom-cell-content">
          <div className="day-number">{dayNumberText}</div>
          <div className="custom-content">
            <TotalTimeInDay workTime={workTime} restTime={restTime} />
            <ScheduleDisplay />
          </div>
        </div>
      );
    }

    return (
      <div className="custom-cell-content">
        <div className="day-number">{dayNumberText}</div>
        <div className="custom-content">
        </div>
      </div>
    );
  };

  return (
      <FullCalendar
        firstDay={1}
        headerToolbar={{
            left: "",
            center: "title",
            right: "today,prev,next"
          }}
        themeSystem="Simplex"
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        eventDisplay="none"
        dayCellContent={dayCellContent}
      />
  );
}
