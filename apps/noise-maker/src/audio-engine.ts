import { SoundType } from './types';

let audioContext: AudioContext | null = null;

const DEFAULT_SAMPLE_RATE = 44100;

interface ChannelNodes {
  source: AudioBufferSourceNode | OscillatorNode | null;
  gain: GainNode;
  lfo?: OscillatorNode;
  lfoGain?: GainNode;
  noiseSource?: AudioBufferSourceNode;
  extraOscillators?: OscillatorNode[];
  extraGains?: GainNode[];
}

const channels: Map<SoundType, ChannelNodes> = new Map();
let masterGain: GainNode | null = null;

function getContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
}

function createNoiseBuffer(ctx: AudioContext): AudioBuffer {
  const bufferSize = ctx.sampleRate * 2;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

function createPinkNoiseBuffer(ctx: AudioContext): AudioBuffer {
  const bufferSize = ctx.sampleRate * 2;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.96900 * b2 + white * 0.1538520;
    b3 = 0.86650 * b3 + white * 0.3104856;
    b4 = 0.55000 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.0168980;
    data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
    b6 = white * 0.115926;
  }
  return buffer;
}

function ensureMasterGain(ctx: AudioContext): GainNode {
  if (!masterGain) {
    masterGain = ctx.createGain();
    masterGain.gain.value = 0.7;
    masterGain.connect(ctx.destination);
  }
  return masterGain;
}

export function setMasterVolume(volume: number): void {
  if (masterGain) {
    masterGain.gain.setTargetAtTime(volume / 100, masterGain.context.currentTime, 0.02);
  }
}

export function startChannel(type: SoundType, volume: number): void {
  const ctx = getContext();
  const master = ensureMasterGain(ctx);

  stopChannel(type);

  const gain = ctx.createGain();
  gain.gain.value = volume / 100;
  gain.connect(master);

  const nodes: ChannelNodes = { source: null, gain };

  switch (type) {
    case 'white': {
      const buffer = createNoiseBuffer(ctx);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      source.connect(gain);
      source.start();
      nodes.source = source;
      break;
    }

    case 'brown': {
      const buffer = createNoiseBuffer(ctx);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 400;
      source.connect(filter);
      filter.connect(gain);
      // Boost brown noise volume since lowpass cuts a lot
      gain.gain.value = (volume / 100) * 3;
      source.start();
      nodes.source = source;
      break;
    }

    case 'pink': {
      const buffer = createPinkNoiseBuffer(ctx);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      source.connect(gain);
      source.start();
      nodes.source = source;
      break;
    }

    case 'rain': {
      const buffer = createNoiseBuffer(ctx);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const bandpass = ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.value = 1000;
      bandpass.Q.value = 0.5;

      const highpass = ctx.createBiquadFilter();
      highpass.type = 'highpass';
      highpass.frequency.value = 2500;

      // Amplitude modulation for rain drops
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.7;

      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 6;
      const lfoDepth = ctx.createGain();
      lfoDepth.gain.value = 0.3;
      lfo.connect(lfoDepth);
      lfoDepth.connect(lfoGain.gain);

      source.connect(bandpass);
      source.connect(highpass);
      bandpass.connect(lfoGain);
      highpass.connect(lfoGain);
      lfoGain.connect(gain);

      // Boost rain
      gain.gain.value = (volume / 100) * 2;

      source.start();
      lfo.start();
      nodes.source = source;
      nodes.lfo = lfo;
      nodes.lfoGain = lfoGain;
      break;
    }

    case 'wind': {
      const buffer = createNoiseBuffer(ctx);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const lowpass = ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.value = 600;

      // LFO modulates the filter frequency for wind gusts
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.3;
      const lfoDepth = ctx.createGain();
      lfoDepth.gain.value = 400;
      lfo.connect(lfoDepth);
      lfoDepth.connect(lowpass.frequency);

      // Also modulate gain for more realism
      const gainLfo = ctx.createOscillator();
      gainLfo.type = 'sine';
      gainLfo.frequency.value = 0.5;
      const gainLfoDepth = ctx.createGain();
      gainLfoDepth.gain.value = (volume / 100) * 0.3;
      gainLfo.connect(gainLfoDepth);
      gainLfoDepth.connect(gain.gain);

      gain.gain.value = (volume / 100) * 2;

      source.connect(lowpass);
      lowpass.connect(gain);

      source.start();
      lfo.start();
      gainLfo.start();
      nodes.source = source;
      nodes.lfo = lfo;
      nodes.noiseSource = source;
      nodes.extraOscillators = [gainLfo];
      nodes.extraGains = [gainLfoDepth];
      break;
    }

    case 'ocean': {
      const buffer = createNoiseBuffer(ctx);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const lowpass = ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.value = 800;

      // Slow sine LFO on gain for wave rhythm
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.1;
      const lfoDepth = ctx.createGain();
      lfoDepth.gain.value = (volume / 100) * 0.8;
      lfo.connect(lfoDepth);
      lfoDepth.connect(gain.gain);

      gain.gain.value = (volume / 100) * 1.5;

      source.connect(lowpass);
      lowpass.connect(gain);

      source.start();
      lfo.start();
      nodes.source = source;
      nodes.lfo = lfo;
      break;
    }
  }

  channels.set(type, nodes);
}

export function stopChannel(type: SoundType): void {
  const nodes = channels.get(type);
  if (!nodes) return;

  try {
    nodes.source?.stop();
    nodes.source?.disconnect();
  } catch {
    // already stopped
  }
  try {
    nodes.lfo?.stop();
    nodes.lfo?.disconnect();
  } catch {
    // already stopped
  }
  if (nodes.extraOscillators) {
    for (const osc of nodes.extraOscillators) {
      try { osc.stop(); osc.disconnect(); } catch { /* already stopped */ }
    }
  }
  if (nodes.extraGains) {
    for (const g of nodes.extraGains) {
      try { g.disconnect(); } catch { /* ok */ }
    }
  }
  if (nodes.lfoGain) {
    try { nodes.lfoGain.disconnect(); } catch { /* ok */ }
  }
  nodes.gain.disconnect();
  channels.delete(type);
}

export function setChannelVolume(type: SoundType, volume: number): void {
  const nodes = channels.get(type);
  if (!nodes) return;

  const ctx = getContext();
  let adjustedVolume = volume / 100;

  // Apply same boost factors as in startChannel
  switch (type) {
    case 'brown':
      adjustedVolume *= 3;
      break;
    case 'rain':
      adjustedVolume *= 2;
      break;
    case 'wind':
      adjustedVolume *= 2;
      break;
    case 'ocean':
      adjustedVolume *= 1.5;
      break;
  }

  nodes.gain.gain.setTargetAtTime(adjustedVolume, ctx.currentTime, 0.02);
}

export function stopAll(): void {
  for (const type of channels.keys()) {
    stopChannel(type);
  }
}

/** Fade master volume to 0 over `durationSec` seconds, then stop all channels. */
export function fadeOutAndStop(durationSec: number): Promise<void> {
  return new Promise((resolve) => {
    if (!masterGain || channels.size === 0) {
      stopAll();
      resolve();
      return;
    }
    const ctx = getContext();
    const now = ctx.currentTime;
    masterGain.gain.cancelScheduledValues(now);
    masterGain.gain.setValueAtTime(masterGain.gain.value, now);
    masterGain.gain.linearRampToValueAtTime(0, now + durationSec);

    setTimeout(() => {
      stopAll();
      // Restore master gain value so next play isn't muted
      if (masterGain) {
        masterGain.gain.setValueAtTime(0.7, ctx.currentTime);
      }
      resolve();
    }, durationSec * 1000 + 100);
  });
}

export function initAudio(): void {
  getContext();
}
