import React, { memo } from 'react'

export const ButtonAddSchedule = memo((props) => {
  const {onClick, style} = props;
  return (
    <button style={style} onClick={onClick}>+</button>
  )
})
