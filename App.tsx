







import React, { useState, useCallback, useMemo, useEffect } from 'react';
import type { ServerConfig } from './types';
import { SERVER_SOFTWARE_OPTIONS } from './constants';
import { translations } from './translations';
import { themes, Theme, defaultTheme } from './themes';
import { organizePlugins } from './services/geminiService';

import TagIcon from './components/icons/TagIcon';
import CubeIcon from './components/icons/CubeIcon';
import ServerIcon from './components/icons/ServerIcon';
import CompassIcon from './components/icons/CompassIcon';
import FileTextIcon from './components/icons/FileTextIcon';
import PlusIcon from './components/icons/PlusIcon';
import XIcon from './components/icons/XIcon';
import CopyIcon from './components/icons/CopyIcon';
import CheckIcon from './components/icons/CheckIcon';
import SparklesIcon from './components/icons/SparklesIcon';
import SpinnerIcon from './components/icons/SpinnerIcon';
import Slider from './components/Slider';
import LanguageSelector from './components/LanguageSelector';
import ThemeSwitcher from './components/ThemeSwitcher';

// FIX: Define a type for the translation object to ensure type safety and fix inference issues.
type TranslationSet = typeof translations['en'];

// Helper component for consistent form fields
const FormField: React.FC<{ id: string; label: string; icon: React.ReactNode; children: React.ReactNode }> = ({ id, label, icon, children }) => (
    <div>
        <label htmlFor={id} className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            {label}
        </label>
        <div className="relative flex items-center">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                {icon}
            </div>
            {children}
        </div>
    </div>
);

const createNewServer = (name: string, type: string): ServerConfig => ({
    id: Date.now().toString(),
    name: name,
    serverType: type,
    version: '1.20.4',
    software: 'Paper',
    playerCount: 20,
    ram: 8,
    cpuCores: 4,
    hostingType: 'VPS (Servidor Privado Virtual)',
    plugins: '',
});


const App: React.FC = () => {
    const [language, setLanguage] = useState<string | null>(null);
    const [theme, setTheme] = useState<Theme>(defaultTheme);
    const [servers, setServers] = useState<ServerConfig[]>([]);
    const [activeServerId, setActiveServerId] = useState<string | null>(null);
    const [copyStatus, setCopyStatus] = useState<'idle' | 'current' | 'all'>('idle');
    
    const [rawPlugins, setRawPlugins] = useState('');
    const [isOrganizing, setIsOrganizing] = useState(false);
    const [organizeError, setOrganizeError] = useState<string | null>(null);
    const [pluginsUpdated, setPluginsUpdated] = useState(false);


    // Load theme from local storage on initial render
    useEffect(() => {
        const savedThemeName = localStorage.getItem('minecraft-config-theme');
        const savedTheme = themes.find(t => t.name === savedThemeName) || defaultTheme;
        setTheme(savedTheme);
    }, []);

    // Apply theme and save to local storage when it changes
    useEffect(() => {
        const root = document.documentElement;
        Object.entries(theme.colors).forEach(([key, value]) => {
            root.style.setProperty(key, value);
        });
        localStorage.setItem('minecraft-config-theme', theme.name);
    }, [theme]);

    const t: TranslationSet = useMemo(() => {
        if (!language) return translations.en; // Default to English before selection
        return translations[language as keyof typeof translations] || translations.en;
    }, [language]);

    useEffect(() => {
        if (language && servers.length === 0) {
            const initialServer = createNewServer('Lobby', t.SERVER_TYPE_OPTIONS[0]);
            setServers([initialServer]);
            setActiveServerId(initialServer.id);
        }
    }, [language, servers.length, t]);

     useEffect(() => {
        if (language) {
            document.documentElement.lang = language;
            document.title = t.pageTitle;
        }
    }, [language, t]);

    const activeServer = useMemo(() => servers.find(s => s.id === activeServerId), [servers, activeServerId]);

    useEffect(() => {
        if (copyStatus !== 'idle') {
            const timer = setTimeout(() => {
                setCopyStatus('idle');
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [copyStatus]);
    
    useEffect(() => {
        if (pluginsUpdated) {
            const timer = setTimeout(() => setPluginsUpdated(false), 1500);
            return () => clearTimeout(timer);
        }
    }, [pluginsUpdated]);

    const handleServerChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const isNumberInput = type === 'number' || type === 'range';
        
        setServers(prevServers => prevServers.map(server => 
            server.id === activeServerId 
                ? { ...server, [name]: isNumberInput ? parseFloat(value) : value }
                : server
        ));
    }, [activeServerId]);

    const addServer = () => {
        const newServer = createNewServer(`${t.newServerName} ${servers.length + 1}`, t.SERVER_TYPE_OPTIONS[1]);
        setServers(prev => [...prev, newServer]);
        setActiveServerId(newServer.id);
    };

    const removeServer = (id: string) => {
        setServers(prev => {
            const remaining = prev.filter(s => s.id !== id);
            if (remaining.length === 0) {
                const newServer = createNewServer('Lobby', t.SERVER_TYPE_OPTIONS[0]);
                setActiveServerId(newServer.id);
                return [newServer];
            }
            if (activeServerId === id) {
                setActiveServerId(remaining[0].id);
            }
            return remaining;
        });
    };

    const formatServerConfig = (server: ServerConfig): string => {
        return `
${t.reportServerTitle}: ${server.name}
- ${t.reportServerType} ${server.serverType}
- ${t.reportVersion} ${server.version}
- ${t.reportSoftware} ${server.software}
- ${t.reportPlayers} ${server.playerCount}
- ${t.reportRam} ${server.ram} GB
- ${t.reportCpu} ${server.cpuCores} ${server.cpuCores === 1 ? t.cpuUnitSingular : t.cpuUnitPlural}
- ${t.reportHosting} ${server.hostingType}
- ${t.reportPlugins}
${server.plugins ? server.plugins.split('\n').map(p => `  - ${p}`).join('\n') : t.reportNoPlugins}
        `.trim();
    };

    const handleCopy = (scope: 'current' | 'all') => {
        if (!activeServer && scope === 'current') return;

        const serversToCopy = scope === 'all' ? servers : [activeServer!];
        if (serversToCopy.length === 0) return;

        const formattedData = serversToCopy.map(formatServerConfig).join('\n\n---\n\n');

        navigator.clipboard.writeText(formattedData).then(() => {
            setCopyStatus(scope);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    };

    const handleOrganizePlugins = async () => {
        if (!rawPlugins.trim() || !activeServerId || !language) return;
        setIsOrganizing(true);
        setOrganizeError(null);
        try {
            const organizedList = await organizePlugins(rawPlugins, language);
            setServers(prevServers => prevServers.map(server => 
                server.id === activeServerId 
                    ? { ...server, plugins: organizedList }
                    : server
            ));
            setRawPlugins(''); // Clear the input after organizing
            setPluginsUpdated(true);
        } catch (error) {
            console.error(error);
            // FIX: The error handling in `handleOrganizePlugins` was not robust enough.
            // If a non-Error object was thrown, it could lead to unexpected behavior.
            // This now safely handles different types of thrown errors.
            if (error instanceof Error) {
                setOrganizeError(error.message);
            } else {
                // FIX: An `unknown` error type cannot be directly assigned to a string state.
                // Convert the unknown error to a string before setting the state to resolve the type mismatch.
                setOrganizeError(String(error));
            }
        } finally {
            setIsOrganizing(false);
        }
    };

    if (!language) {
        return <LanguageSelector onSelect={setLanguage} />;
    }
    
    return (
        <div className="min-h-screen bg-[color:var(--color-bg)] text-[color:var(--color-text-primary)] font-sans flex flex-col">
          {/* Header */}
          <header className="p-4 border-b border-[color:var(--color-border)] flex justify-between items-center bg-[color:var(--color-surface)]/50 backdrop-blur-sm sticky top-0 z-10">
            <div>
                <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[color:var(--color-primary-400)] to-[color:var(--color-primary-300)]">{t.mainTitle}</h1>
                <p className="text-xs text-[color:var(--color-text-muted)]">{t.mainDescription}</p>
            </div>
            <div className="flex items-center gap-4">
              <ThemeSwitcher selectedTheme={theme} onThemeChange={setTheme} />
            </div>
          </header>
        
            {/* Main Content */}
            <main className="flex-1 p-6 md:p-8 overflow-y-auto">
              {activeServer ? (
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Server Management */}
                    <section>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                            <div className="md:col-span-2">
                                <FormField id="server-selector" label={t.serverSelectionLabel} icon={<ServerIcon className="w-5 h-5" />}>
                                    <select
                                        id="server-selector"
                                        value={activeServerId ?? ''}
                                        onChange={(e) => setActiveServerId(e.target.value)}
                                        className="form-input"
                                        aria-label={t.serverSelectionLabel}
                                    >
                                        {servers.map(server => (
                                            <option key={server.id} value={server.id}>{server.name}</option>
                                        ))}
                                    </select>
                                </FormField>
                            </div>
                            <div className="flex items-center gap-2 justify-start">
                                <button onClick={addServer} className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md text-white bg-[color:var(--color-primary-600)] hover:bg-[color:var(--color-primary-700)] transition-colors w-full md:w-auto">
                                    <PlusIcon className="w-4 h-4" />
                                    <span>{t.addServer}</span>
                                </button>
                                <button 
                                    onClick={() => activeServerId && removeServer(activeServerId)} 
                                    disabled={!activeServerId || servers.length <= 1}
                                    className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md text-red-400 hover:bg-red-500/10 disabled:text-gray-500 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors w-full md:w-auto"
                                >
                                    <XIcon className="w-4 h-4" />
                                    <span>{t.removeServer}</span>
                                </button>
                            </div>
                        </div>
                    </section>

                    <div className="border-b border-[color:var(--color-border-light)]"></div>

                    {/* Server Details */}
                    <section>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField id="serverName" label={t.unnamedServer} icon={<TagIcon className="w-5 h-5" />}>
                                <input
                                    type="text"
                                    id="serverName"
                                    name="name"
                                    value={activeServer.name}
                                    onChange={handleServerChange}
                                    className="form-input"
                                />
                            </FormField>
                            <FormField id="serverType" label={t.serverTypeLabel} icon={<CubeIcon className="w-5 h-5" />}>
                                <select
                                    id="serverType"
                                    name="serverType"
                                    value={activeServer.serverType}
                                    onChange={handleServerChange}
                                    className="form-input"
                                >
                                    {t.SERVER_TYPE_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                            </FormField>
                            <FormField id="version" label={t.versionLabel} icon={<FileTextIcon className="w-5 h-5" />}>
                                 <input
                                    type="text"
                                    id="version"
                                    name="version"
                                    value={activeServer.version}
                                    onChange={handleServerChange}
                                    className="form-input"
                                    placeholder={t.versionPlaceholder}
                                />
                            </FormField>
                            <FormField id="software" label={t.softwareLabel} icon={<ServerIcon className="w-5 h-5" />}>
                                <select
                                    id="software"
                                    name="software"
                                    value={activeServer.software}
                                    onChange={handleServerChange}
                                    className="form-input"
                                >
                                    {SERVER_SOFTWARE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                            </FormField>
                            <FormField id="hostingType" label={t.hostingTypeLabel} icon={<CompassIcon className="w-5 h-5" />}>
                                <select
                                    id="hostingType"
                                    name="hostingType"
                                    value={activeServer.hostingType}
                                    onChange={handleServerChange}
                                    className="form-input"
                                >
                                    {t.HOSTING_TYPE_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                            </FormField>
                        </div>
                    </section>
                    
                    {/* Sliders */}
                    <section className="space-y-6">
                        <Slider id="playerCount" label={t.playerCountLabel} value={activeServer.playerCount} onChange={handleServerChange} min={1} max={500} step={1} unit="players" />
                        <Slider id="ram" label={t.ramLabel} value={activeServer.ram} onChange={handleServerChange} min={1} max={64} step={1} unit="GB" />
                        <Slider id="cpuCores" label={t.cpuCoresLabel} value={activeServer.cpuCores} onChange={handleServerChange} min={1} max={16} step={1} unit={activeServer.cpuCores === 1 ? t.cpuUnitSingular : t.cpuUnitPlural} />
                    </section>
                    
                    {/* Plugins */}
                    <section>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="plugins" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{t.pluginsLabel}</label>
                                <textarea
                                    id="plugins"
                                    name="plugins"
                                    value={activeServer.plugins}
                                    onChange={handleServerChange}
                                    rows={10}
                                    className={`form-input transition-all duration-500 ${pluginsUpdated ? 'shadow-[0_0_15px_var(--color-primary-700)] ring-1 ring-[color:var(--color-primary-500)]' : ''}`}
                                    placeholder={t.pluginsPlaceholder}
                                />
                            </div>
                            <div>
                                 <label htmlFor="rawPlugins" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{t.organizePluginsTitle}</label>
                                 <textarea
                                    id="rawPlugins"
                                    value={rawPlugins}
                                    onChange={(e) => setRawPlugins(e.target.value)}
                                    rows={10}
                                    className="form-input"
                                    placeholder={t.organizePluginsPlaceholder}
                                    disabled={isOrganizing}
                                />
                                <div className="mt-3 text-right">
                                    {organizeError && <p className="text-xs text-red-400 text-left mb-2">{organizeError}</p>}
                                    <button onClick={handleOrganizePlugins} disabled={!rawPlugins.trim() || isOrganizing} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md text-white bg-[color:var(--color-primary-600)] hover:bg-[color:var(--color-primary-700)] disabled:bg-gray-600 disabled:cursor-not-allowed">
                                        {isOrganizing ? <SpinnerIcon className="w-4 h-4 animate-spin" /> : <SparklesIcon className="w-4 h-4" />}
                                        {isOrganizing ? t.organizing : t.organizeButton}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                    <p className="text-[color:var(--color-text-muted)]">{t.noServers}</p>
                </div>
              )}
            </main>
            
          {/* Footer/Actions */}
            <footer className="p-4 border-t border-[color:var(--color-border)] bg-[color:var(--color-surface)]/50 backdrop-blur-sm flex flex-wrap justify-between items-center gap-4">
                <p className="text-xs text-[color:var(--color-text-muted)]">
                    Copyright © 2025 flumalo. All Rights Reserved.
                </p>
                <div className="flex items-center gap-4">
                    <button
                    onClick={() => handleCopy('current')}
                    disabled={!activeServer}
                    className={`flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                        copyStatus === 'current'
                        ? 'border border-[color:var(--color-primary-500)] text-[color:var(--color-primary-400)] bg-[color:var(--color-primary-900)]/30'
                        : 'border border-[color:var(--color-border)] text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface)] hover:text-[color:var(--color-text-primary)]'
                    }`}
                    >
                    {copyStatus === 'current' ? <CheckIcon className="w-4 h-4 text-[color:var(--color-primary-400)]" /> : <CopyIcon className="w-4 h-4" />}
                    {copyStatus === 'current' ? t.copySuccessCurrent : t.copyCurrent}
                    </button>
                    <button
                    onClick={() => handleCopy('all')}
                    disabled={servers.length === 0}
                    className={`flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                        copyStatus === 'all'
                        ? 'border border-[color:var(--color-primary-500)] text-[color:var(--color-primary-400)] bg-[color:var(--color-primary-900)]/30'
                        : 'border border-[color:var(--color-border)] text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-surface)] hover:text-[color:var(--color-text-primary)]'
                    }`}
                    >
                    {copyStatus === 'all' ? <CheckIcon className="w-4 h-4 text-[color:var(--color-primary-400)]" /> : <CopyIcon className="w-4 h-4" />}
                    {copyStatus === 'all' ? t.copySuccessAll : t.copyAll}
                    </button>
                </div>
            </footer>
        
        </div>
    );
};

export default App;