// loadEvents.ts
import events from './events.json';

export const loadEvents = () => {
  return events.map(event => ({
    ...event,
    start: new Date(event.time.start),
    end: new Date(event.time.end)
  }));
};