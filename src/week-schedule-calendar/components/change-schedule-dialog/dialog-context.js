import { createContext } from 'react';

export const DialogContext = createContext({
  formik: null,
  date: null,
  schedule: [],
  removeChunk: () => null,
  // changingScheduleErrors: [],

});
