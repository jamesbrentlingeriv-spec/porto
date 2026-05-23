import { createContext, useContext } from 'react';

export interface DragLockContextValue {
  locked: boolean;
  setLocked: (v: boolean) => void;
}

export const DragLockContext = createContext<DragLockContextValue>({
  locked: false,
  setLocked: () => {},
});

export const useDragLock = () => useContext(DragLockContext);