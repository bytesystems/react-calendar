import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import moment from "moment";

import './custom.scss'
import { DaysScheduler } from "./utils/days-scheduler";

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

    const schedule = dateScheduler.getSheduleForDay(date.toString())
    console.log(schedule)
    return (
      <div className="custom-cell-content">
        <div className="day-number">{dayNumberText}</div>
        <div className="custom-content">{}</div>
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
