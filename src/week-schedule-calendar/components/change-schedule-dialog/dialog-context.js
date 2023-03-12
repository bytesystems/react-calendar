import { createContext } from 'react';

export const DialogContext = createContext({
  date: null,
  schedule: [],
  // removeScheduleChunk: () => null,
  // changingScheduleErrors: [],

});
