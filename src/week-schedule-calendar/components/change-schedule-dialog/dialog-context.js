import { createContext } from 'react';

export const DialogContext = createContext({
  // array of awalible steps
  changingSchedule: [],

  removeScheduleSchunk: () => null,
});
