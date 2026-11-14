import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Award,
  Download,
  Headphones,
  Lock,
  Maximize2,
  Minimize2,
  Music,
  Palette,
  Plus,
  RotateCcw,
  Smartphone,
  Sparkles,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { CosmicScene } from './components/CosmicScene';
import { BottomColorDock } from './components/BottomColorDock';
import { SplashScreen } from './components/SplashScreen';
import {
  ParticleBurstCanvas,
  type ParticleBurstHandle,
} from './components/ParticleBurstCanvas';
import {
  AchievementsModal,
  AddDhikrModal,
  MusicSettingsModal,
  ResetModal,
} from './components/TasbihModals';
import { useTasbihAudio, type AmbientPresetId } from './hooks/useTasbihAudio';
import {
  COSMIC_THEMES,
  DEFAULT_THEME_ID,
  getThemeById,
  type BeadShape,
  type CameraFocusId,
  type CosmicThemeId,
  type ParticleFxType,
} from './types/cosmic';

interface DhikrOption {
  dhikr: string;
  target: number;
}

const DEFAULT_DHIKR_LIST: DhikrOption[] = [
  { dhikr: 'سُبْحَانَ اللهِ', target: 33 },
  { dhikr: 'الْحَمْدُ لِلَّهِ', target: 33 },
  { dhikr: 'لَا إِلَهَ إِلَّا اللهُ', target: 100 },
  { dhikr: 'أَسْتَغْفِرُ اللهَ', target: 100 },
  { dhikr: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ', target: 100 },
];

function hslToRgbTuple(h: number, s: number, l: number): [number, number, number] {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const hp = h / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  let r1 = 0;
  let g1 = 0;
  let b1 = 0;
  if (hp >= 0 && hp < 1) {
    r1 = c;
    g1 = x;
  } else if (hp >= 1 && hp < 2) {
    r1 = x;
    g1 = c;
  } else if (hp >= 2 && hp < 3) {
    g1 = c;
    b1 = x;
  } else if (hp >= 3 && hp < 4) {
    g1 = x;
    b1 = c;
  } else if (hp >= 4 && hp < 5) {
    r1 = x;
    b1 = c;
  } else {
    r1 = c;
    b1 = x;
  }
  const m = l - c / 2;
  return [
    Math.round((r1 + m) * 255),
    Math.round((g1 + m) * 255),
    Math.round((b1 + m) * 255),
  ];
}

function hexToRgbTuple(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean;
  const num = parseInt(full, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function applyThemeCssVars(
  primary: string,
  secondary: string,
  deep: string,
  rgbTuple: [number, number, number]
) {
  const root = document.documentElement;
  const [r, g, b] = rgbTuple;
  root.style.setProperty('--neon-color', primary);
  root.style.setProperty('--accent-primary', primary);
  root.style.setProperty('--accent-secondary', secondary);
  root.style.setProperty('--accent-deep', deep);
  root.style.setProperty('--accent-glow', `rgba(${r}, ${g}, ${b}, 0.36)`);
  root.style.setProperty('--accent-border', `rgba(${r}, ${g}, ${b}, 0.48)`);
  root.style.setProperty('--accent-surface', `rgba(${r}, ${g}, ${b}, 0.16)`);
}

export default function App() {
  // Always auto-starts with Pink (#ff007f) automatically on open
  const [themeId, setThemeId] = useState<CosmicThemeId>(DEFAULT_THEME_ID);
  const [showSplash, setShowSplash] = useState(true);
  const activeTheme = useMemo(() => getThemeById(themeId), [themeId]);

  // Live accent color state (reflects Rainbow cycling when active, so inline styles react cleanly)
  const [liveColor, setLiveColor] = useState(activeTheme.primary);

  // 3D Space Explorer state
  const [spaceMode, setSpaceMode] = useState(false);
  const [cameraFocus, setCameraFocus] = useState<CameraFocusId>('cosmos');
  const [cameraTrigger, setCameraTrigger] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [motionSpeed, setMotionSpeed] = useState(0.2);
  const [glowIntensity, setGlowIntensity] = useState(0.5);

  // Original Tasbih state (matching localStorage keys from original app)
  const [count, setCount] = useState<number>(() => {
    return parseInt(localStorage.getItem('tasbih_count') || '0', 10) || 0;
  });
  const [totalCount, setTotalCount] = useState<number>(() => {
    return parseInt(localStorage.getItem('tasbih_total') || '0', 10) || 0;
  });
  const [rounds, setRounds] = useState<number>(() => {
    return parseInt(localStorage.getItem('tasbih_rounds') || '0', 10) || 0;
  });
  const [target, setTarget] = useState<number>(() => {
    return parseInt(localStorage.getItem('tasbih_target') || '33', 10) || 33;
  });
  const [activeDhikr, setActiveDhikr] = useState<string>(() => {
    return localStorage.getItem('tasbih_dhikr') || 'سُبْحَانَ اللهِ';
  });
  const [customDhikrs, setCustomDhikrs] = useState<DhikrOption[]>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('tasbih_custom') || '[]');
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });
  const [dhikrTotals, setDhikrTotals] = useState<Record<string, number>>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('tasbih_dhikr_totals') || '{}');
      return saved && typeof saved === 'object' ? saved : {};
    } catch {
      return {};
    }
  });
  const [streak] = useState<number>(() => {
    const lastDate = localStorage.getItem('tasbih_last_date');
    const savedStreak = parseInt(localStorage.getItem('tasbih_streak') || '1', 10) || 1;
    const today = new Date().toDateString();
    if (lastDate && lastDate !== today) {
      const prev = new Date(lastDate);
      const diffDays = Math.round((new Date().getTime() - prev.getTime()) / 864e5);
      if (diffDays === 1) {
        const next = savedStreak + 1;
        localStorage.setItem('tasbih_streak', String(next));
        localStorage.setItem('tasbih_last_date', today);
        return next;
      }
      if (diffDays > 1) {
        localStorage.setItem('tasbih_streak', '1');
        localStorage.setItem('tasbih_last_date', today);
        return 1;
      }
    }
    localStorage.setItem('tasbih_last_date', today);
    return savedStreak;
  });

  const [beadShape, setBeadShape] = useState<BeadShape>(() => {
    return (localStorage.getItem('tasbih_shape') as BeadShape) || 'shape-circle';
  });
  const [particleFx, setParticleFx] = useState<ParticleFxType>(() => {
    return (localStorage.getItem('tasbih_fx_type') as ParticleFxType) || 'sparks';
  });

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticsEnabled, setHapticsEnabled] = useState(() => {
    return localStorage.getItem('tasbih_haptic') !== 'false';
  });
  const [wakeLockActive, setWakeLockActive] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Music settings (auto-starts soothing music on first touch unless user pauses it)
  const [musicPreset, setMusicPreset] = useState<AmbientPresetId>(() => {
    return (localStorage.getItem('tasbih_music_preset') as AmbientPresetId) || 'cosmic';
  });
  const [musicVolume, setMusicVolume] = useState(() => {
    const saved = parseFloat(localStorage.getItem('tasbih_music_volume') || '0.5');
    return Number.isFinite(saved) ? saved : 0.5;
  });
  const [musicWanted, setMusicWanted] = useState(() => {
    return localStorage.getItem('tasbih_music_enabled') !== 'false';
  });
  const [customAudioUrl, setCustomAudioUrl] = useState<string | null>(null);
  const [customAudioName, setCustomAudioName] = useState<string | null>(null);

  // Modals & UI feedback
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [musicModalOpen, setMusicModalOpen] = useState(false);
  const [achievementsModalOpen, setAchievementsModalOpen] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [floatingDhikrs, setFloatingDhikrs] = useState<
    { id: number; text: string; x: number; y: number }[]
  >([]);

  const particleRef = useRef<ParticleBurstHandle | null>(null);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const rainbowHueRef = useRef(330);

  const { playClickSound, musicPlaying, toggleMusic, startAmbient } = useTasbihAudio(
    soundEnabled,
    musicPreset,
    musicVolume,
    customAudioUrl,
    musicWanted
  );

  // Hidden /apk, /html, ?apk=1, ?html=1 download overlay (zero download button inside UI, APK, or HTML)
  const [apkRouteOpen, setApkRouteOpen] = useState(() => {
    if (typeof window === 'undefined') return false;
    if (window.location.protocol === 'file:') return false;
    const p = window.location.pathname;
    const sp = new URLSearchParams(window.location.search);
    return p === '/apk' || p === '/html' || sp.get('apk') === '1' || sp.get('html') === '1';
  });
  const [apkBlobUrl, setApkBlobUrl] = useState<string | null>(null);
  const [htmlBlobUrl, setHtmlBlobUrl] = useState<string | null>(null);
  const [apkStatus, setApkStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    if (!apkRouteOpen) return;
    let cancelled = false;
    let createdApkUrl: string | null = null;
    let createdHtmlUrl: string | null = null;
    setApkStatus('loading');

    Promise.allSettled([
      fetch('/tasbih-fatoum.apk', { cache: 'no-store' }).then((res) =>
        res.ok ? res.blob() : Promise.reject(new Error('apk not found'))
      ),
      fetch('/tasbih-fatoum.html', { cache: 'no-store' }).then((res) =>
        res.ok ? res.blob() : Promise.reject(new Error('html not found'))
      ),
    ]).then(([apkRes, htmlRes]) => {
      if (cancelled) return;
      if (apkRes.status === 'fulfilled') {
        const typedApk = new Blob([apkRes.value], { type: 'application/vnd.android.package-archive' });
        createdApkUrl = URL.createObjectURL(typedApk);
        setApkBlobUrl(createdApkUrl);
      }
      if (htmlRes.status === 'fulfilled') {
        const typedHtml = new Blob([htmlRes.value], { type: 'text/html;charset=utf-8' });
        createdHtmlUrl = URL.createObjectURL(typedHtml);
        setHtmlBlobUrl(createdHtmlUrl);
      }
      setApkStatus(
        apkRes.status === 'fulfilled' || htmlRes.status === 'fulfilled' ? 'ready' : 'error'
      );
    });

    return () => {
      cancelled = true;
      if (createdApkUrl) URL.revokeObjectURL(createdApkUrl);
      if (createdHtmlUrl) URL.revokeObjectURL(createdHtmlUrl);
    };
  }, [apkRouteOpen]);

  const handleTriggerApkDownload = () => {
    const a = document.createElement('a');
    a.href = apkBlobUrl || '/tasbih-fatoum.apk';
    a.download = 'tasbih-fatoum.apk';
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleTriggerHtmlDownload = () => {
    const a = document.createElement('a');
    a.href = htmlBlobUrl || '/tasbih-fatoum.html';
    a.download = 'tasbih-fatoum.html';
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const closeApkRoute = () => {
    setApkRouteOpen(false);
    window.history.replaceState({}, '', '/');
  };

  // Persist Tasbih progress
  useEffect(() => {
    try {
      localStorage.setItem('tasbih_count', String(count));
      localStorage.setItem('tasbih_total', String(totalCount));
      localStorage.setItem('tasbih_rounds', String(rounds));
      localStorage.setItem('tasbih_target', String(target));
      localStorage.setItem('tasbih_dhikr', activeDhikr);
      localStorage.setItem('tasbih_shape', beadShape);
      localStorage.setItem('tasbih_fx_type', particleFx);
      localStorage.setItem('tasbih_custom', JSON.stringify(customDhikrs));
      localStorage.setItem('tasbih_dhikr_totals', JSON.stringify(dhikrTotals));
      localStorage.setItem('tasbih_haptic', hapticsEnabled ? 'true' : 'false');
    } catch {
      // ignore storage errors
    }
  }, [
    count,
    totalCount,
    rounds,
    target,
    activeDhikr,
    beadShape,
    particleFx,
    customDhikrs,
    dhikrTotals,
    hapticsEnabled,
  ]);

  // Global Theme Synchronization (static colors OR continuous Rainbow RGB loop)
  useEffect(() => {
    if (!activeTheme.isRainbow) {
      setLiveColor(activeTheme.primary);
      applyThemeCssVars(
        activeTheme.primary,
        activeTheme.secondary,
        activeTheme.deep,
        hexToRgbTuple(activeTheme.primary)
      );
      return;
    }

    let rafId = 0;
    let lastTick = 0;
    const step = (now: number) => {
      rafId = requestAnimationFrame(step);
      if (now - lastTick < 40) return;
      lastTick = now;

      const h = (rainbowHueRef.current + 0.75) % 360;
      rainbowHueRef.current = h;
      const h2 = (h + 38) % 360;
      const primary = `hsl(${h.toFixed(0)}, 92%, 60%)`;
      const secondary = `hsl(${h2.toFixed(0)}, 95%, 76%)`;
      const deep = `hsl(${h.toFixed(0)}, 70%, 18%)`;
      const rgb = hslToRgbTuple(h, 0.92, 0.6);
      setLiveColor(primary);
      applyThemeCssVars(primary, secondary, deep, rgb);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [activeTheme]);

  // Progress glow radius sync (matching original HTML behavior)
  const pct = Math.min(100, (count / Math.max(1, target)) * 100);
  useEffect(() => {
    const glowMin = 20 + (pct / 100) * 90;
    document.documentElement.style.setProperty('--glow-min', `${glowMin}px`);
    document.documentElement.style.setProperty('--glow-max', `${glowMin * 1.8}px`);
  }, [pct]);

  // WakeLock sync
  const toggleWakeLock = useCallback(async () => {
    if (!('wakeLock' in navigator)) return;
    try {
      if (wakeLockActive && wakeLockRef.current) {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
        setWakeLockActive(false);
      } else {
        wakeLockRef.current = await navigator.wakeLock.request('screen');
        wakeLockRef.current.addEventListener('release', () => setWakeLockActive(false));
        setWakeLockActive(true);
      }
    } catch {
      setWakeLockActive(false);
    }
  }, [wakeLockActive]);

  // Fullscreen sync
  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    const onFs = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onFs);
    return () => document.removeEventListener('fullscreenchange', onFs);
  }, []);

  const allDhikrs = useMemo(() => [...DEFAULT_DHIKR_LIST, ...customDhikrs], [customDhikrs]);

  const handleTap = useCallback(
    (clientX?: number, clientY?: number) => {
      const next = count + 1;
      const completed = next >= target;
      const x = clientX ?? window.innerWidth / 2;
      const y = clientY ?? window.innerHeight / 2;

      setTotalCount((t) => t + 1);
      setDhikrTotals((prev) => ({
        ...prev,
        [activeDhikr]: (prev[activeDhikr] || 0) + 1,
      }));

      const floatId = Date.now() + Math.random();
      setFloatingDhikrs((prev) => [...prev.slice(-10), { id: floatId, text: activeDhikr, x, y }]);
      window.setTimeout(() => {
        setFloatingDhikrs((prev) => prev.filter((item) => item.id !== floatId));
      }, 1900);

      const burstColor = activeTheme.isRainbow
        ? `hsl(${rainbowHueRef.current.toFixed(0)}, 95%, 60%)`
        : activeTheme.primary;

      try {
        document.dispatchEvent(
          new CustomEvent('tasbih-tap', {
            detail: { count: completed ? target : next, target, completed },
          })
        );
      } catch {
        // ignore
      }

      if (completed) {
        setCount(0);
        setRounds((r) => r + 1);
        playClickSound(true);
        if (hapticsEnabled && 'vibrate' in navigator) {
          navigator.vibrate([40, 60, 80, 60, 140]);
        }
        particleRef.current?.burst(x, y, burstColor, particleFx, true);
        setIsShaking(true);
        window.setTimeout(() => setIsShaking(false), 500);
      } else {
        setCount(next);
        playClickSound(false);
        if (hapticsEnabled && 'vibrate' in navigator) {
          navigator.vibrate(22);
        }
        particleRef.current?.burst(x, y, burstColor, particleFx, false);
      }
    },
    [
      count,
      target,
      activeDhikr,
      activeTheme,
      particleFx,
      hapticsEnabled,
      playClickSound,
    ]
  );

  // Space / Enter keyboard shortcut (matching original)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (spaceMode || (showSplash && !apkRouteOpen)) return;
      if (addModalOpen || musicModalOpen || achievementsModalOpen || resetModalOpen) return;
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        handleTap();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [spaceMode, showSplash, apkRouteOpen, addModalOpen, musicModalOpen, achievementsModalOpen, resetModalOpen, handleTap]);

  const handleAddDhikr = (dhikrText: string, dhikrTarget: number) => {
    setCustomDhikrs((prev) => [...prev, { dhikr: dhikrText, target: dhikrTarget }]);
    setActiveDhikr(dhikrText);
    setTarget(dhikrTarget);
    setCount(0);
  };

  const handleResetCurrent = () => {
    setCount(0);
  };

  const handleResetAll = () => {
    setCount(0);
    setTotalCount(0);
    setRounds(0);
    setDhikrTotals({});
  };

  const ringRadius = 52;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference - (pct / 100) * ringCircumference;

  return (
    <div
      dir="rtl"
      className={`min-h-screen flex flex-col justify-between relative overflow-hidden select-none text-slate-100 ${
        isShaking ? 'supernova-shake' : ''
      }`}
      onClick={(e) => {
        if (spaceMode) return;
        const t = e.target as HTMLElement;
        if (
          t.closest('button') ||
          t.closest('input') ||
          t.closest('.modal-container') ||
          t.closest('love-stage')
        ) {
          return;
        }
        handleTap(e.clientX, e.clientY);
      }}
    >
      {/* 0. Original 12-Second Splash Screen */}
      {!apkRouteOpen && showSplash && (
        <SplashScreen
          durationMs={12000}
          onUserTap={() => {
            if (musicWanted && !musicPlaying) startAmbient();
          }}
          onFinish={() => setShowSplash(false)}
        />
      )}

      {/* 1. Deep Space 3D WebGL Background (Nebulae, Spiral Galaxies, Black Hole, Stars, Meteors, Asteroids) */}
      <CosmicScene
        theme={activeTheme}
        cameraFocus={cameraFocus}
        cameraTrigger={cameraTrigger}
        autoRotate={autoRotate}
        motionSpeed={motionSpeed}
        glowIntensity={glowIntensity}
      />

      {/* 2. Particle Burst Overlay */}
      <ParticleBurstCanvas ref={particleRef} />

      {/* 3. Floating Dhikr Popups */}
      {!spaceMode &&
        floatingDhikrs.map((item) => (
          <div
            key={item.id}
            className="floating-dhikr font-black pointer-events-none"
            style={{
              color: liveColor,
              textShadow: `0 0 15px ${liveColor}, 0 0 30px ${liveColor}`,
              left: `${item.x - 45}px`,
              top: `${item.y - 25}px`,
            }}
          >
            {item.text}
          </div>
        ))}

      {/* 4. 3D Space Explorer Return Bar */}
      {spaceMode && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-40">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSpaceMode(false);
            }}
            className="px-4 py-2 rounded-full border font-extrabold text-xs text-white flex items-center gap-2 shadow-xl transition active:scale-95 cursor-pointer"
            style={{
              background: 'rgba(6, 9, 22, 0.88)',
              borderColor: 'var(--accent-border)',
              boxShadow: '0 0 24px var(--accent-glow)',
            }}
          >
            <Sparkles size={14} style={{ color: 'var(--accent-secondary)' }} />
            <span>العودة إلى السبحة</span>
          </button>
        </div>
      )}

      {/* 5. 3D Space Bottom Color & Camera Dock */}
      {spaceMode && (
        <BottomColorDock
          activeTheme={activeTheme}
          onSelectTheme={setThemeId}
          cameraFocus={cameraFocus}
          onSelectCamera={(id) => {
            setCameraFocus(id);
            setCameraTrigger((n) => n + 1);
          }}
          autoRotate={autoRotate}
          onToggleAutoRotate={() => setAutoRotate((v) => !v)}
          motionSpeed={motionSpeed}
          onChangeMotionSpeed={setMotionSpeed}
          glowIntensity={glowIntensity}
          onChangeGlowIntensity={setGlowIntensity}
        />
      )}

      {/* 6. Original Tasbih Header + Main + Footer */}
      {!spaceMode && (
        <>
          <header
            className="p-2 sm:p-3 z-30 flex flex-col items-center max-w-lg mx-auto w-full border-b sticky top-0"
            style={{
              background: 'rgba(6, 9, 22, 0.78)',
              borderColor: 'var(--accent-border)',
            }}
          >
            <div className="flex flex-wrap justify-center items-center w-full mb-1 gap-y-1.5">
              <div className="flex items-center justify-center gap-1.5 w-full">
                <span
                  className="text-xl select-none"
                  style={{ filter: 'drop-shadow(0 0 6px var(--accent-glow))' }}
                >
                  💘
                </span>
                <div>
                  <h1
                    className="text-sm sm:text-base font-extrabold text-center"
                    style={{
                      color: 'var(--accent-secondary)',
                      textShadow: '0 0 10px var(--accent-glow)',
                    }}
                  >
                    ۝« ﴿مُـحَـمَّـد رَاضِـي﴾ »۝
                  </h1>
                  <span
                    className="text-[10px] block -mt-0.5 text-center font-bold"
                    style={{ color: 'var(--accent-secondary)' }}
                  >
                    نسخة مميزة لـ فطوم 💗 مني محمد راضي
                  </span>
                </div>
                <span
                  className="text-xl select-none"
                  style={{ filter: 'drop-shadow(0 0 6px var(--accent-glow))' }}
                >
                  💗
                </span>
              </div>

              <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap justify-center">
                <div
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold border"
                  style={{
                    background: 'var(--accent-surface)',
                    borderColor: 'var(--accent-border)',
                    color: 'var(--accent-secondary)',
                  }}
                  title="أيام المداومة المتتالية"
                >
                  <span>🔥</span>
                  <span>{streak}</span>
                  <span className="text-[9px]">يوم</span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSoundEnabled((v) => !v);
                  }}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border text-xs flex items-center justify-center transition cursor-pointer"
                  style={{
                    background: soundEnabled ? 'rgba(9, 12, 24, 0.9)' : 'rgba(9, 12, 24, 0.7)',
                    borderColor: soundEnabled ? 'var(--accent-border)' : 'rgba(255,255,255,0.12)',
                    color: soundEnabled ? 'var(--accent-secondary)' : '#71717a',
                  }}
                  title={soundEnabled ? 'كتم أصوات النقر' : 'تشغيل أصوات النقر'}
                >
                  {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-rose-400" />}
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const nowPlaying = toggleMusic();
                    setMusicWanted(nowPlaying);
                    try {
                      localStorage.setItem('tasbih_music_enabled', nowPlaying ? 'true' : 'false');
                    } catch {
                      // ignore
                    }
                  }}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border text-xs flex items-center justify-center transition relative cursor-pointer"
                  style={{
                    background:
                      musicPlaying && musicPreset !== 'none'
                        ? 'var(--accent-surface)'
                        : 'rgba(9, 12, 24, 0.9)',
                    borderColor:
                      musicPlaying && musicPreset !== 'none'
                        ? 'var(--accent-primary)'
                        : 'rgba(255,255,255,0.12)',
                    color:
                      musicPlaying && musicPreset !== 'none'
                        ? 'var(--accent-secondary)'
                        : '#71717a',
                  }}
                  title={musicPlaying ? 'إيقاف الموسيقى مؤقتاً' : 'تشغيل الموسيقى'}
                >
                  <Headphones className="w-3.5 h-3.5" />
                  {musicPlaying && musicPreset !== 'none' && (
                    <span
                      className="w-1.5 h-1.5 rounded-full animate-ping absolute -top-0.5 -right-0.5"
                      style={{ background: 'var(--accent-primary)' }}
                    />
                  )}
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMusicModalOpen(true);
                  }}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border text-xs flex items-center justify-center transition relative cursor-pointer"
                  style={{
                    background: 'rgba(9, 12, 24, 0.9)',
                    borderColor: 'var(--accent-border)',
                    color: 'var(--accent-secondary)',
                  }}
                  title="اختيار نوع الموسيقى ومستوى الصوت"
                >
                  <Music className="w-3.5 h-3.5" />
                </button>

                {'vibrate' in navigator && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setHapticsEnabled((v) => !v);
                    }}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border text-xs flex items-center justify-center transition cursor-pointer"
                    style={{
                      background: 'rgba(9, 12, 24, 0.9)',
                      borderColor: hapticsEnabled ? 'var(--accent-border)' : 'rgba(255,255,255,0.12)',
                      color: hapticsEnabled ? 'var(--accent-secondary)' : '#71717a',
                    }}
                    title={hapticsEnabled ? 'تعطيل الهزاز (Haptics)' : 'تفعيل الهزاز للأندرويد'}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                  </button>
                )}

                {'wakeLock' in navigator && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      void toggleWakeLock();
                    }}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border text-xs flex items-center justify-center transition cursor-pointer"
                    style={{
                      background: wakeLockActive ? 'var(--accent-surface)' : 'rgba(9, 12, 24, 0.9)',
                      borderColor: wakeLockActive ? 'var(--accent-border)' : 'rgba(255,255,255,0.12)',
                      color: wakeLockActive ? 'var(--accent-secondary)' : '#71717a',
                    }}
                    title={wakeLockActive ? 'الشاشة نشطة دائماً' : 'تفعيل مانع انطفاء الشاشة'}
                  >
                    <Lock className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    void toggleFullscreen();
                  }}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-zinc-800 bg-zinc-900/90 text-zinc-400 hover:text-white text-xs flex items-center justify-center transition cursor-pointer"
                  title="ملء الشاشة"
                >
                  {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setAchievementsModalOpen(true);
                  }}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border text-xs flex items-center justify-center transition cursor-pointer"
                  style={{
                    background: 'rgba(9, 12, 24, 0.9)',
                    borderColor: 'var(--accent-border)',
                    color: 'var(--accent-secondary)',
                  }}
                  title="الأوسمة والإنجازات"
                >
                  <Award className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setResetModalOpen(true);
                  }}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-zinc-800 bg-zinc-900/90 text-zinc-400 hover:text-rose-400 text-xs flex items-center justify-center transition cursor-pointer"
                  title="تصفير العداد"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setThemeId((prev) => (prev === 'rainbow' ? DEFAULT_THEME_ID : 'rainbow'));
                  }}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 rainbow-swatch-anim flex items-center justify-center transition cursor-pointer ${
                    activeTheme.isRainbow ? 'scale-110 ring-2 ring-white/80' : 'opacity-90 hover:scale-105'
                  }`}
                  style={{
                    borderColor: activeTheme.isRainbow ? '#ffffff' : 'rgba(255,255,255,0.45)',
                    boxShadow: activeTheme.isRainbow
                      ? '0 0 14px rgba(255,0,127,0.8), 0 0 24px rgba(0,243,255,0.7)'
                      : '0 0 10px rgba(255,255,255,0.22)',
                  }}
                  title="تشغيل أو إيقاف لون قوس قزح"
                  aria-label="زرار قوس قزح"
                />

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSpaceMode(true);
                  }}
                  className="px-2.5 h-7 sm:h-8 rounded-full border text-[11px] font-extrabold flex items-center gap-1 transition cursor-pointer"
                  style={{
                    background: 'var(--accent-surface)',
                    borderColor: 'var(--accent-border)',
                    color: '#fff',
                  }}
                  title="استكشاف الفضاء والسدم والثقب الأسود 3D"
                >
                  <Sparkles className="w-3 h-3" style={{ color: 'var(--accent-secondary)' }} />
                  <span>الفضاء 3D</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-[11px] sm:text-xs font-black px-4 py-0.5 rounded-full border border-zinc-800 bg-zinc-950/90 rgb-neon-signature select-none">
                ۝« ﴿فُـطُـوم﴾ »۝ 🦦💗
              </div>
              <span
                className="text-[11px] font-bold select-none"
                style={{
                  color: 'var(--accent-secondary)',
                  textShadow: '0 0 8px var(--accent-glow)',
                }}
              >
                فَاطِمَة عَلَاء
              </span>
            </div>
          </header>

          <main className="flex-1 flex flex-col items-center justify-center px-4 py-2 z-20 max-w-lg mx-auto w-full cursor-pointer">
            {/* Exact untouched Love Stage with Mohamed & Fatoum characters + Ghosts + Skits */}
            <love-stage />

            {/* Dhikr selector */}
            <div className="w-full max-w-sm mb-2 px-1">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-bold text-zinc-400">اختر الذكر:</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setAddModalOpen(true);
                  }}
                  className="text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                  style={{ color: 'var(--accent-secondary)' }}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>أضف ذكراً من عندك</span>
                </button>
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto py-1 px-1 scrollbar-none w-full">
                {allDhikrs.map((item) => {
                  const selected = activeDhikr === item.dhikr;
                  return (
                    <button
                      key={item.dhikr}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDhikr(item.dhikr);
                        setTarget(item.target);
                        setCount(0);
                      }}
                      className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition-all border shrink-0 cursor-pointer ${
                        selected ? 'font-bold scale-102' : 'bg-zinc-900/80 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                      }`}
                      style={
                        selected
                          ? {
                              background: 'rgba(15, 18, 32, 0.92)',
                              borderColor: 'var(--accent-primary)',
                              color: 'var(--accent-secondary)',
                              boxShadow: '0 0 12px var(--accent-glow)',
                            }
                          : undefined
                      }
                    >
                      {item.dhikr} ({item.target})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Dhikr Title & Round Info */}
            <div className="text-center mb-1 min-h-[48px] flex flex-col justify-center select-none">
              <h2
                className="text-2xl sm:text-3xl font-black mb-1 transition-colors duration-300 dhikr-ambient-glow"
                style={{ color: liveColor, textShadow: `0 0 16px ${liveColor}` }}
              >
                {activeDhikr}
              </h2>
              <p className="text-xs text-zinc-400 font-medium">
                الدورة الحالية: <span className="font-bold text-white">{rounds + 1}</span> | الهدف:{' '}
                <span className="font-bold" style={{ color: liveColor }}>
                  {target}
                </span>
              </p>
            </div>

            {/* SVG Progress Ring & Bead */}
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 my-2 flex items-center justify-center mx-auto">
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 120 120">
                <defs>
                  <linearGradient id="rainbowRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ff007f" />
                    <stop offset="25%" stopColor="#fbbf24" />
                    <stop offset="50%" stopColor="#39ff14" />
                    <stop offset="75%" stopColor="#00f3ff" />
                    <stop offset="100%" stopColor="#bf5af2" />
                  </linearGradient>
                </defs>
                <circle
                  className="text-zinc-900/90"
                  strokeWidth="4"
                  stroke="currentColor"
                  fill="transparent"
                  r={ringRadius}
                  cx="60"
                  cy="60"
                />
                <circle
                  className="progress-ring__circle"
                  strokeWidth="5"
                  strokeDasharray={`${ringCircumference} ${ringCircumference}`}
                  strokeDashoffset={ringOffset}
                  strokeLinecap="round"
                  stroke={activeTheme.isRainbow ? 'url(#rainbowRingGrad)' : liveColor}
                  fill="transparent"
                  r={ringRadius}
                  cx="60"
                  cy="60"
                />
              </svg>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleTap(e.clientX, e.clientY);
                }}
                className={`relative z-20 w-36 h-36 sm:w-40 sm:h-40 bead-btn ${beadShape} ${
                  activeTheme.isRainbow ? 'bead-rainbow' : 'bg-zinc-900'
                } border-2 flex flex-col items-center justify-center cursor-pointer outline-none select-none`}
                style={{ borderColor: activeTheme.isRainbow ? '#ffffff' : liveColor }}
              >
                <span className="relative z-10 text-4xl sm:text-5xl font-black text-white drop-shadow-md select-none">
                  {count}
                </span>
                <span className="relative z-10 text-[10px] font-bold text-white/95 mt-1 drop-shadow select-none">
                  اضغط للتسبيح
                </span>
              </button>
            </div>

            {/* 4 Stats Row */}
            <div
              className="mt-2 border rounded-2xl px-4 py-2 flex justify-around w-full max-w-sm text-center shadow-lg"
              style={{
                background: 'rgba(10, 12, 22, 0.85)',
                borderColor: 'var(--accent-border)',
              }}
            >
              <div>
                <span className="block text-[9px] text-zinc-400">العد الحالي</span>
                <span className="text-sm font-bold text-slate-100">{count}</span>
              </div>
              <div className="w-px bg-zinc-800" />
              <div>
                <span className="block text-[9px] text-zinc-400">مجموع الذكر</span>
                <span className="text-sm font-bold" style={{ color: liveColor }}>
                  {dhikrTotals[activeDhikr] || 0}
                </span>
              </div>
              <div className="w-px bg-zinc-800" />
              <div>
                <span className="block text-[9px] text-zinc-400">الدورات</span>
                <span className="text-sm font-bold" style={{ color: 'var(--accent-secondary)' }}>
                  {rounds}
                </span>
              </div>
              <div className="w-px bg-zinc-800" />
              <div>
                <span className="block text-[9px] text-zinc-400">الإجمالي الكلي</span>
                <span className="text-sm font-bold" style={{ color: liveColor }}>
                  {totalCount}
                </span>
              </div>
            </div>
          </main>

          {/* Bottom Customizer Footer (Exact original swatches + Rainbow RGB + Shape + FX) */}
          <footer className="p-2 sm:p-3 z-30 max-w-lg mx-auto w-full space-y-2 pb-safe">
            <div
              className="border rounded-2xl p-2"
              style={{
                background: 'rgba(10, 12, 22, 0.88)',
                borderColor: 'var(--accent-border)',
              }}
            >
              <label className="block text-[10px] font-bold text-zinc-400 mb-1.5 text-center flex items-center justify-center gap-1">
                <Palette className="w-3 h-3" style={{ color: 'var(--accent-secondary)' }} />
                <span>تجميعات ألوان النيون (Neon RGB Customizer):</span>
              </label>
              <div className="flex justify-center gap-1.5 flex-wrap">
                {COSMIC_THEMES.map((t) => {
                  const selected = themeId === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setThemeId(t.id);
                      }}
                      className={`px-2.5 py-1 rounded-xl border text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        t.isRainbow
                          ? `rainbow-pill-btn ${selected ? 'rainbow-pill-active scale-105 font-extrabold' : 'hover:scale-105'}`
                          : selected
                            ? 'shadow-sm font-extrabold scale-105 bg-zinc-950'
                            : 'border-zinc-800 text-zinc-400 hover:text-white bg-zinc-900'
                      }`}
                      style={
                        !t.isRainbow && selected
                          ? {
                              borderColor: 'var(--accent-primary)',
                              color: 'var(--accent-secondary)',
                              boxShadow: '0 0 12px var(--accent-glow)',
                            }
                          : undefined
                      }
                    >
                      {t.isRainbow && (
                        <span className="w-3.5 h-3.5 rounded-full rainbow-swatch-anim inline-block border border-white/80 shrink-0" />
                      )}
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div
              className="border rounded-2xl p-2 flex justify-around items-center"
              style={{
                background: 'rgba(10, 12, 22, 0.88)',
                borderColor: 'var(--accent-border)',
              }}
            >
              <div>
                <label className="block text-[9px] font-bold text-zinc-400 mb-1 text-center">
                  شكل الزر:
                </label>
                <div className="flex gap-1">
                  {(
                    [
                      { id: 'shape-circle', icon: '🟢', title: 'دائري' },
                      { id: 'shape-gem', icon: '💎', title: 'جوهرة' },
                      { id: 'shape-crescent', icon: '🌙', title: 'هلال' },
                      { id: 'shape-heart', icon: '💖', title: 'قلب' },
                    ] as const
                  ).map((sh) => (
                    <button
                      key={sh.id}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setBeadShape(sh.id);
                      }}
                      className="px-2 py-0.5 rounded-lg border text-xs transition cursor-pointer"
                      style={
                        beadShape === sh.id
                          ? {
                              borderColor: 'var(--accent-primary)',
                              background: 'var(--accent-surface)',
                            }
                          : { borderColor: '#27272a' }
                      }
                      title={sh.title}
                    >
                      {sh.icon}
                    </button>
                  ))}
                </div>
              </div>

              <div className="w-px h-8 bg-zinc-800" />

              <div>
                <label className="block text-[9px] font-bold text-zinc-400 mb-1 text-center">
                  نوع التأثير:
                </label>
                <div className="flex gap-1">
                  {(
                    [
                      { id: 'sparks', label: '✨ نجوم' },
                      { id: 'fireworks', label: '🎆 ألعاب' },
                      { id: 'plasma', label: '⚡ بلازما' },
                    ] as const
                  ).map((fx) => (
                    <button
                      key={fx.id}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setParticleFx(fx.id);
                      }}
                      className={`px-2 py-0.5 rounded-lg border text-[10px] font-bold transition cursor-pointer ${
                        particleFx === fx.id ? '' : 'border-zinc-800 text-zinc-400'
                      }`}
                      style={
                        particleFx === fx.id
                          ? {
                              borderColor: 'var(--accent-primary)',
                              background: 'var(--accent-surface)',
                              color: 'var(--accent-secondary)',
                            }
                          : undefined
                      }
                    >
                      {fx.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </footer>
        </>
      )}

      {/* Modals */}
      <AddDhikrModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={handleAddDhikr}
      />

      <MusicSettingsModal
        open={musicModalOpen}
        onClose={() => setMusicModalOpen(false)}
        preset={musicPreset}
        onSelectPreset={(id) => {
          setMusicPreset(id);
          try {
            localStorage.setItem('tasbih_music_preset', id);
            localStorage.setItem('tasbih_music_enabled', id === 'none' ? 'false' : 'true');
          } catch {
            // ignore
          }
          if (id === 'none') {
            setMusicWanted(false);
          } else {
            setMusicWanted(true);
            if (!musicPlaying) setTimeout(() => startAmbient(), 20);
          }
        }}
        volume={musicVolume}
        onChangeVolume={(val) => {
          setMusicVolume(val);
          try {
            localStorage.setItem('tasbih_music_volume', String(val));
          } catch {
            // ignore
          }
        }}
        playing={musicPlaying}
        onTogglePlay={() => {
          const nowPlaying = toggleMusic();
          setMusicWanted(nowPlaying);
          try {
            localStorage.setItem('tasbih_music_enabled', nowPlaying ? 'true' : 'false');
          } catch {
            // ignore
          }
        }}
        customAudioName={customAudioName}
        onUploadCustomAudio={(file) => {
          if (customAudioUrl) URL.revokeObjectURL(customAudioUrl);
          setCustomAudioUrl(URL.createObjectURL(file));
          setCustomAudioName(file.name);
          setMusicWanted(true);
        }}
        onClearCustomAudio={() => {
          if (customAudioUrl) URL.revokeObjectURL(customAudioUrl);
          setCustomAudioUrl(null);
          setCustomAudioName(null);
        }}
      />

      <AchievementsModal
        open={achievementsModalOpen}
        onClose={() => setAchievementsModalOpen(false)}
        total={totalCount}
        streak={streak}
      />

      <ResetModal
        open={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        onResetCurrent={handleResetCurrent}
        onResetAll={handleResetAll}
      />

      {apkRouteOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 modal-container"
          onClick={closeApkRoute}
        >
          <div
            dir="rtl"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl border p-5 text-center space-y-4 shadow-2xl modal-container"
            style={{
              background: 'rgba(8, 12, 28, 0.97)',
              borderColor: 'var(--accent-border)',
              boxShadow: '0 0 36px var(--accent-glow)',
            }}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <h3 className="text-base font-extrabold text-white">تحميل التطبيق (APK / HTML)</h3>
              <button
                type="button"
                onClick={closeApkRoute}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition cursor-pointer"
                aria-label="إغلاق"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              اختر صيغة التحميل المناسبة لك — كلاهما يعمل <strong className="text-white">بدون إنترنت</strong>{' '}
              وبكامل الشخصيات والأشباح والفضاء 3D والموسيقى:
            </p>

            {apkStatus === 'loading' ? (
              <div className="py-3 text-xs font-bold text-slate-300">جاري تجهيز الملفات للتحميل...</div>
            ) : (
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={handleTriggerApkDownload}
                  className="w-full py-3 px-4 rounded-xl font-black text-sm text-white flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
                  style={{
                    background: 'var(--accent-primary)',
                    boxShadow: '0 0 22px var(--accent-glow)',
                  }}
                >
                  <Download size={18} />
                  <span>تنزيل تطبيق أندرويد (APK)</span>
                </button>

                <button
                  type="button"
                  onClick={handleTriggerHtmlDownload}
                  className="w-full py-2.5 px-4 rounded-xl border font-extrabold text-sm text-white flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
                  style={{
                    background: 'var(--accent-surface)',
                    borderColor: 'var(--accent-primary)',
                  }}
                >
                  <Download size={17} />
                  <span>تنزيل ملف HTML كامل أوفلاين</span>
                </button>
              </div>
            )}

            <div className="flex items-center justify-between gap-2 pt-1 text-[11px]">
              <div className="flex items-center gap-3">
                <a
                  href="/tasbih-fatoum.apk"
                  download="tasbih-fatoum.apk"
                  className="font-bold underline"
                  style={{ color: 'var(--accent-secondary)' }}
                >
                  APK مباشر
                </a>
                <a
                  href="/tasbih-fatoum.html"
                  download="tasbih-fatoum.html"
                  className="font-bold underline"
                  style={{ color: 'var(--accent-secondary)' }}
                >
                  HTML مباشر
                </a>
              </div>
              <button
                type="button"
                onClick={closeApkRoute}
                className="px-3 py-1.5 rounded-lg border border-white/15 text-xs font-bold text-slate-200 hover:text-white cursor-pointer"
              >
                فتح السبحة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
