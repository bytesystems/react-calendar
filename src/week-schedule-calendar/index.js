import React, { useCallback, useLayoutEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { DaysScheduler } from "./utils/days-scheduler";
import {TotalTimeInDay} from "./components/total-time-in-day";
import { ScheduleDisplay } from "./components/schedule-display";
import moment from "moment";
import { ButtonAddSchedule } from "./components/button-add-schedule";

import './custom.scss'
import { AddScheduleChunk } from "./components/add-schedule-chunk";

export const WeekScheduleCalendar = (props) => {
  const {map} = props;

  const [dateScheduler, setDateScheduler] = useState(null);

  const [hoveredElement, setHoveredElement] = useState(false);

  const [dateToChangeSchedule, setDateToChangeSchedule] = useState(null);
  const openDialogPopup = useCallback((date) => {
    setDateToChangeSchedule(date)
  }, [setDateToChangeSchedule]);

  const closeDialogPopup = useCallback(() => {
    setDateToChangeSchedule(null)
  }, [setDateToChangeSchedule]);

  useLayoutEffect(() => {
    const deepCopy = JSON.parse(JSON.stringify([...map]));
    const deepCopyMap = new Map(deepCopy.map(([key, value]) => [moment(key).toDate().toString(), value]));
    setDateScheduler(new DaysScheduler(deepCopyMap));
  }, [map, setDateScheduler]);

  const DayCellContent = (props) => {
    const { date, dayNumberText, isToday } = props

    if(!dateScheduler) {
      return <div>loading</div>
    }

    const schedule = dateScheduler.getScheduleForDay(date.toString())
    const totalTimeForDay = dateScheduler.getTotalTimeForDay(date.toString());
      return (
        <div
          className="custom-cell-content"
          onMouseEnter={() => {
            setHoveredElement(date.toString())
          }}
          onMouseLeave={() => {
            setHoveredElement(null)
          }}
        >
          <div className="day-number">{dayNumberText}</div>
          <div className="custom-content">
            {schedule && totalTimeForDay && (
              <>
                <TotalTimeInDay
                  workTime={totalTimeForDay.workTime}
                  restTime={totalTimeForDay.restTime}
                />
                <ScheduleDisplay schedule={schedule} />
              </>
            )}
          </div>
          {isToday && !hoveredElement && <ButtonAddSchedule onClick={() => {openDialogPopup(date)}} />}
          {hoveredElement === date.toString() && <ButtonAddSchedule onClick={() => {openDialogPopup(date)}} />}
        </div>
      );
  };

  return (
    <>
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
        dayCellContent={DayCellContent}
        contentHeight="auto"
      />
      <AddScheduleChunk onClose={closeDialogPopup} isOpened={!!dateToChangeSchedule} />
    </>
  );
}
