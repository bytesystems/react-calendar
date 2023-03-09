import { createContext } from 'react';

export const DialogContext = createContext({
  formik: null,

  changingSchedule: [],

  removeScheduleSchunk: () => null,
});
