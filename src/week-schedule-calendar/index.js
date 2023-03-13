import React, { useCallback, useLayoutEffect, useMemo, useState } from "react";
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

export const WeekScheduleCalendar = (props) => {
  const {map} = props;
  console.log('WeekScheduleCalendar :',map)

  const [dateScheduler, setDateScheduler] = useState(null);
  const [hoveredElement, setHoveredElement] = useState(false);

  const [dateToChangeSchedule, setDateToChangeSchedule] = useState(null);
  const changingDaySchedule = useMemo(
    () => {

      if(dateScheduler,dateToChangeSchedule )
      {
        console.log('changingDaySchedule', dateScheduler,dateToChangeSchedule,dateScheduler.getScheduleForDay(dateToChangeSchedule))
      }


      return dateScheduler && dateToChangeSchedule
          ? dateScheduler.getScheduleForDay(dateToChangeSchedule)
          : null
    },
    [dateScheduler, dateToChangeSchedule]
  );

  const openDialogPopup = useCallback((date) => {
    setDateToChangeSchedule(format(date,'yyyyMMdd'))
  }, [setDateToChangeSchedule]);

  const closeDialogPopup = useCallback(() => {
    setDateToChangeSchedule(null)
  }, [setDateToChangeSchedule]);

  useLayoutEffect(() => {
    setDateScheduler(new DaysScheduler(map));
  }, [map]);

  const onChangeDialogComplete = useCallback((date,schedule) => {
    setDateToChangeSchedule(null)
    // map.set(date,schedule)
    console.log('on Complete change',date,schedule)
  }, []);

  const DayCellContent = (props) => {
    const { date, dayNumberText, isToday } = props
    const dateKey = format(date,'yyyyMMdd')
    if(!dateScheduler) {
      return <div>loading</div>
    }
    const schedule = dateScheduler.getScheduleForDay(dateKey)
    const totalTimeForDay = dateScheduler.getTotalTimeForDay(dateKey);
    console.log('DayCellContent: ',schedule)
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
              openDialogPopup(date);
            }}
          >+</Button>
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
          right: "today,prev,next",
        }}
        themeSystem="Simplex"
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        eventDisplay="none"
        dayCellContent={DayCellContent}
        contentHeight="auto"
      />
      <ChangeScheduleDialog
        onClose={closeDialogPopup}
        isOpened={!!dateToChangeSchedule}
        currentDay={dateToChangeSchedule}
        currentDaySchedule={changingDaySchedule}
        onConfirm={onChangeDialogComplete}
      />
    </>
  );
}
