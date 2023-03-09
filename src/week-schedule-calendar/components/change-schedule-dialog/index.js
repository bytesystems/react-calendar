import moment from 'moment/moment';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { PopUp } from '../../../pop-up'
import { DayScheduleList } from './components/day-schedule-list';
import { Button } from "react-bootstrap";
import { useFormik } from "formik"; 
import * as Yup from 'yup';
import { SCHEDULE_EVENT_TYPE } from '../../utils/schedule-event-type';
import './styles.scss';
import { DialogContext } from './dialog-context';

const validationSchema = Yup.object().shape({
  schedule: Yup.array().of(Yup.object().shape({
    type: Yup.mixed().oneOf(Object.values(SCHEDULE_EVENT_TYPE)),
    start: Yup.date(),
    stop: Yup.date(),
  }))
})

export const ChangeScheduleDialog = memo(({ onClose, isOpened, currentDay, currentDaySchedule, onConfirm }) => {

  const currentDayTitle = useMemo(() => {
    return moment(currentDay).format('dddd, D. MMMM YYYY')
  }, [currentDay]);

  // const deepCopySchedule = useMemo(() => JSON.parse(JSON.stringify(currentDaySchedule)) ?? [], [currentDaySchedule]);
  // const [scheduleToChange, setFormikValue] = useState([]);
  
  const formik = useFormik({initialValues: { schedule: [] }, validationSchema});

  const changingSchedule = useMemo(() => formik.values.schedule, [formik.values.schedule]);

  useEffect(() => {
    formik.setFieldValue('schedule', currentDaySchedule ?JSON.parse(JSON.stringify(currentDaySchedule)).map((chunk) => ({...chunk, start: moment(chunk.start), stop: moment(chunk.stop)})) : [])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDaySchedule]);

  const removeScheduleSchunk = useCallback((index) => {
    formik.setFieldValue('schedule', changingSchedule.filter((_, i) => index !== i))
  }, [changingSchedule, formik]);

    return (
      <DialogContext.Provider
        value={{ changingSchedule, removeScheduleSchunk, formik }}
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
                  <Button className="w-100" variant="light">
                    add work time
                  </Button>
                </div>
                <div className="col">
                  <Button className="w-100" variant="light">
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
