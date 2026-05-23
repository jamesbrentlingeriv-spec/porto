import type { LucideIcon } from 'lucide-react';
import type React from 'react';

export interface AppConfig {
  id: string;
  title: string;
  icon: LucideIcon | string;
  component: React.FC;
  defaultSize?: { width: number; height: number };
}