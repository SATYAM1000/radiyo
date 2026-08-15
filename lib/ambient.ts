/* Ambient sound loops synthesized with the Web Audio API — no audio files,
   no copyright, a few hundred bytes of code per sound. Each generator
   returns a stop() handle that tears the graph down. */

export type AmbientSound = "rain" | "fan" | "crickets";

export interface AmbientHandle {
  stop: () => void;
}

function noiseBuffer(ctx: AudioContext, brown = false): AudioBuffer {
  const length = 2 * ctx.sampleRate;
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < length; i++) {
    const white = Math.random() * 2 - 1;
    if (brown) {
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.5;
    } else {
      data[i] = white;
    }
  }
  return buffer;
}

function startRain(ctx: AudioContext): void {
  // Steady rain bed: lowpassed white noise…
  const bed = ctx.createBufferSource();
  bed.buffer = noiseBuffer(ctx);
  bed.loop = true;
  const bedFilter = ctx.createBiquadFilter();
  bedFilter.type = "lowpass";
  bedFilter.frequency.value = 900;
  const bedGain = ctx.createGain();
  bedGain.gain.value = 0.18;
  bed.connect(bedFilter).connect(bedGain).connect(ctx.destination);
  bed.start();

  // …plus a brighter patter layer, gently wobbled so it doesn't sound static.
  const patter = ctx.createBufferSource();
  patter.buffer = noiseBuffer(ctx);
  patter.loop = true;
  const patterFilter = ctx.createBiquadFilter();
  patterFilter.type = "bandpass";
  patterFilter.frequency.value = 3200;
  patterFilter.Q.value = 0.8;
  const patterGain = ctx.createGain();
  patterGain.gain.value = 0.05;
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.4;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 0.02;
  lfo.connect(lfoGain).connect(patterGain.gain);
  patter.connect(patterFilter).connect(patterGain).connect(ctx.destination);
  patter.start();
  lfo.start();
}

function startFan(ctx: AudioContext): void {
  // Ceiling-fan wash: brown noise with a slow amplitude wobble (blade beat)…
  const wash = ctx.createBufferSource();
  wash.buffer = noiseBuffer(ctx, true);
  wash.loop = true;
  const washFilter = ctx.createBiquadFilter();
  washFilter.type = "lowpass";
  washFilter.frequency.value = 400;
  const washGain = ctx.createGain();
  washGain.gain.value = 0.22;
  const beat = ctx.createOscillator();
  beat.frequency.value = 3.1; // ~186 rpm blade pass
  const beatGain = ctx.createGain();
  beatGain.gain.value = 0.07;
  beat.connect(beatGain).connect(washGain.gain);
  wash.connect(washFilter).connect(washGain).connect(ctx.destination);
  wash.start();
  beat.start();

  // …plus a faint motor hum.
  const hum = ctx.createOscillator();
  hum.type = "triangle";
  hum.frequency.value = 100;
  const humGain = ctx.createGain();
  humGain.gain.value = 0.015;
  hum.connect(humGain).connect(ctx.destination);
  hum.start();
}

function startCrickets(ctx: AudioContext): void {
  // Chirp = 4.4kHz carrier gated by a fast trill, gated again by a slow
  // chirp-rest cycle. Two voices, slightly detuned and out of phase.
  for (const [carrierHz, trillHz, cycleHz, phase] of [
    [4400, 24, 0.9, 0],
    [4150, 21, 0.7, 0.5],
  ] as const) {
    const carrier = ctx.createOscillator();
    carrier.frequency.value = carrierHz;
    const trill = ctx.createOscillator();
    trill.frequency.value = trillHz;
    const trillGain = ctx.createGain();
    trillGain.gain.value = 0;
    const cycle = ctx.createOscillator();
    cycle.frequency.value = cycleHz;
    if (phase) {
      // Offset the second voice so the two crickets alternate.
      cycle.start(ctx.currentTime + phase / cycleHz);
    } else {
      cycle.start();
    }
    const cycleShaper = ctx.createWaveShaper();
    // Squash the sine into an on/off gate with a soft edge.
    const curve = new Float32Array(256);
    for (let i = 0; i < 256; i++) {
      const x = (i / 255) * 2 - 1;
      curve[i] = x > 0.2 ? 1 : 0;
    }
    cycleShaper.curve = curve;
    const cycleGain = ctx.createGain();
    cycleGain.gain.value = 0; // driven entirely by the gate below
    // AudioParam connections ADD to the base value, so scale the 0..1 gate
    // down to the target loudness before it reaches the param.
    const gateScale = ctx.createGain();
    gateScale.gain.value = 0.012;

    trill.connect(trillGain.gain);
    cycle.connect(cycleShaper).connect(gateScale).connect(cycleGain.gain);
    carrier.connect(trillGain).connect(cycleGain).connect(ctx.destination);
    carrier.start();
    trill.start();
  }
}

const generators: Record<AmbientSound, (ctx: AudioContext) => void> = {
  rain: startRain,
  fan: startFan,
  crickets: startCrickets,
};

export function startAmbient(sound: AmbientSound): AmbientHandle {
  const ctx = new AudioContext();
  generators[sound](ctx);
  return {
    stop: () => {
      void ctx.close();
    },
  };
}

export const AMBIENT_LABELS: Record<AmbientSound, string> = {
  rain: "🌧 Rain",
  fan: "🌀 Fan",
  crickets: "🦗 Night",
};
