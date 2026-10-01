/** Whether she has stepped through the threshold ("Enter"). */

let entered = false;
const listeners = new Set<() => void>();

export const experience = {
  subscribe(fn: () => void) {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
  getEntered: () => entered,
  enter() {
    if (entered) return;
    entered = true;
    listeners.forEach((l) => l());
  },
};
