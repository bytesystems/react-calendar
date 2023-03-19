import React, { memo, useMemo } from 'react'
import { DaysScheduler } from '../../utils/days-scheduler';
import {format24H} from "../../utils/time-utils";


export const ScheduleDisplayBreakRow = memo((props) => {
  const { chunk } = props;

  const timeIn24Format = useMemo(() => {
    return format24H(chunk.duration.minutes)
  }, [chunk])

    if(chunk.duration.minutes === 0) return null

  return (
    <p
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      ---{timeIn24Format} ---
    </p>
  );
})