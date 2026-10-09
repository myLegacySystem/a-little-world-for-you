import { useSyncExternalStore } from 'react';
import { autoplay } from '../utils/autoplay';

export function useAutoplay() {
  return useSyncExternalStore(autoplay.subscribe, autoplay.getSnapshot);
}
