import { useCallback, useEffect, useRef, useState } from 'react';

export type AmbientPresetId = 'cosmic' | 'ney' | 'oud' | 'bowls' | 'rain' | 'none';

export const AMBIENT_PRESETS: { id: AmbientPresetId; label: string; desc: string }[] = [
  { id: 'cosmic', label: 'سكون الفضاء والحب (موسيقى هادئة)', desc: 'أوتار دافئة ونغمات سماوية مريحة للقلب' },
  { id: 'ney', label: 'ناي السكينة الروحاني', desc: 'عزف ناي هادئ بأنفاس دافئة وصدى لطيف' },
  { id: 'oud', label: 'أوتار الليل الهادئة', desc: 'عزف وتري شرقي ناعم ومتناغم للتسبيح' },
  { id: 'bowls', label: 'أجراس الكون البلورية', desc: 'رنين بلوري نقي وهادئ للتأمل' },
  { id: 'rain', label: 'مطر ليلي مع نغمات ناعمة', desc: 'حفيف مطر لطيف مع لمسات بيانو هادئة' },
  { id: 'none', label: 'بدون خلفية موسيقية', desc: 'صوت التسبيح فقط' },
];

export function useTasbihAudio(
  soundEnabled: boolean,
  musicPreset: AmbientPresetId,
  musicVolume: number,
  customAudioUrl: string | null,
  musicWanted: boolean
) {
  const ctxRef = useRef<AudioContext | null>(null);
  const ambientMasterRef = useRef<GainNode | null>(null);
  const cleanupAmbientRef = useRef<(() => void) | null>(null);
  const customAudioElRef = useRef<HTMLAudioElement | null>(null);
  const [musicPlaying, setMusicPlaying] = useState(false);

  const ensureCtx = useCallback((): AudioContext | null => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      if (!ctxRef.current) ctxRef.current = new AudioCtx();
      if (ctxRef.current.state === 'suspended') {
        ctxRef.current.resume().catch(() => {});
      }
      return ctxRef.current;
    } catch {
      return null;
    }
  }, []);

  const playClickSound = useCallback(
    (isComplete = false) => {
      if (!soundEnabled) return;
      const ctx = ensureCtx();
      if (!ctx) return;
      try {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        if (isComplete) {
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(523.25, now);
          osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.14);
          osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.32);
          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(0.16, now + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
          osc.connect(gain).connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.46);
        } else {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(640, now);
          osc.frequency.exponentialRampToValueAtTime(290, now + 0.075);
          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(0.1, now + 0.01);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.085);
          osc.connect(gain).connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.09);
        }
      } catch {
        // ignore audio context errors
      }
    },
    [soundEnabled, ensureCtx]
  );

  const stopAmbient = useCallback(() => {
    cleanupAmbientRef.current?.();
    cleanupAmbientRef.current = null;
    if (customAudioElRef.current) {
      customAudioElRef.current.pause();
    }
    setMusicPlaying(false);
  }, []);

  const startAmbient = useCallback(() => {
    stopAmbient();

    if (customAudioUrl) {
      const audio = new Audio(customAudioUrl);
      audio.loop = true;
      audio.volume = musicVolume;
      customAudioElRef.current = audio;
      audio
        .play()
        .then(() => setMusicPlaying(true))
        .catch(() => setMusicPlaying(false));
      cleanupAmbientRef.current = () => {
        audio.pause();
        audio.src = '';
        customAudioElRef.current = null;
      };
      return;
    }

    if (musicPreset === 'none') return;
    const ctx = ensureCtx();
    if (!ctx) return;

    const now0 = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, now0);
    master.gain.linearRampToValueAtTime(Math.max(0.0001, musicVolume * 0.34), now0 + 1.2);

    // Shared warm cosmic delay/reverb bus
    const reverbFilter = ctx.createBiquadFilter();
    reverbFilter.type = 'lowpass';
    reverbFilter.frequency.value = 1450;

    const delayL = ctx.createDelay(1.5);
    delayL.delayTime.value = 0.42;
    const delayR = ctx.createDelay(1.5);
    delayR.delayTime.value = 0.63;

    const fbL = ctx.createGain();
    fbL.gain.value = 0.36;
    const fbR = ctx.createGain();
    fbR.gain.value = 0.32;
    const wetGain = ctx.createGain();
    wetGain.gain.value = 0.45;

    delayL.connect(fbL).connect(reverbFilter).connect(delayR);
    delayR.connect(fbR).connect(delayL);
    delayL.connect(wetGain);
    delayR.connect(wetGain);
    wetGain.connect(master);
    master.connect(ctx.destination);

    ambientMasterRef.current = master;
    const cleanups: (() => void)[] = [];
    let alive = true;

    const sendToBus = (node: AudioNode, wetAmount = 0.6) => {
      node.connect(master);
      const send = ctx.createGain();
      send.gain.value = wetAmount;
      node.connect(send);
      send.connect(delayL);
    };

    const playSoftPluck = (
      freq: number,
      duration: number,
      peakGain: number,
      type: OscillatorType = 'triangle',
      cutoff = 1800
    ) => {
      if (!alive) return;
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const flt = ctx.createBiquadFilter();
      const g = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, t);
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 2.0, t);

      const g2 = ctx.createGain();
      g2.gain.value = 0.16;

      flt.type = 'lowpass';
      flt.frequency.setValueAtTime(cutoff, t);
      flt.frequency.exponentialRampToValueAtTime(420, t + duration);

      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(peakGain, t + 0.025);
      g.gain.exponentialRampToValueAtTime(0.0001, t + duration);

      osc.connect(flt);
      osc2.connect(g2).connect(flt);
      flt.connect(g);
      sendToBus(g, 0.72);

      osc.start(t);
      osc2.start(t);
      osc.stop(t + duration + 0.05);
      osc2.stop(t + duration + 0.05);
    };

    if (musicPreset === 'cosmic') {
      // Romantic & Serene Cosmic Progression: Dm9 -> Bbmaj7 -> Fmaj7 -> Csus2
      const chords: { pad: number[]; arp: number[] }[] = [
        { pad: [146.83, 220.0, 261.63, 329.63], arp: [293.66, 329.63, 440.0, 523.25, 659.25] },
        { pad: [116.54, 174.61, 220.0, 293.66], arp: [233.08, 293.66, 349.23, 440.0, 587.33] },
        { pad: [174.61, 220.0, 261.63, 329.63], arp: [261.63, 349.23, 440.0, 523.25, 659.25] },
        { pad: [130.81, 196.0, 261.63, 293.66], arp: [261.63, 293.66, 392.0, 523.25, 587.33] },
      ];
      let chordIdx = 0;
      let arpStep = 0;

      const triggerPadChord = () => {
        if (!alive) return;
        const t = ctx.currentTime;
        const chord = chords[chordIdx % chords.length];
        chord.pad.forEach((f, idx) => {
          const osc = ctx.createOscillator();
          const oscDetune = ctx.createOscillator();
          const flt = ctx.createBiquadFilter();
          const g = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, t);
          oscDetune.type = 'triangle';
          oscDetune.frequency.setValueAtTime(f * 1.003, t);

          flt.type = 'lowpass';
          flt.frequency.value = 720;

          const voiceGain = 0.055 / (1 + idx * 0.25);
          g.gain.setValueAtTime(0.0001, t);
          g.gain.linearRampToValueAtTime(voiceGain, t + 1.8);
          g.gain.setValueAtTime(voiceGain, t + 4.4);
          g.gain.exponentialRampToValueAtTime(0.0001, t + 6.8);

          const detGain = ctx.createGain();
          detGain.gain.value = 0.35;

          osc.connect(flt);
          oscDetune.connect(detGain).connect(flt);
          flt.connect(g);
          sendToBus(g, 0.45);

          osc.start(t);
          oscDetune.start(t);
          osc.stop(t + 7.0);
          oscDetune.stop(t + 7.0);
        });
      };

      const triggerCelestialNote = () => {
        if (!alive) return;
        const chord = chords[chordIdx % chords.length];
        const pattern = [0, 2, 1, 3, 4, 2, 3, 1];
        const noteIdx = pattern[arpStep % pattern.length];
        const freq = chord.arp[noteIdx % chord.arp.length];
        arpStep++;
        playSoftPluck(freq, 2.3, 0.075, 'sine', 2200);
      };

      triggerPadChord();
      setTimeout(() => alive && triggerCelestialNote(), 450);

      const chordTimer = window.setInterval(() => {
        chordIdx++;
        triggerPadChord();
      }, 6200);
      const arpTimer = window.setInterval(triggerCelestialNote, 1150);

      cleanups.push(() => {
        clearInterval(chordTimer);
        clearInterval(arpTimer);
      });
    } else if (musicPreset === 'ney') {
      // Warm soft drone + expressive Nahawand/Hijaz spiritual flute phrases
      const droneFreqs = [146.83, 220.0];
      droneFreqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const flt = ctx.createBiquadFilter();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = f;
        flt.type = 'lowpass';
        flt.frequency.value = 480;
        g.gain.value = 0.045 / (idx + 1);
        osc.connect(flt).connect(g);
        sendToBus(g, 0.4);
        osc.start();
        cleanups.push(() => {
          try {
            osc.stop();
            osc.disconnect();
          } catch {
            // ignore
          }
        });
      });

      // Nahawand D scale phrases
      const phrases = [
        [293.66, 329.63, 349.23, 440.0, 392.0, 349.23],
        [440.0, 466.16, 440.0, 392.0, 349.23, 329.63, 293.66],
        [349.23, 392.0, 440.0, 523.25, 466.16, 440.0],
      ];
      let pIdx = 0;
      let nIdx = 0;

      const playNeyNote = () => {
        if (!alive) return;
        const phrase = phrases[pIdx % phrases.length];
        const freq = phrase[nIdx];
        nIdx++;
        if (nIdx >= phrase.length) {
          nIdx = 0;
          pIdx++;
        }

        const t = ctx.currentTime;
        const osc = ctx.createOscillator();
        const vib = ctx.createOscillator();
        const vibGain = ctx.createGain();
        const flt = ctx.createBiquadFilter();
        const g = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);
        vib.frequency.value = 4.6;
        vibGain.gain.value = 2.8;
        vib.connect(vibGain).connect(osc.frequency);

        flt.type = 'bandpass';
        flt.frequency.value = freq * 1.6;
        flt.Q.value = 1.2;

        g.gain.setValueAtTime(0.0001, t);
        g.gain.linearRampToValueAtTime(0.085, t + 0.35);
        g.gain.setValueAtTime(0.075, t + 1.0);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 1.8);

        osc.connect(flt).connect(g);
        sendToBus(g, 0.78);

        osc.start(t);
        vib.start(t);
        osc.stop(t + 1.9);
        vib.stop(t + 1.9);
      };

      playNeyNote();
      const id = window.setInterval(playNeyNote, 1550);
      cleanups.push(() => clearInterval(id));
    } else if (musicPreset === 'oud') {
      // Gentle oriental arpeggio plucked strings
      const scale = [146.83, 220.0, 261.63, 293.66, 329.63, 349.23, 440.0, 523.25];
      const seq = [0, 3, 4, 5, 4, 2, 3, 1, 0, 3, 6, 5, 4, 3, 2, 1];
      let step = 0;
      const playStr = () => {
        if (!alive) return;
        const freq = scale[seq[step % seq.length]];
        step++;
        playSoftPluck(freq, 1.9, 0.11, 'triangle', 1650);
      };
      playStr();
      const id = window.setInterval(playStr, 780);
      cleanups.push(() => clearInterval(id));
    } else if (musicPreset === 'bowls') {
      const bowls = [220, 293.66, 329.63, 440, 587.33];
      let step = 0;
      const ringBowl = () => {
        if (!alive) return;
        const base = bowls[step % bowls.length];
        step++;
        playSoftPluck(base, 4.2, 0.085, 'sine', 1900);
        playSoftPluck(base * 2.01, 2.8, 0.025, 'sine', 2400);
      };
      ringBowl();
      const id = window.setInterval(ringBowl, 3100);
      cleanups.push(() => clearInterval(id));
    } else if (musicPreset === 'rain') {
      const len = ctx.sampleRate * 3;
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const data = buf.getChannelData(0);
      let b0 = 0;
      for (let i = 0; i < len; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.96 * b0 + 0.04 * white;
        data[i] = b0 * 2.5 + white * 0.15;
      }

      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 1100;

      const g = ctx.createGain();
      g.gain.value = 0.22;

      src.connect(filter).connect(g).connect(master);
      src.start();

      const dropNotes = [329.63, 392.0, 440.0, 523.25, 587.33];
      let step = 0;
      const id = window.setInterval(() => {
        if (!alive) return;
        playSoftPluck(dropNotes[(step++ * 3) % dropNotes.length], 2.4, 0.045, 'sine', 1600);
      }, 1900);

      cleanups.push(() => {
        clearInterval(id);
        try {
          src.stop();
          src.disconnect();
        } catch {
          // ignore
        }
      });
    }

    cleanupAmbientRef.current = () => {
      alive = false;
      cleanups.forEach((fn) => fn());
      try {
        master.disconnect();
        delayL.disconnect();
        delayR.disconnect();
      } catch {
        // ignore
      }
      ambientMasterRef.current = null;
    };
    if (ctx.state === 'running') {
      setMusicPlaying(true);
    } else {
      ctx
        .resume()
        .then(() => {
          if (alive) setMusicPlaying(ctx.state === 'running');
        })
        .catch(() => {
          if (alive) setMusicPlaying(false);
        });
    }
  }, [customAudioUrl, musicPreset, musicVolume, ensureCtx, stopAmbient]);

  const toggleMusic = useCallback(() => {
    if (musicPlaying) {
      stopAmbient();
      return false;
    } else {
      startAmbient();
      return true;
    }
  }, [musicPlaying, startAmbient, stopAmbient]);

  // Automatic ambient music startup on load + instant capture-phase unlock if browser suspended AudioContext
  useEffect(() => {
    if (!musicWanted || musicPreset === 'none' || musicPlaying) return;

    // Try starting immediately on mount (works automatically inside WebViews/APK or unlocked contexts)
    startAmbient();

    const unlock = () => {
      if (ctxRef.current && ctxRef.current.state === 'suspended') {
        ctxRef.current
          .resume()
          .then(() => {
            if (ctxRef.current?.state === 'running') setMusicPlaying(true);
          })
          .catch(() => {});
      }
      if (!cleanupAmbientRef.current) {
        startAmbient();
      }
    };
    window.addEventListener('pointerdown', unlock, { capture: true, passive: true });
    window.addEventListener('touchstart', unlock, { capture: true, passive: true });
    window.addEventListener('keydown', unlock, { capture: true });
    return () => {
      window.removeEventListener('pointerdown', unlock, { capture: true });
      window.removeEventListener('touchstart', unlock, { capture: true });
      window.removeEventListener('keydown', unlock, { capture: true });
    };
  }, [musicWanted, musicPreset, musicPlaying, startAmbient]);

  useEffect(() => {
    if (ambientMasterRef.current && ctxRef.current) {
      ambientMasterRef.current.gain.setTargetAtTime(
        Math.max(0.0001, musicVolume * 0.34),
        ctxRef.current.currentTime,
        0.1
      );
    }
    if (customAudioElRef.current) {
      customAudioElRef.current.volume = musicVolume;
    }
  }, [musicVolume]);

  useEffect(() => {
    if (musicPlaying) {
      startAmbient();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [musicPreset, customAudioUrl]);

  useEffect(() => {
    return () => {
      cleanupAmbientRef.current?.();
      try {
        ctxRef.current?.close();
      } catch {
        // ignore
      }
    };
  }, []);

  return {
    playClickSound,
    musicPlaying,
    toggleMusic,
    startAmbient,
    stopAmbient,
  };
}
