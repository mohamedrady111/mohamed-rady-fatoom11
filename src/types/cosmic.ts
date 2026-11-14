export type CosmicThemeId =
  | 'pink'
  | 'gold'
  | 'cyan'
  | 'green'
  | 'purple'
  | 'rainbow';

export type CameraFocusId = 'cosmos' | 'blackhole' | 'galaxies' | 'nebula';

export type BeadShape = 'shape-circle' | 'shape-gem' | 'shape-crescent' | 'shape-heart';
export type ParticleFxType = 'sparks' | 'fireworks' | 'plasma';

export interface CosmicTheme {
  id: CosmicThemeId;
  label: string;
  shortLabel: string;
  subtitle: string;
  primary: string;
  secondary: string;
  deep: string;
  core: string;
  voidColor: string;
  nebulaTint: string;
  starTint: string;
  isRainbow?: boolean;
}

export const DEFAULT_THEME_ID: CosmicThemeId = 'pink';

export const COSMIC_THEMES: CosmicTheme[] = [
  {
    id: 'gold',
    label: '✨ ذهبي',
    shortLabel: 'ذهبي',
    subtitle: 'وهج السديم الذهبي',
    primary: '#fbbf24',
    secondary: '#fde68a',
    deep: '#4a2b07',
    core: '#fffbeb',
    voidColor: '#070503',
    nebulaTint: '#b45309',
    starTint: '#fef7dc',
  },
  {
    id: 'pink',
    label: '💖 وردي ليزري',
    shortLabel: 'وردي ليزري',
    subtitle: 'سديم الورد الليزري',
    primary: '#ff007f',
    secondary: '#ff85c2',
    deep: '#3f0a2b',
    core: '#fff0f7',
    voidColor: '#06030d',
    nebulaTint: '#9d4edd',
    starTint: '#ffe8f4',
  },
  {
    id: 'cyan',
    label: '⚡ أزرق نيون',
    shortLabel: 'أزرق نيون',
    subtitle: 'أفق البلازما السماوي',
    primary: '#00f3ff',
    secondary: '#7df9ff',
    deep: '#072a40',
    core: '#ecfeff',
    voidColor: '#020712',
    nebulaTint: '#3b82f6',
    starTint: '#e6fcff',
  },
  {
    id: 'green',
    label: '🟢 أخضر ماتريكس',
    shortLabel: 'أخضر ماتريكس',
    subtitle: 'الشفق الزمردي الرقمي',
    primary: '#39ff14',
    secondary: '#9dff8a',
    deep: '#083316',
    core: '#ecfdf5',
    voidColor: '#020a06',
    nebulaTint: '#0d9488',
    starTint: '#e6fff2',
  },
  {
    id: 'purple',
    label: '🔮 بنفسجي سيبر',
    shortLabel: 'بنفسجي سيبر',
    subtitle: 'أعماق السديم البنفسجي',
    primary: '#bf5af2',
    secondary: '#e3b5ff',
    deep: '#290d4a',
    core: '#f5f3ff',
    voidColor: '#050311',
    nebulaTint: '#ec4899',
    starTint: '#f5ebff',
  },
  {
    id: 'rainbow',
    label: '🌈 قوس قزح',
    shortLabel: 'قوس قزح',
    subtitle: 'ألوان قوس قزح متناغمة ومتدرجة معاً',
    primary: '#ff007f',
    secondary: '#00f3ff',
    deep: '#1e1040',
    core: '#ffffff',
    voidColor: '#04050e',
    nebulaTint: '#7c3aed',
    starTint: '#f8fafc',
    isRainbow: true,
  },
];

export interface CameraPreset {
  id: CameraFocusId;
  label: string;
  position: [number, number, number];
  target: [number, number, number];
  description: string;
}

export const CAMERA_PRESETS: CameraPreset[] = [
  {
    id: 'cosmos',
    label: 'الفضاء الكامل',
    position: [0, 7.5, 25],
    target: [0, 0.2, 0],
    description: 'مشهد هادئ للثقب الأسود والمجرة والسديم المتناسق',
  },
  {
    id: 'blackhole',
    label: 'الثقب الأسود',
    position: [2.8, 2.6, 10.5],
    target: [0, 0, 0],
    description: 'أفق الحدث وقرص التراكم البلازمي وتأثير عدسة الجاذبية',
  },
  {
    id: 'galaxies',
    label: 'المجرات',
    position: [-12, 8.5, 21],
    target: [-6, 1.5, -14],
    description: 'أذرع المجرة الحلزونية وتجمعات النجوم البعيدة',
  },
  {
    id: 'nebula',
    label: 'السدم',
    position: [12, 4.2, 18],
    target: [3, 0.5, -8],
    description: 'سحب الغاز المضيئة والغبار الكوني الهادئ',
  },
];

export function getThemeById(id: CosmicThemeId): CosmicTheme {
  return COSMIC_THEMES.find((t) => t.id === id) ?? COSMIC_THEMES[1];
}
