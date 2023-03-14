import React, { memo, useCallback, useContext, useMemo } from 'react'
import { SCHEDULE_EVENT_TYPE } from '../../../../utils/schedule-event-type';
import { CloseButton } from 'react-bootstrap';
import { DialogContext } from '../../dialog-context';
import './styles.scss';
import {RangeInput} from "../../../range-input";
import moment from "moment";



export const DayScheduleCard = memo(({ scheduleChunk, index }) => {

  const {
    removeChunk,
    formik,
    schedule,
    changingScheduleErrors,
    currentDay,
  } = useContext(DialogContext);

  // const cardErrors = useMemo(() => changingScheduleErrors[index] ?? null, [changingScheduleErrors, index]);
  // const startErrors = useMemo(() => cardErrors ? cardErrors.start : null, [cardErrors]);
  // const stopErrors = useMemo(() => cardErrors ? cardErrors.stop : null, [cardErrors]);

  const currentDayMoment = useMemo(() => moment(currentDay), [currentDay]);
  const {type} = scheduleChunk;
  const headerText = useMemo(
    () => (type === SCHEDULE_EVENT_TYPE.BREAK ? "Break" : "Work"),
    [type]
  );


  const onScheduleChange = useCallback(
    (value, index) => {
      schedule[index] = {...schedule[index], ...value};
      formik.setFieldValue("schedule", schedule);
    },
    [schedule, formik, currentDayMoment]
  );
  return (
    <li className="schedule-card-container">
      <div className="card-content">
        <h3>{headerText}</h3>
        <div className="inputs-container">
            <RangeInput
                inputClassName="form-control"
                onChange={(value) => {
                  onScheduleChange(value, index);
                }}
                timespan={scheduleChunk}
            />
        </div>
      </div>
      <div>
        <CloseButton onClick={() => removeChunk(index)} />
      </div>
    </li>
  );
});
