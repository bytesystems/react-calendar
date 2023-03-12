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

  const [dateScheduler, setDateScheduler] = useState(null);
  const [hoveredElement, setHoveredElement] = useState(false);

  const [dateToChangeSchedule, setDateToChangeSchedule] = useState(null);
  const changingDaySchedule = useMemo(
    () => {
      return dateScheduler && dateToChangeSchedule
          ? dateScheduler.getScheduleForDay(format(dateToChangeSchedule,'yyyyMMdd'))
          : null
    },
    [dateScheduler, dateToChangeSchedule]
  );

  const openDialogPopup = useCallback((date) => {
    setDateToChangeSchedule(date)
  }, [setDateToChangeSchedule]);

  const closeDialogPopup = useCallback(() => {
    setDateToChangeSchedule(null)
  }, [setDateToChangeSchedule]);

  useLayoutEffect(() => {
    setDateScheduler(new DaysScheduler(map));
  }, [map, setDateScheduler]);

  const onChangeDialogComplete = useCallback(() => {
    console.log('on Complete change')
  }, []);

  const DayCellContent = (props) => {
    const { date, dayNumberText, isToday } = props
    const dateKey = format(date,'yyyyMMdd')
    if(!dateScheduler) {
      return <div>loading</div>
    }
    const schedule = dateScheduler.getScheduleForDay(dateKey)
    const totalTimeForDay = dateScheduler.getTotalTimeForDay(dateKey);
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
