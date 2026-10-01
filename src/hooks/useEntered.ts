import { useSyncExternalStore } from 'react';
import { experience } from '../utils/experience';

export function useEntered() {
  return useSyncExternalStore(experience.subscribe, experience.getEntered);
}
