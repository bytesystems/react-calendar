import React, { memo, useCallback, useContext, useMemo } from 'react'
import { SCHEDULE_EVENT_TYPE } from '../../../../utils/schedule-event-type';
import { CloseButton } from 'react-bootstrap';
import './styles.scss';
import { DialogContext } from '../../dialog-context';

export const DayScheduleCard = memo(({ scheduleChunk, index }) => {
  const { removeScheduleSchunk, formik, changingSchedule } = useContext(
    DialogContext
  );

  const {type, start, stop} = scheduleChunk;
    console.log({start, stop})
  const headerText = useMemo(
    () => (type === SCHEDULE_EVENT_TYPE.BREAK ? "Break" : "Work"),
    [type]
  );

  const onScheduleChange = useCallback(
    (target, index, field) => {
      const { value } = target;
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
          <label className='input-label'>
            from
            <input className="time-input" value={start.format('HH:mm')} onChange={({target}) => onScheduleChange(target, index, 'start')} />
          </label>

          <label className='input-label'>
            to
            <input className="time-input" value={stop.format('HH:mm')} onChange={({target}) => onScheduleChange(target, index, 'stop')} />
          </label>
        </div>
      </div>
      <div>
        <CloseButton onClick={() => removeScheduleSchunk(index)} />
      </div>
    </li>
  );
});
