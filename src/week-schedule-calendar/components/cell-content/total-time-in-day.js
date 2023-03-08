import React, { memo } from 'react'

export const TotalTimeInDay = memo((props) => {
  const { workTime, restTime } = props;

  const workTimeMinutes = workTime % 60
  const workTimeHours = Math.trunc(workTime / 60)
  const restTimeMinutes = restTime > 60 ? restTime % 60 : 0
  const restTimeHours = restTime > 60 ? Math.trunc(restTime / 60) : restTime

  return (
    <b className="total-time-in-delay">{`${workTimeHours}h${workTimeMinutes} + ${restTimeMinutes}h${restTimeHours} Pause`}</b>
  )
})
