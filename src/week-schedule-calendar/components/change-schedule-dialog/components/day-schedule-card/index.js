import React, { memo, useCallback, useContext, useMemo } from 'react'
import { SCHEDULE_EVENT_TYPE } from '../../../../utils/schedule-event-type';
import { CloseButton } from 'react-bootstrap';
import { DialogContext } from '../../dialog-context';
import TimePicker from "rc-time-picker";
import moment from 'moment';
import 'rc-time-picker/assets/index.css';
import './styles.scss';



export const DayScheduleCard = memo(({ scheduleChunk, index }) => {
  const {
    removeScheduleSchunk,
    formik,
    changingSchedule,
    changingScheduleErrors,
    currentDay,
  } = useContext(DialogContext);

  const cardErrors = useMemo(() => changingScheduleErrors[index] ?? null, [changingScheduleErrors, index]);
  const startErrors = useMemo(() => cardErrors ? cardErrors.start : null, [cardErrors]);
  const stopErrors = useMemo(() => cardErrors ? cardErrors.stop : null, [cardErrors]);

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
          <div style={{width: 'min-content'}}>
            <label className="input-label">
              from
              <TimePicker
                showSecond={false}
                focusOnOpen={true}
                format="HH:mm"
                value={start}
                onChange={(value) => {
                  if(!moment(value).isSame(null,'day'))
                  onScheduleChange(value, index, "start");
                }}
                style={{minWidth: '100px'}}
              />
            </label>
            {startErrors && <span className="text-danger">{JSON.stringify(startErrors)}</span>}
          </div>

          <div style={{width: 'min-content'}}>
            <label className="input-label">
              to
              <TimePicker
                showSecond={false}
                focusOnOpen={true}
                format="HH:mm"
                value={stop}
                onChange={(value) => {
                  onScheduleChange(value, index, "stop");
                }}
                style={{minWidth: '100px'}}
              />
            </label>
            {stopErrors && <p className="text-danger">{JSON.stringify(stopErrors)}</p>}
          </div>
        </div>
      </div>
      <div>
        <CloseButton onClick={() => removeScheduleSchunk(index)} />
      </div>
    </li>
  );
});
