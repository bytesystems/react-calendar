import moment from 'moment/moment';
import React, { memo, useCallback, useEffect, useMemo } from 'react'
import { PopUp } from '../../../pop-up'
import { DayScheduleList } from './components/day-schedule-list';
import { Button } from "react-bootstrap";
import { useFormik } from "formik"; 
import * as Yup from 'yup';
import { SCHEDULE_EVENT_TYPE } from '../../utils/schedule-event-type';
import { DialogContext } from './dialog-context';

import './styles.scss';
import { v4 } from 'uuid';

const validationSchema = Yup.object().shape({
  schedule: Yup.array()
    .of(
      Yup.object().shape({
        type: Yup.mixed().oneOf(Object.values(SCHEDULE_EVENT_TYPE)),
        start: Yup.date()
          .test((value, ctx) => {
            if (!value) {
              return ctx.createError({ message: "date is empty" });
            }
            return true;
          })
          .nullable(),
        stop: Yup.date()
          .test((value, ctx) => {
            if (!value) {
              return ctx.createError({ message: "date is empty" });
            }
            return true;
          })
          .nullable()
          .when("start", (start, schema) =>
            start
              ? schema.min(start, "Stop date must be after start date.")
              : schema
          ),
      })
    )
    .test(
      "no-gaps",
      "Intervals must not overlap or have gaps between them",
      function (value) {
        if (!value || value.length < 2) {
          return true; // allow empty array
        }
        // sort the intervals by start time
        const sortedIntervals = value
          .reduce((acc, current) => {
            if (current.start && current.stop) {
              acc.push({
                ...current,
                start: moment(current.start),
                stop: moment(current.stop),
              });
            }
            return acc;
          }, [])
          .sort((a, b) => a.start.diff(b.start));

        console.log({ sortedIntervals });

        // check for overlaps
        for (let i = 1; i < sortedIntervals.length; i++) {
          const prev = sortedIntervals[i - 1];
          const curr = sortedIntervals[i];
          console.log({ prev, curr });
          if (curr.start.isBefore(prev.stop)) {
            console.log("huita");
            return false; // overlap
          }
        }

        return true;
      }
    ),
});

export const ChangeScheduleDialog = memo(({ onClose, isOpened, currentDay, currentDaySchedule, onConfirm }) => {

  const currentDayTitle = useMemo(() => {
    return moment(currentDay).format('dddd, D. MMMM YYYY')
  }, [currentDay]);
  
  const formik = useFormik({initialValues: { schedule: [] }, validationSchema});

  const changingSchedule = useMemo(() => formik.values.schedule ?? [], [formik.values.schedule]);
  const changingScheduleErrors = useMemo(() => formik.errors.schedule ?? [], [formik.errors.schedule]);

  useEffect(() => {
    formik.setFieldValue('schedule', currentDaySchedule ?JSON.parse(JSON.stringify(currentDaySchedule)).map((chunk) => ({...chunk, start: moment(chunk.start), stop: moment(chunk.stop)})) : [])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDaySchedule]);

  const removeScheduleSchunk = useCallback((index) => {
    formik.setFieldValue('schedule', changingSchedule.filter((_, i) => index !== i))
  }, [changingSchedule, formik]);

  const addScheduleChunk = useCallback((eventType) => {
    formik.setFieldValue('schedule', [...changingSchedule, {type: eventType, start: null, stop: null, _id: v4()}])
  }, [formik, changingSchedule])

    return (
      <DialogContext.Provider
        value={{ changingSchedule, removeScheduleSchunk, formik, changingScheduleErrors, currentDay }}
      >
        <PopUp isOpened={isOpened} onClose={onClose}>
          <div
            className="h-100 w-100 p-4 d-flex flex-column"
            style={{ gridGap: "15px" }}
          >
            <div className="header">
              <h2 className="changing-day-title">{currentDayTitle}</h2>
              <div>{JSON.stringify(formik.values)}</div>
              <div>{JSON.stringify(formik.errors)}</div>
            </div>
            <div
              className="d-flex flex-column flex-grow-1"
              style={{ gridGap: "15px" }}
            >
              <div style={{ flex: "1 1 auto", height: 0 }}>
                <DayScheduleList />
              </div>
              <div className="row">
                <div className="col">
                  <Button className="w-100" variant="light" onClick={() => addScheduleChunk(SCHEDULE_EVENT_TYPE.WORK)}>
                    add work time
                  </Button>
                </div>
                <div className="col">
                  <Button className="w-100" variant="light" onClick={() => addScheduleChunk(SCHEDULE_EVENT_TYPE.BREAK)}>
                    add rest time
                  </Button>
                </div>
              </div>
            </div>
            <div className="d-flex flex-row-reverse">
              <Button>save</Button>
            </div>
          </div>
        </PopUp>
      </DialogContext.Provider>
    );
});
