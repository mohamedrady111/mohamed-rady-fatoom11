import React, { useState } from 'react';
import {
  Award,
  Check,
  Music,
  Plus,
  RotateCcw,
  Trash2,
  Upload,
  Volume2,
  X,
} from 'lucide-react';
import { AMBIENT_PRESETS, type AmbientPresetId } from '../hooks/useTasbihAudio';

interface ModalShellProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const ModalShell: React.FC<ModalShellProps> = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75"
      onClick={onClose}
    >
      <div
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl border p-4 text-right shadow-2xl max-h-[88vh] overflow-y-auto"
        style={{
          background: 'rgba(8, 12, 28, 0.96)',
          borderColor: 'var(--accent-border)',
          boxShadow: '0 0 36px var(--accent-glow)',
        }}
      >
        <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-white/10">
          <h3 className="text-base font-extrabold text-white">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition cursor-pointer"
            aria-label="إغلاق"
          >
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

interface AddDhikrModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (text: string, target: number) => void;
}

export const AddDhikrModal: React.FC<AddDhikrModalProps> = ({ open, onClose, onAdd }) => {
  const [text, setText] = useState('');
  const [target, setTarget] = useState('33');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = text.trim();
    if (!cleaned) return;
    const parsed = Math.max(1, Math.min(99999, parseInt(target, 10) || 33));
    onAdd(cleaned, parsed);
    setText('');
    setTarget('33');
    onClose();
  };

  return (
    <ModalShell open={open} onClose={onClose} title="أضف ذكراً جديداً">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">نص الذكر</label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="مثال: سُبْحَانَ اللَّهِ وَبِحَمْدِهِ"
            className="w-full rounded-xl bg-black/50 border border-white/15 px-3 py-2.5 text-sm text-white focus:outline-none"
            style={{ borderColor: text ? 'var(--accent-primary)' : undefined }}
            autoFocus
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">العدد المستهدف</label>
          <div className="flex items-center gap-2 mb-2">
            {[33, 99, 100, 1000].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setTarget(String(num))}
                className="px-2.5 py-1 rounded-lg text-xs font-bold border transition cursor-pointer"
                style={{
                  borderColor:
                    target === String(num) ? 'var(--accent-primary)' : 'rgba(255,255,255,0.14)',
                  background:
                    target === String(num) ? 'var(--accent-surface)' : 'rgba(255,255,255,0.04)',
                  color: '#fff',
                }}
              >
                {num}
              </button>
            ))}
          </div>
          <input
            type="number"
            min={1}
            max={99999}
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="w-full rounded-xl bg-black/50 border border-white/15 px-3 py-2 text-sm text-white font-mono-num focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2.5 rounded-xl font-extrabold text-sm text-white flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
          style={{
            background: 'var(--accent-primary)',
            boxShadow: '0 0 20px var(--accent-glow)',
          }}
        >
          <Plus size={16} />
          <span>حفظ الذكر</span>
        </button>
      </form>
    </ModalShell>
  );
};

interface MusicSettingsModalProps {
  open: boolean;
  onClose: () => void;
  preset: AmbientPresetId;
  onSelectPreset: (id: AmbientPresetId) => void;
  volume: number;
  onChangeVolume: (val: number) => void;
  playing: boolean;
  onTogglePlay: () => void;
  customAudioName: string | null;
  onUploadCustomAudio: (file: File) => void;
  onClearCustomAudio: () => void;
}

export const MusicSettingsModal: React.FC<MusicSettingsModalProps> = ({
  open,
  onClose,
  preset,
  onSelectPreset,
  volume,
  onChangeVolume,
  playing,
  onTogglePlay,
  customAudioName,
  onUploadCustomAudio,
  onClearCustomAudio,
}) => {
  return (
    <ModalShell open={open} onClose={onClose} title="موسيقى الخلفية والسكينة 🎵">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-2">
            <Music size={16} style={{ color: 'var(--accent-secondary)' }} />
            <span className="text-xs font-bold text-slate-200">
              {playing ? 'التشغيل مفعّل الآن' : 'الصوت متوقف'}
            </span>
          </div>
          <button
            type="button"
            onClick={onTogglePlay}
            className="px-3 py-1.5 rounded-lg text-xs font-extrabold text-white cursor-pointer"
            style={{ background: 'var(--accent-primary)' }}
          >
            {playing ? 'إيقاف' : 'تشغيل'}
          </button>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-1">
            <span className="flex items-center gap-1.5">
              <Volume2 size={14} />
              <span>مستوى الصوت</span>
            </span>
            <span className="font-mono-num">{Math.round(volume * 100)}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={(e) => onChangeVolume(parseFloat(e.target.value))}
            className="cosmic-slider w-full"
          />
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-bold text-slate-300">اختيار نغمة الخلفية</p>
          {AMBIENT_PRESETS.map((item) => {
            const selected = !customAudioName && preset === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onClearCustomAudio();
                  onSelectPreset(item.id);
                }}
                className="w-full text-right px-3 py-2 rounded-xl border flex items-center justify-between gap-2 transition cursor-pointer"
                style={{
                  borderColor: selected ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)',
                  background: selected ? 'var(--accent-surface)' : 'rgba(255,255,255,0.03)',
                }}
              >
                <div>
                  <div className="text-xs font-extrabold text-white">{item.label}</div>
                  <div className="text-[11px] text-slate-400">{item.desc}</div>
                </div>
                {selected && <Check size={15} style={{ color: 'var(--accent-secondary)' }} />}
              </button>
            );
          })}
        </div>

        <div className="pt-2 border-t border-white/10">
          <p className="text-xs font-bold text-slate-300 mb-2">أو رفع مقطع صوتي من جهازك</p>
          {customAudioName ? (
            <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-white/5 border border-white/15">
              <span className="text-xs font-bold text-white truncate">{customAudioName}</span>
              <button
                type="button"
                onClick={onClearCustomAudio}
                className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/15 cursor-pointer"
                title="حذف الملف المخصص"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ) : (
            <label className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-dashed border-white/25 hover:border-white/50 bg-white/5 text-xs font-bold text-slate-200 cursor-pointer transition">
              <Upload size={14} />
              <span>اختيار ملف صوتي (MP3 / WAV / M4A)</span>
              <input
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onUploadCustomAudio(file);
                }}
              />
            </label>
          )}
        </div>
      </div>
    </ModalShell>
  );
};

interface AchievementsModalProps {
  open: boolean;
  onClose: () => void;
  total: number;
  streak: number;
}

const MILESTONES = [
  { target: 50, title: 'بداية النور ✨', desc: 'أتممتِ ٥٠ تسبيحة' },
  { target: 100, title: 'مئوية السكينة 🌙', desc: 'أتممتِ ١٠٠ تسبيحة' },
  { target: 500, title: 'نبض الكون 🪐', desc: 'أتممتِ ٥٠٠ تسبيحة' },
  { target: 1000, title: 'نجمة المجرة 🌌', desc: 'أتممتِ ١٠٠٠ تسبيحة' },
  { target: 5000, title: 'أفق الحدث الذهبي 👑', desc: 'أتممتِ ٥٠٠٠ تسبيحة' },
];

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  open,
  onClose,
  total,
  streak,
}) => {
  return (
    <ModalShell open={open} onClose={onClose} title="الإنجازات والأوسمة 🏆">
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
            <div className="text-[11px] text-slate-400">إجمالي التسبيحات</div>
            <div className="text-lg font-extrabold font-mono-num text-white">{total}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
            <div className="text-[11px] text-slate-400">أيام الاستمرار</div>
            <div className="text-lg font-extrabold font-mono-num text-white">{streak} 🔥</div>
          </div>
        </div>

        <div className="space-y-2">
          {MILESTONES.map((m) => {
            const unlocked = total >= m.target;
            const pct = Math.min(100, Math.round((total / m.target) * 100));
            return (
              <div
                key={m.target}
                className="p-3 rounded-xl border transition"
                style={{
                  borderColor: unlocked ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)',
                  background: unlocked ? 'var(--accent-surface)' : 'rgba(255,255,255,0.03)',
                }}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <Award
                      size={16}
                      style={{ color: unlocked ? 'var(--accent-secondary)' : '#64748b' }}
                    />
                    <span className="text-xs font-extrabold text-white">{m.title}</span>
                  </div>
                  <span className="text-[11px] font-mono-num font-bold text-slate-300">
                    {unlocked ? 'مفتوح ✓' : `${pct}%`}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mb-1.5">{m.desc}</p>
                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${pct}%`,
                      background: 'var(--accent-primary)',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ModalShell>
  );
};

interface ResetModalProps {
  open: boolean;
  onClose: () => void;
  onResetCurrent: () => void;
  onResetAll: () => void;
}

export const ResetModal: React.FC<ResetModalProps> = ({
  open,
  onClose,
  onResetCurrent,
  onResetAll,
}) => {
  return (
    <ModalShell open={open} onClose={onClose} title="تصفير العداد 🔄">
      <div className="space-y-2.5">
        <p className="text-xs text-slate-300 leading-relaxed">
          اختر هل تريد تصفير عداد الذكر الحالي فقط أم تصفير جميع العدادات وإعادة الضبط بالكامل.
        </p>
        <button
          type="button"
          onClick={() => {
            onResetCurrent();
            onClose();
          }}
          className="w-full py-2.5 rounded-xl font-extrabold text-xs text-white border flex items-center justify-center gap-2 cursor-pointer"
          style={{
            borderColor: 'var(--accent-border)',
            background: 'var(--accent-surface)',
          }}
        >
          <RotateCcw size={14} />
          <span>تصفير عداد الذكر الحالي فقط</span>
        </button>

        <button
          type="button"
          onClick={() => {
            onResetAll();
            onClose();
          }}
          className="w-full py-2.5 rounded-xl font-extrabold text-xs text-rose-200 border border-rose-500/40 bg-rose-500/15 hover:bg-rose-500/25 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Trash2 size={14} />
          <span>تصفير كل العدادات بالكامل</span>
        </button>
      </div>
    </ModalShell>
  );
};
