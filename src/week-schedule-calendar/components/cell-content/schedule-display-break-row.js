import React, { memo, useMemo } from 'react'
import { DaysScheduler } from '../../utils/days-scheduler';


export const ScheduleDisplayBreakRow = memo((props) => {
  const { chunk } = props;

  const timeIn24Format = useMemo(() => {
    const restTime = DaysScheduler.calculateTimeDiff(chunk)
    const restTimeMinutes = restTime > 60 ? restTime % 60 : 0
    const restTimeHours = restTime > 60 ? Math.trunc(restTime / 60) : restTime

    return `${restTimeMinutes}h${restTimeHours}`
  }, [chunk])

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