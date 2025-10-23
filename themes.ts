export interface Theme {
  name: string;
  colors: {
    '--color-primary-300': string;
    '--color-primary-400': string;
    '--color-primary-500': string;
    '--color-primary-600': string;
    '--color-primary-700': string;
    '--color-primary-900': string;
    '--color-border-focus': string;
    '--color-bg'?: string;
    '--color-surface'?: string;
    '--color-text-primary'?: string;
    '--color-text-secondary'?: string;
    '--color-text-muted'?: string;
    '--color-border'?: string;
    '--color-border-light'?: string;
  };
}

const baseColors = {
    '--color-bg': '#0D1117',
    '--color-surface': '#161b22',
    '--color-text-primary': '#d1d5db',
    '--color-text-secondary': '#9ca3af',
    '--color-text-muted': '#6b7280',
    '--color-border': '#4b5563',
    '--color-border-light': '#374151',
};

export const emeraldTheme: Theme = {
  name: 'Emerald',
  colors: {
    ...baseColors,
    '--color-primary-300': '#6ee7b7',
    '--color-primary-400': '#34d399',
    '--color-primary-500': '#10b981',
    '--color-primary-600': '#059669',
    '--color-primary-700': '#047857',
    '--color-primary-900': '#064e3b',
    '--color-border-focus': '#10b981',
  },
};

export const sapphireTheme: Theme = {
  name: 'Sapphire',
  colors: {
    ...baseColors,
    '--color-primary-300': '#93c5fd', // blue-300
    '--color-primary-400': '#60a5fa', // blue-400
    '--color-primary-500': '#3b82f6', // blue-500
    '--color-primary-600': '#2563eb', // blue-600
    '--color-primary-700': '#1d4ed8', // blue-700
    '--color-primary-900': '#1e3a8a', // blue-900
    '--color-border-focus': '#3b82f6',
  },
};

export const rubyTheme: Theme = {
  name: 'Ruby',
  colors: {
    ...baseColors,
    '--color-primary-300': '#fca5a5', // red-300
    '--color-primary-400': '#f87171', // red-400
    '--color-primary-500': '#ef4444', // red-500
    '--color-primary-600': '#dc2626', // red-600
    '--color-primary-700': '#b91c1c', // red-700
    '--color-primary-900': '#7f1d1d', // red-900
    '--color-border-focus': '#ef4444',
  },
};

export const amethystTheme: Theme = {
  name: 'Amethyst',
  colors: {
    ...baseColors,
    '--color-primary-300': '#d8b4fe', // purple-300
    '--color-primary-400': '#c084fc', // purple-400
    '--color-primary-500': '#a855f7', // purple-500
    '--color-primary-600': '#9333ea', // purple-600
    '--color-primary-700': '#7e22ce', // purple-700
    '--color-primary-900': '#581c87', // purple-900
    '--color-border-focus': '#a855f7',
  },
};

export const goldTheme: Theme = {
  name: 'Gold',
  colors: {
    ...baseColors,
    '--color-primary-300': '#fcd34d', // amber-300
    '--color-primary-400': '#fbbf24', // amber-400
    '--color-primary-500': '#f59e0b', // amber-500
    '--color-primary-600': '#d97706', // amber-600
    '--color-primary-700': '#b45309', // amber-700
    '--color-primary-900': '#78350f', // amber-900
    '--color-border-focus': '#f59e0b',
  },
};


export const themes: Theme[] = [emeraldTheme, sapphireTheme, rubyTheme, amethystTheme, goldTheme];
export const defaultTheme = emeraldTheme;
