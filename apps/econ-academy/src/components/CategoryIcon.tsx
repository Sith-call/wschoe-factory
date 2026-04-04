import React from 'react';
import { Blocks, BarChart3, Handshake, Scale, Ruler, TrendingUp, Landmark, Waves, Building2, Globe } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = { Blocks, BarChart3, Handshake, Scale, Ruler, TrendingUp, Landmark, Waves, Building2, Globe };

export function CategoryIcon({ name, size = 20, className = '' }: { name: string; size?: number; className?: string }) {
  const Icon = iconMap[name];
  if (!Icon) return null;
  return <Icon size={size} strokeWidth={1.5} className={className} />;
}
