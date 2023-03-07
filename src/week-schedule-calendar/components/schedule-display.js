import React, { memo, Fragment } from 'react'
import { SCHEDULE_EVENT_TYPE } from '../utils/schedule-event-type';
import { ScheduleDisplayBreakRow } from './schedule-display-break-row';
import { ScheduleDisplayWorkRow } from './schedule-display-work-row';
import { v4 } from 'uuid';

export const ScheduleDisplay = memo((props) => {
  const { schedule } = props;

  return (
    <>
      <div className="schedule-list" style={{ wordWrap: "break-word" }}>
        {schedule.map((chunk) => (
          <Fragment key={v4()}>
            {chunk.type === SCHEDULE_EVENT_TYPE.WORK ? (
              <ScheduleDisplayWorkRow chunk={chunk} />
            ) : (
              <ScheduleDisplayBreakRow chunk={chunk} />
            )}
          </Fragment>
        ))}
      </div>
    </>
  );
})
