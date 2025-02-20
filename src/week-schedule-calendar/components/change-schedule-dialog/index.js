import moment from 'moment';
import React, { memo, useCallback, useEffect, useMemo } from 'react'
import { PopUp } from '../../../pop-up'
import { DayScheduleList } from './components/day-schedule-list';
import { Button } from "react-bootstrap";
import { useFormik } from "formik"; 
import * as Yup from 'yup';
import { SCHEDULE_EVENT_TYPE } from '../../utils/schedule-event-type';
import { DialogContext } from './dialog-context'
import { v4 } from 'uuid';
import { validate } from '../../utils/errors-builder';

import './styles.scss';
import {format} from "date-fns";

const validationSchema = Yup.object().shape({
  schedule: Yup.array()
    .of(
      Yup.object().shape({
        type: Yup.mixed().oneOf(Object.values(SCHEDULE_EVENT_TYPE)),
        start: Yup.date()
          // .test((value, ctx) => {
          //   if (!value) {
          //     return ctx.createError({ message: "date is empty" });
          //   }
          //   return true;
          // })
          .nullable(),
        stop: Yup.date()
          // .test((value, ctx) => {
          //   if (!value) {
          //     return ctx.createError({ message: "date is empty" });
          //   }
          //   return true;
          // })
          .nullable()
          // .when("start", (start, schema) =>
          //   start
          //     ? schema.min(start, "Stop date must be after start date.")
          //     : schema
          // ),
      })
    )
    // .test(
    //   "no-crosses",
    //   "Intervals must not overlap",
    //   function (value) {
    //     if (!value || value.length < 2) {
    //       return true; // allow empty array
    //     }
    //     // sort the intervals by start time
    //     const mappedIntervals = value
    //       .reduce((acc, current) => {
    //           acc.push({
    //             ...current,
    //             start: moment(current.start),
    //             stop: moment(current.stop),
    //           });
    //         return acc;
    //       }, []);

    //     const errors = [];

    //     for(let i = 0; i < mappedIntervals.length; i++) {
    //       const target = mappedIntervals[i];

    //       for(let j = 0; j < mappedIntervals.length; j++) {
    //         if (i === j || target.type !== mappedIntervals[j].type) {
    //           continue;
    //         }

    //         const {start: targetStart, stop: targetStop} = target;
    //         const {start: iteratedStart, stop: iteratedStop} = mappedIntervals[j];
    //         console.log(i, j)
    //         if (
    //           iteratedStart.isValid() &&
    //           iteratedStop.isValid()
    //         ) {
    //           console.log(`iteratedStart.isValid() &&
    //           iteratedStop.isValid()`)
    //           if (targetStart.isValid()) {
    //             console.log(`targetStart.isValid()`)
    //             if (
    //               moment(targetStart).isSameOrAfter(iteratedStart) &&
    //               moment(targetStart).isBefore(iteratedStop)
    //             ) {
    //               errors.push(this.createError({
    //                 path: `schedule[${i}].start`,
    //                 message: 'Date range overlaps'
    //               }));
    //               errors.push(this.createError({
    //                 path: `schedule[${j}].start`,
    //                 message: 'Date range overlaps'
    //               }));
    //               errors.push(this.createError({
    //                 path: `schedule[${j}].stop`,
    //                 message: 'Date range overlaps'
    //               }));
    //             }
    //           }
    //           if (targetStop.isValid()) {
    //             console.log(`targetStop.isValid()`)
    //             if (
    //               moment(targetStop).isAfter(iteratedStart) &&
    //               moment(targetStop).isSameOrBefore(iteratedStop)
    //             ) {
    //               // set errors to target field
    //               errors.push(this.createError({
    //                 path: `schedule[${i}].stop`,
    //                 message: 'Date range overlaps'
    //               }));

    //               //set error that iterate fields also incorrect
    //               errors.push(this.createError({
    //                 path: `schedule[${j}].start`,
    //                 message: 'Date range overlaps'
    //               }));
    //               errors.push(this.createError({
    //                 path: `schedule[${j}].stop`,
    //                 message: 'Date range overlaps'
    //               }));
    //             }
    //           }
    //         }
    //       }
    //     }
    //     if (errors.length) {
    //       const error = this.createError({message: 'suka blyat'})
    //       error.errors = errors;
    //       return error;
    //     }

    //     return true;
    //   }
    // ),
});

export const ChangeScheduleDialog = memo(({ onClose, isOpened, currentDay, currentDaySchedule, onConfirm }) => {
  const currentDayTitle = useMemo(() => {
    return currentDay ? format(currentDay,'eeee, dd. LLLL yyyy') : ''
  }, [currentDay]);

  const schedule = useMemo(() => currentDaySchedule ?? [
      {type: SCHEDULE_EVENT_TYPE.WORK, start: null, stop: null, _id: v4()},
      {type: SCHEDULE_EVENT_TYPE.BREAK, start: null, stop: null, _id: v4()}
    ]
  ,[currentDay,currentDaySchedule])

  let error = false;

  const findOverlappingObjects = (arr) => {
    // Sort the array by the start time in ascending order
    arr.sort((a, b) => (a.start > b.start) ? 1 : -1);

    // Loop through the sorted array, comparing adjacent objects
    for (let i = 0; i < arr.length - 1; i++) {
      let currentObj = arr[i];
      let nextObj = arr[i + 1];

      // Check if the stop time of the current object overlaps with the start time of the next object
      if (currentObj.stop >= nextObj.start && currentObj.type === nextObj.type) {
        error = true;
        currentObj.overlap = true;
        nextObj.overlap= true;
      }
    }

    return arr;
  }

  const formik = useFormik({initialValues: { schedule: (schedule ?? [
        {type: SCHEDULE_EVENT_TYPE.WORK, start: null, stop: null, _id: v4()},
        {type: SCHEDULE_EVENT_TYPE.BREAK, start: null, stop: null, _id: v4()}
      ]) }, validationSchema, validate, enableReinitialize: true });
  //
  // const changingScheduleErrors = useMemo(() => formik.errors.schedule ?? [], [formik.errors.schedule]);
  const removeScheduleChunk = useCallback((index) => {
    formik.setFieldValue('schedule', formik.values.schedule.filter((_, i) => index !== i))
  }, [formik]);

  const addScheduleChunk = useCallback((eventType) => {
    formik.setFieldValue('schedule', [...formik.values.schedule, {type: eventType, start: null, stop: null, _id: v4()}])
  }, [formik])

    return (
      <DialogContext.Provider
        value={{ date: currentDay, schedule: formik.values.schedule, removeChunk: removeScheduleChunk, formik: formik }}
      >
        <PopUp isOpened={isOpened} onClose={onClose}>
          <div
            className="h-100 w-100 p-4 d-flex flex-column"
            style={{ gridGap: "15px" }}
          >
            <div className="header">
              <h2 className="changing-day-title">{currentDayTitle}</h2>
              {/* <div>{JSON.stringify(formik.values)}</div> */}
              {/*<div>{JSON.stringify(formik.errors)}</div>*/}
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
              <Button onClick={() => onConfirm(currentDay, formik.values.schedule)}>save</Button>
            </div>
          </div>
        </PopUp>
      </DialogContext.Provider>
    );
});
