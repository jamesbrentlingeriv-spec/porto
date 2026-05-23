import { createContext } from 'react';

export interface SoundContextValue {
  muted: boolean;
  toggleMuted: () => void;
}

export const SoundContext = createContext<SoundContextValue>({
  muted: true,
  toggleMuted: () => {},
});