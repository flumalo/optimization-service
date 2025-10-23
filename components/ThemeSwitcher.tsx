import React, { useState, useRef, useEffect } from 'react';
import { themes, Theme } from '../themes';
import PaletteIcon from './icons/PaletteIcon';
import CheckIcon from './icons/CheckIcon';

interface ThemeSwitcherProps {
  selectedTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ selectedTheme, onThemeChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleThemeSelect = (theme: Theme) => {
    onThemeChange(theme);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="form-input !w-auto !py-2 !pl-3 !pr-3 bg-[color:var(--color-surface)]/50 border-[color:var(--color-border-light)]/50 rounded-md focus:border-[color:var(--color-primary-500)]"
        aria-label="Select Theme"
      >
        <PaletteIcon className="w-5 h-5 text-gray-400" />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-[color:var(--color-surface)] border border-[color:var(--color-border-light)] rounded-lg shadow-xl z-20 backdrop-blur-sm">
          <ul className="py-1">
            {themes.map((theme) => (
              <li key={theme.name}>
                <button
                  onClick={() => handleThemeSelect(theme)}
                  className="w-full text-left px-4 py-2 text-sm text-[color:var(--color-text-primary)] hover:bg-[color:var(--color-primary-900)]/60 flex items-center justify-between"
                >
                  <span className="flex items-center gap-3">
                    <span
                      className="w-4 h-4 rounded-full border border-white/20"
                      style={{ backgroundColor: theme.colors['--color-primary-500'] }}
                    ></span>
                    {theme.name}
                  </span>
                  {selectedTheme.name === theme.name && <CheckIcon className="w-4 h-4 text-[color:var(--color-primary-400)]" />}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;
