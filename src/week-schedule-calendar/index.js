import React, {createRef, useCallback, useLayoutEffect, useMemo, useState} from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import moment from "moment";
import { DaysScheduler } from "./utils/days-scheduler";
import {TotalTimeInDay} from "./components/cell-content/total-time-in-day";
import { ScheduleDisplay } from "./components/cell-content/schedule-display";
import { ChangeScheduleDialog } from "./components/change-schedule-dialog";

import './custom.scss'
import { Button } from "react-bootstrap";
import {format} from "date-fns";
import {events} from "../api/events";
import {calculateTotalTime} from "./utils/time-utils";

export const WeekScheduleCalendar = (props) => {
  const calendarRef = createRef()

  const {map} = props;

  const [show, setShow] = useState(false)
  const [hoveredElement, setHoveredElement] = useState(false);
  const [currentDate,setCurrentDate] = useState(null)
  const [currentSchedule,setCurrentSchedule] = useState(null)



  const openDialogPopup = useCallback((date,schedule) => {
    setShow(true)
    setCurrentSchedule(schedule)
    setCurrentDate(date)
  }, [setCurrentSchedule,setCurrentDate]);

  const closeDialogPopup = useCallback(() => {
    setShow(false)
    setCurrentSchedule(null)
    setCurrentDate(null)
  }, [setCurrentSchedule,setCurrentDate]);
  //
  // useLayoutEffect(() => {
  //   setDateScheduler(new DaysScheduler(map));
  // }, [map]);

  const onChangeDialogComplete = useCallback((date,schedule) => {
    const calendarApi = calendarRef.current.getApi()
    const event = calendarApi.getEventById(format(date,'yyyy-MM-dd'))
    event.setExtendedProp('schedule',schedule)
    calendarApi.refetchEvents()
    setShow(false)
    // map.set(date,schedule)
    console.log('on Complete change',date,schedule)
  }, [calendarRef]);

  const DayCellContent = (props) => {
    const { date, dayNumberText, isToday, view } = props
    const event = view.calendar.getEventById(format(date,'yyyy-MM-dd'))
    const schedule = event ? event.extendedProps.schedule : null
    const totalTimeForDay = schedule ? calculateTotalTime(schedule) : null

      return (
        <div
          className="custom-cell-content"
          onMouseEnter={() => {
            setHoveredElement(date.toString());
          }}
          onMouseLeave={() => {
            setHoveredElement(null);
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
                aaa
                <ScheduleDisplay schedule={schedule} />
              </>
            )}
          </div>

          <Button
            style={{
              opacity:
                hoveredElement === date.toString() ||
                (isToday && !hoveredElement)
                  ? "1"
                  : "0",
            }}
            onClick={() => {
              openDialogPopup(date,schedule);
            }}
          >+</Button>
        </div>
      );
  };

  return (
    <>
      <FullCalendar
        ref={calendarRef}
        firstDay={1}
        headerToolbar={{
          left: "",
          center: "title",
          right: "today,prev,next",
        }}
        // themeSystem="Simplex"
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        eventDisplay="none"
        dayCellContent={DayCellContent}
        // contentHeight="auto"
        events={events}
      />
      <ChangeScheduleDialog
        onClose={closeDialogPopup}
        isOpened={show}
        currentDay={currentDate}
        currentDaySchedule={currentSchedule}
        onConfirm={onChangeDialogComplete}
      />
    </>
  );
}
