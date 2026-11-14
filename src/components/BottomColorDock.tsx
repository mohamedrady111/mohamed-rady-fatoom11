import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Compass,
  Gauge,
  Palette,
  Pause,
  Play,
  Sparkles,
} from 'lucide-react';
import {
  CAMERA_PRESETS,
  COSMIC_THEMES,
  type CameraFocusId,
  type CosmicTheme,
  type CosmicThemeId,
} from '../types/cosmic';

interface BottomColorDockProps {
  activeTheme: CosmicTheme;
  onSelectTheme: (id: CosmicThemeId) => void;
  cameraFocus: CameraFocusId;
  onSelectCamera: (id: CameraFocusId) => void;
  autoRotate: boolean;
  onToggleAutoRotate: () => void;
  motionSpeed: number;
  onChangeMotionSpeed: (val: number) => void;
  glowIntensity: number;
  onChangeGlowIntensity: (val: number) => void;
}

export const BottomColorDock: React.FC<BottomColorDockProps> = ({
  activeTheme,
  onSelectTheme,
  cameraFocus,
  onSelectCamera,
  autoRotate,
  onToggleAutoRotate,
  motionSpeed,
  onChangeMotionSpeed,
  glowIntensity,
  onChangeGlowIntensity,
}) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div
      dir="rtl"
      className="fixed bottom-3 left-1/2 -translate-x-1/2 z-30 w-[calc(100%-1rem)] max-w-xl"
    >
      <div
        className="rounded-2xl border p-2.5 shadow-2xl transition-all duration-300"
        style={{
          background: 'rgba(6, 9, 22, 0.86)',
          borderColor: 'var(--accent-border)',
          boxShadow: '0 10px 35px rgba(0,0,0,0.75), 0 0 28px var(--accent-glow)',
        }}
      >
        <div className="flex items-center justify-between gap-2 px-1 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="w-3 h-3 rounded-full shrink-0"
              style={{
                background: activeTheme.isRainbow
                  ? 'linear-gradient(135deg, #fbbf24, #ff007f, #00f3ff, #39ff14, #bf5af2)'
                  : 'var(--accent-primary)',
                boxShadow: '0 0 12px var(--accent-glow)',
              }}
            />
            <span className="text-xs font-extrabold text-white truncate">
              تحكم الفضاء 3D • {activeTheme.label}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={onToggleAutoRotate}
              className="px-2.5 py-1 rounded-lg text-[11px] font-bold border flex items-center gap-1 transition cursor-pointer"
              style={{
                borderColor: 'var(--accent-border)',
                background: autoRotate ? 'var(--accent-surface)' : 'rgba(255,255,255,0.05)',
                color: '#fff',
              }}
            >
              {autoRotate ? <Pause size={12} /> : <Play size={12} />}
              <span>{autoRotate ? 'دوران يعمل' : 'دوران متوقف'}</span>
            </button>

            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="p-1.5 rounded-lg border text-slate-200 hover:text-white transition cursor-pointer"
              style={{
                borderColor: 'rgba(255,255,255,0.16)',
                background: 'rgba(255,255,255,0.06)',
              }}
              aria-label="طي أو توسيع لوحة الفضاء"
            >
              {expanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
          {COSMIC_THEMES.map((t) => {
            const isActive = activeTheme.id === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onSelectTheme(t.id)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[11px] font-bold whitespace-nowrap shrink-0 transition-transform active:scale-95 cursor-pointer"
                style={{
                  borderColor: isActive ? '#ffffff' : 'rgba(255,255,255,0.14)',
                  background: isActive ? 'var(--accent-surface)' : 'rgba(255,255,255,0.04)',
                  color: isActive ? '#ffffff' : '#cbd5e1',
                  boxShadow: isActive ? '0 0 14px var(--accent-glow)' : 'none',
                }}
              >
                <span
                  className={`w-3.5 h-3.5 rounded-full border border-white/60 ${
                    t.isRainbow ? 'rainbow-swatch-anim' : ''
                  }`}
                  style={t.isRainbow ? undefined : { background: t.primary }}
                />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {expanded && (
          <div className="mt-2 pt-2 border-t border-white/10 space-y-2">
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              <Compass size={13} className="text-slate-300 shrink-0 ml-1" />
              {CAMERA_PRESETS.map((preset) => {
                const isSelected = cameraFocus === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => onSelectCamera(preset.id)}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-bold border whitespace-nowrap shrink-0 transition cursor-pointer"
                    style={{
                      borderColor: isSelected ? 'var(--accent-primary)' : 'rgba(255,255,255,0.12)',
                      background: isSelected ? 'var(--accent-surface)' : 'rgba(255,255,255,0.04)',
                      color: isSelected ? '#fff' : '#cbd5e1',
                    }}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-0.5">
              <label className="flex items-center gap-2 text-[11px] font-bold text-slate-200">
                <Gauge size={13} className="shrink-0" style={{ color: 'var(--accent-secondary)' }} />
                <span className="shrink-0">السرعة</span>
                <input
                  type="range"
                  min={0.2}
                  max={2.4}
                  step={0.1}
                  value={motionSpeed}
                  onChange={(e) => onChangeMotionSpeed(parseFloat(e.target.value))}
                  className="cosmic-slider w-full"
                />
              </label>

              <label className="flex items-center gap-2 text-[11px] font-bold text-slate-200">
                <Sparkles size={13} className="shrink-0" style={{ color: 'var(--accent-secondary)' }} />
                <span className="shrink-0">التوهج</span>
                <input
                  type="range"
                  min={0.5}
                  max={1.8}
                  step={0.05}
                  value={glowIntensity}
                  onChange={(e) => onChangeGlowIntensity(parseFloat(e.target.value))}
                  className="cosmic-slider w-full"
                />
              </label>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 px-0.5">
              <span className="flex items-center gap-1">
                <Palette size={11} />
                <span>اسحب لتدوير الكون • كبّر أو صغّر باللمس</span>
              </span>
              <span>{activeTheme.subtitle}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
