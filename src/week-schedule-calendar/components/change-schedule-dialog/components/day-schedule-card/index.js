import React, { memo, useCallback, useContext, useMemo } from 'react'
import { SCHEDULE_EVENT_TYPE } from '../../../../utils/schedule-event-type';
import { CloseButton } from 'react-bootstrap';
import { DialogContext } from '../../dialog-context';
import TimePicker from "rc-time-picker";
import 'rc-time-picker/assets/index.css';

import './styles.scss';

export const DayScheduleCard = memo(({ scheduleChunk, index }) => {
  const { removeScheduleSchunk, formik, changingSchedule } = useContext(
    DialogContext
  );


  const {type, start, stop} = scheduleChunk;
    // console.log({start, stop})
  const headerText = useMemo(
    () => (type === SCHEDULE_EVENT_TYPE.BREAK ? "Break" : "Work"),
    [type]
  );

  const onScheduleChange = useCallback(
    (value, index, field) => {
      changingSchedule[index][field] = value;
      formik.setFieldValue("schedule", changingSchedule);
    },
    [changingSchedule, formik]
  );

  return (
    <li className="schedule-card-container">
      <div className="card-content">
        <h3>{headerText}</h3>
        <div className="inputs-container">
          <label className="input-label">
            from
            <TimePicker
              showSecond={false}
              focusOnOpen={true}
              format="hh:mm"
              value={start}
              onChange={(value) => {onScheduleChange(value, index, 'start')}}
            />
          </label>

          <label className="input-label">
            to
            <TimePicker
              showSecond={false}
              focusOnOpen={true}
              format="hh:mm"
              value={stop}
              onChange={(value) => {onScheduleChange(value, index, 'stop')}}
            />
          </label>
        </div>
      </div>
      <div>
        <CloseButton onClick={() => removeScheduleSchunk(index)} />
      </div>
    </li>
  );
});
