export type SoundType = 'white' | 'brown' | 'pink' | 'rain' | 'wind' | 'ocean';

export interface ChannelState {
  type: SoundType;
  label: string;
  labelKo: string;
  active: boolean;
  volume: number; // 0-100
}

export interface Preset {
  name: string;
  channels: Pick<ChannelState, 'type' | 'active' | 'volume'>[];
  masterVolume: number;
}

export type TimerOption = 0 | 15 | 30 | 60;

export interface QuickPreset {
  name: string;
  channels: Pick<ChannelState, 'type' | 'active' | 'volume'>[];
  masterVolume: number;
}
