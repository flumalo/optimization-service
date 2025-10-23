import React from 'react';
import { languageMap } from '../translations';

interface LanguageSelectorProps {
  onSelect: (language: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onSelect }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg mx-auto text-center">
        <header className="mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-500 tracking-tight">
            Select Language
          </h1>
          <p className="mt-3 text-lg text-gray-400">
            Choose your preferred language to continue
          </p>
        </header>

        <main className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl shadow-2xl shadow-emerald-900/20 p-6 sm:p-8">
            <div className="absolute -top-px left-10 right-10 h-px bg-gradient-to-r from-emerald-500/0 via-emerald-500/70 to-emerald-500/0"></div>
            <div className="absolute -bottom-px left-10 right-10 h-px bg-gradient-to-r from-emerald-500/0 via-emerald-500/70 to-emerald-500/0"></div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto p-1">
            {Object.entries(languageMap).map(([code, name]) => (
              <button
                key={code}
                onClick={() => onSelect(code)}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-600 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-800 hover:border-emerald-500 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-emerald-500"
              >
                {name}
              </button>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default LanguageSelector;
