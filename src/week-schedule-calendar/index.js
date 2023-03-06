import React from "react";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import {events} from "../mock/events";

import './custom.scss'

const renderDayCellContent = (props) => {
  const { date, dayNumberText } = props
  
  console.log({props})
  return (
    <div className="custom-cell-content">
      <div className="day-number">{dayNumberText}</div>
      <div className="custom-content">Custom content goes here</div>
    </div>
  );
};

export const WeekScheduleCalendar = () => {
  let firstDaty = 1;

  return (
      <FullCalendar
        firstDay={firstDaty}
        headerToolbar={{
            left: "",
            center: "title",
            right: "today,prev,next"
          }}
        themeSystem="Simplex"
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        eventDisplay="none"
        dayCellContent={renderDayCellContent}
        aspectRatio={1}
      />
  );
}
