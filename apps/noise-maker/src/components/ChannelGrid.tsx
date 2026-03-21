import React from 'react';
import { ChannelState, SoundType } from '../types';
import ChannelCard from './ChannelCard';

interface Props {
  channels: ChannelState[];
  onToggle: (type: SoundType) => void;
  onVolumeChange: (type: SoundType, volume: number) => void;
}

export default function ChannelGrid({ channels, onToggle, onVolumeChange }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {channels.map((ch) => (
        <ChannelCard
          key={ch.type}
          channel={ch}
          onToggle={onToggle}
          onVolumeChange={onVolumeChange}
        />
      ))}
    </div>
  );
}
