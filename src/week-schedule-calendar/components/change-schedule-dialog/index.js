import moment from 'moment';
import React, { memo, useCallback, useEffect, useMemo } from 'react'
import { PopUp } from '../../../pop-up'
import { DayScheduleList } from './components/day-schedule-list';
import { Button } from "react-bootstrap";
import { useFormik } from "formik"; 
import * as Yup from 'yup';
import { SCHEDULE_EVENT_TYPE } from '../../utils/schedule-event-type';
import { DialogContext } from './dialog-context'
import ValidationError from 'yup/lib/util/createValidation';

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
      "no-crosses",
      "Intervals must not overlap",
      function (value) {
        if (!value || value.length < 2) {
          return true; // allow empty array
        }
        // sort the intervals by start time
        const mappedIntervals = value
          .reduce((acc, current) => {
              acc.push({
                ...current,
                start: moment(current.start),
                stop: moment(current.stop),
              });
            return acc;
          }, []);

        const errors = [];

        for(let i = 0; i < mappedIntervals.length; i++) {
          const target = mappedIntervals[i];

          for(let j = 0; j < mappedIntervals.length; j++) {
            if (i === j || target.type !== mappedIntervals[j].type) {
              continue;
            }

            const {start: targetStart, stop: targetStop} = target;
            const {start: iteratedStart, stop: iteratedStop} = mappedIntervals[j];
            console.log(i, j)
            if (
              iteratedStart.isValid() &&
              iteratedStop.isValid()
            ) {
              console.log(`iteratedStart.isValid() &&
              iteratedStop.isValid()`)
              if (targetStart.isValid()) {
                console.log(`targetStart.isValid()`)
                if (
                  moment(targetStart).isSameOrAfter(iteratedStart) &&
                  moment(targetStart).isBefore(iteratedStop)
                ) {
                  errors.push(this.createError({
                    path: `schedule[${i}].start`,
                    message: 'Date range overlaps'
                  }));
                  errors.push(this.createError({
                    path: `schedule[${j}].start`,
                    message: 'Date range overlaps'
                  }));
                  errors.push(this.createError({
                    path: `schedule[${j}].stop`,
                    message: 'Date range overlaps'
                  }));
                }
              }
              if (targetStop.isValid()) {
                console.log(`targetStop.isValid()`)
                if (
                  moment(targetStop).isAfter(iteratedStart) &&
                  moment(targetStop).isSameOrBefore(iteratedStop)
                ) {
                  // set errors to target field
                  errors.push(this.createError({
                    path: `schedule[${i}].stop`,
                    message: 'Date range overlaps'
                  }));

                  //set error that iterate fields also incorrect
                  errors.push(this.createError({
                    path: `schedule[${j}].start`,
                    message: 'Date range overlaps'
                  }));
                  errors.push(this.createError({
                    path: `schedule[${j}].stop`,
                    message: 'Date range overlaps'
                  }));
                }
              }
            }
          }
        }
        if (errors.length) {
          const error = this.createError({message: 'suka blyat'})
          error.errors = errors;
          return error;
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
              {/* <div>{JSON.stringify(formik.values)}</div> */}
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
