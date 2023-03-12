import React, { memo, useCallback, useContext, useMemo } from 'react'
import { SCHEDULE_EVENT_TYPE } from '../../../../utils/schedule-event-type';
import { CloseButton } from 'react-bootstrap';
import { DialogContext } from '../../dialog-context';
import './styles.scss';
import {RangeInput} from "../../../range-input";
import moment from "moment";



export const DayScheduleCard = memo(({ scheduleChunk, index }) => {

    console.log('scheduleChunk: ',scheduleChunk)

  const {
    removeScheduleChunk,
    formik,
    changingSchedule,
    changingScheduleErrors,
    currentDay,
  } = useContext(DialogContext);

  // const cardErrors = useMemo(() => changingScheduleErrors[index] ?? null, [changingScheduleErrors, index]);
  // const startErrors = useMemo(() => cardErrors ? cardErrors.start : null, [cardErrors]);
  // const stopErrors = useMemo(() => cardErrors ? cardErrors.stop : null, [cardErrors]);

  const currentDayMoment = useMemo(() => moment(currentDay), [currentDay]);


  const {type, start, stop} = scheduleChunk;
    // console.log({start, stop})
  const headerText = useMemo(
    () => (type === SCHEDULE_EVENT_TYPE.BREAK ? "Break" : "Work"),
    [type]
  );


  const onScheduleChange = useCallback(
    (value, index, field) => {
      const val = moment(value);
      if (!val.isSame(currentDayMoment, 'day')) {
        changingSchedule[index][field] = moment(currentDayMoment).set('hours', val.hours()).set('minutes', val.minutes());
      } else {
        changingSchedule[index][field] = value;
      }
      formik.setFieldValue("schedule", changingSchedule);
    },
    [changingSchedule, formik, currentDayMoment]
  );

  return (
    <li className="schedule-card-container">
      <div className="card-content">
        <h3>{headerText}</h3>
        <div className="inputs-container">
            <RangeInput
                inputClassName="form-control"
                onChange={(e) => console.log(e)}
                timespan={scheduleChunk}
            />
        </div>
      </div>
      <div>
        <CloseButton onClick={() => removeScheduleChunk(index)} />
      </div>
    </li>
  );
});
