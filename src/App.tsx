import React, { useEffect, useMemo, useState } from 'react';
import {
  Moon,
  Copy,
  Check,
  Server,
  Package,
  HardDrive,
  Download,
  ExternalLink,
  X,
  Terminal,
  CircleCheck,
  BookOpen,
  Boxes,
  ChevronRight,
  Search,
  RefreshCw,
  Github,
  Sparkles,
  ArrowUpRight,
  Filter,
} from 'lucide-react';

type PackageInfo = {
  name: string;
  version: string;
  file: string;
  architecture?: string;
  description?: string;
  category?: string;
  license?: string;
  size?: string;
  dependencies?: string[];
};

type RepositoryIndex = {
  name?: string;
  version?: string;
  packages?: Record<string, PackageInfo>;
};

type Menu = 'packages' | 'info' | null;

const FALLBACK_PACKAGES: PackageInfo[] = [
  {
    name: 'hello',
    version: '1.0.0',
    file: 'packages/hello-1.0.0.rpm',
    architecture: 'x86_64',
    description: 'An example package for testing Lunareth OS package management.',
    category: 'System',
    license: 'MIT',
    size: '4 KB',
  },
];

export default function App() {
  const [copied, setCopied] = useState(false);
  const [copiedInstall, setCopiedInstall] = useState(false);
  const [activeMenu, setActiveMenu] = useState<Menu>(null);
  const [selectedPackage, setSelectedPackage] = useState<PackageInfo | null>(null);
  const [repository, setRepository] = useState<RepositoryIndex | null>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const repoUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/index.json`
      : 'https://lunareth-repo.pages.dev/index.json';

  const baseUrl =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'https://lunareth-repo.pages.dev';

  const loadRepository = async () => {
    setRefreshing(true);

    try {
      const response = await fetch(`/index.json?cache=${Date.now()}`);

      if (!response.ok) {
        throw new Error('Failed to load repository index');
      }

      const data: RepositoryIndex = await response.json();
      setRepository(data);
      setLastUpdated(new Date());
    } catch {
      setRepository(null);
    } finally {
      window.setTimeout(() => setRefreshing(false), 450);
    }
  };

  useEffect(() => {
    loadRepository();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveMenu(null);
        setSelectedPackage(null);
      }

      if (
        event.key === '/' &&
        !['INPUT', 'TEXTAREA'].includes(
          (event.target as HTMLElement | null)?.tagName || ''
        )
      ) {
        event.preventDefault();
        document.getElementById('package-search')?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const packages: PackageInfo[] = useMemo(
    () =>
      repository?.packages
        ? Object.entries(repository.packages).map(([name, pkg]) => ({
            ...pkg,
            name: pkg.name || name,
          }))
        : FALLBACK_PACKAGES,
    [repository]
  );

  const categories = useMemo(() => {
    const values = packages
      .map((pkg) => pkg.category)
      .filter(Boolean) as string[];

    return ['All', ...Array.from(new Set(values)).sort()];
  }, [packages]);

  const filteredPackages = useMemo(() => {
    const query = search.trim().toLowerCase();

    return packages.filter((pkg) => {
      const matchesSearch =
        !query ||
        pkg.name.toLowerCase().includes(query) ||
        pkg.description?.toLowerCase().includes(query) ||
        pkg.category?.toLowerCase().includes(query);

      const matchesCategory =
        category === 'All' || pkg.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [packages, search, category]);

  const featuredPackage = packages[0];

  const copyText = async (
    value: string,
    type: 'repo' | 'install'
  ) => {
    try {
      await navigator.clipboard.writeText(value);

      if (type === 'repo') {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      } else {
        setCopiedInstall(true);
        window.setTimeout(() => setCopiedInstall(false), 2000);
      }
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const openPackageBrowser = () => {
    setActiveMenu('packages');
    setTimeout(() => {
      document.getElementById('package-search')?.focus();
    }, 100);
  };

  const openRepositoryInfo = () => {
    setActiveMenu('info');
  };

  return (
    <div className="min-h-screen bg-[#0d0f14] text-stone-300 font-sans antialiased flex flex-col selection:bg-[#9b7ede]/30 selection:text-white">
      <style>{`
        @keyframes lunareth-fade-up {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes lunareth-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes lunareth-scale-in {
          from { opacity: 0; transform: scale(.97) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        @keyframes lunareth-float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-3px) rotate(-4deg); }
        }

        @keyframes lunareth-pulse {
          0%, 100% { opacity: .45; transform: scale(.9); }
          50% { opacity: 1; transform: scale(1.15); }
        }

        @keyframes lunareth-shimmer {
          0% { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }

        .lunareth-fade-up { animation: lunareth-fade-up .55s cubic-bezier(.22,1,.36,1) both; }
        .lunareth-fade-in { animation: lunareth-fade-in .4s ease both; }
        .lunareth-scale-in { animation: lunareth-scale-in .35s cubic-bezier(.22,1,.36,1) both; }
        .lunareth-float { animation: lunareth-float 3.5s ease-in-out infinite; }
        .lunareth-pulse { animation: lunareth-pulse 2s ease-in-out infinite; }

        .lunareth-delay-1 { animation-delay: 70ms; }
        .lunareth-delay-2 { animation-delay: 140ms; }
        .lunareth-delay-3 { animation-delay: 210ms; }
        .lunareth-delay-4 { animation-delay: 280ms; }
        .lunareth-delay-5 { animation-delay: 350ms; }

        .lunareth-shimmer {
          background: linear-gradient(
            90deg,
            rgba(255,255,255,.03),
            rgba(184,169,252,.08),
            rgba(255,255,255,.03)
          );
          background-size: 800px 100%;
          animation: lunareth-shimmer 2.4s linear infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>

      <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-[#0d0f14]/85 backdrop-blur-xl lunareth-fade-in">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-[#9b7ede]/50 group-hover:scale-105 transition-all duration-200">
              <Moon
                className="w-5 h-5 text-[#b8a9fc] lunareth-float"
                strokeWidth={1.8}
              />
            </div>

            <div className="text-left">
              <div className="font-semibold text-white tracking-wide text-sm">
                Lunareth
              </div>
              <div className="text-[10px] text-stone-500 font-mono">
                repository
              </div>
            </div>
          </button>

          <div className="hidden sm:flex items-center gap-1.5">
            <button
              onClick={openPackageBrowser}
              className="px-3.5 py-2 rounded-xl text-xs font-medium text-stone-300 hover:text-white hover:bg-zinc-900 hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2 cursor-pointer"
            >
              <Boxes className="w-3.5 h-3.5" />
              Packages
            </button>

            <button
              onClick={openRepositoryInfo}
              className="px-3.5 py-2 rounded-xl text-xs font-medium text-stone-300 hover:text-white hover:bg-zinc-900 hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Repository
            </button>

            <a
              href="https://github.com/meskylines17"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-xl text-xs font-medium text-stone-300 hover:text-white hover:bg-zinc-900 hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
            >
              <Github className="w-3.5 h-3.5" />
              GitHub
            </a>

            <div className="ml-2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 lunareth-pulse" />
              Online
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-5xl mx-auto px-5 sm:px-6 py-16 w-full">
        <section className="text-center max-w-3xl mx-auto lunareth-fade-up">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 text-xs font-mono text-[#b8a9fc] mb-6 lunareth-fade-up lunareth-delay-1">
            <Moon className="w-3.5 h-3.5" />
            Lunareth OS
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold text-white tracking-tight leading-tight lunareth-fade-up lunareth-delay-2">
            Lunareth Repository
          </h1>

          <p className="text-base sm:text-lg text-stone-400 max-w-xl mx-auto mt-5 leading-relaxed lunareth-fade-up lunareth-delay-3">
            A simple package repository for Lunareth OS.
            <br className="hidden sm:block" />
            Powered by <span className="text-[#b8a9fc]">luna</span>.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mt-8 lunareth-fade-up lunareth-delay-4">
            <button
              onClick={openPackageBrowser}
              className="px-5 py-2.5 rounded-xl bg-[#9b7ede] hover:bg-[#a88de5] hover:-translate-y-0.5 active:scale-[.98] text-zinc-950 font-semibold text-sm transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-[0_10px_35px_rgba(155,126,222,.12)]"
            >
              <Package className="w-4 h-4" />
              Browse Packages
            </button>

            <button
              onClick={openRepositoryInfo}
              className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 hover:-translate-y-0.5 text-white font-medium text-sm border border-zinc-800 transition-all duration-200 flex items-center gap-2 cursor-pointer"
            >
              <Server className="w-4 h-4" />
              Repository Info
            </button>
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-16">
          <InfoCard
            icon={<Boxes className="w-4 h-4" />}
            label="Packages"
            value={String(packages.length)}
            delay="lunareth-delay-1"
          />

          <InfoCard
            icon={<HardDrive className="w-4 h-4" />}
            label="Architecture"
            value="x86_64"
            delay="lunareth-delay-2"
          />

          <InfoCard
            icon={<CircleCheck className="w-4 h-4 text-emerald-400" />}
            label="Status"
            value="Online"
            valueClass="text-emerald-400"
            delay="lunareth-delay-3"
          />
        </section>

        <section className="mt-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-colors lunareth-fade-up lunareth-delay-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="text-xs text-stone-500 mb-2">
                Repository index
              </div>

              <code className="block text-xs sm:text-sm text-[#9b7ede] font-mono truncate">
                {repoUrl}
              </code>

              {lastUpdated && (
                <div className="text-[10px] text-stone-600 mt-2">
                  Updated {lastUpdated.toLocaleTimeString()}
                </div>
              )}
            </div>

            <div className="flex gap-2 shrink-0">
              <button
                onClick={loadRepository}
                className="w-10 h-10 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white flex items-center justify-center transition-all duration-200 cursor-pointer"
                title="Refresh repository"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 transition-transform ${
                    refreshing ? 'animate-spin' : ''
                  }`}
                />
              </button>

              <button
                onClick={() => copyText(repoUrl, 'repo')}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 hover:-translate-y-0.5 border border-zinc-700 text-xs text-white font-medium transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                {copied ? 'Copied!' : 'Copy URL'}
              </button>
            </div>
          </div>
        </section>

        {featuredPackage && (
          <section className="mt-16">
            <div className="flex items-end justify-between mb-4">
              <div>
                <div className="text-xs text-[#9b7ede] font-mono uppercase tracking-wider">
                  Repository
                </div>
                <h2 className="text-xl font-semibold text-white mt-1">
                  Featured package
                </h2>
              </div>

              <button
                onClick={openPackageBrowser}
                className="hidden sm:flex items-center gap-1 text-xs text-stone-400 hover:text-white transition-colors cursor-pointer"
              >
                View all
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <PackageCard
              pkg={featuredPackage}
              baseUrl={baseUrl}
              onDetails={() => setSelectedPackage(featuredPackage)}
            />
          </section>
        )}

        <section className="mt-16">
          <div className="mb-4">
            <div className="text-xs text-[#9b7ede] font-mono uppercase tracking-wider">
              Package manager
            </div>

            <h2 className="text-xl font-semibold text-white mt-1">
              Install with luna
            </h2>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden lunareth-fade-up">
            <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-stone-500" />
                <span className="text-xs text-stone-500 font-mono">
                  terminal
                </span>
              </div>

              <button
                onClick={() =>
                  copyText(
                    `luna update\nluna install ${featuredPackage?.name || 'hello'}`,
                    'install'
                  )
                }
                className="text-[11px] text-stone-500 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                {copiedInstall ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                {copiedInstall ? 'Copied' : 'Copy'}
              </button>
            </div>

            <div className="p-5 font-mono text-sm space-y-3">
              <div>
                <span className="text-[#9b7ede]">$</span>{' '}
                <span className="text-white">luna update</span>
              </div>

              <div className="text-stone-600">
                Fetching Lunareth repository index...
              </div>

              <div className="pt-2">
                <span className="text-[#9b7ede]">$</span>{' '}
                <span className="text-white">
                  luna install {featuredPackage?.name || 'hello'}
                </span>
              </div>

              <div className="text-stone-600">
                Resolving package...
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-800/80 bg-zinc-950 lunareth-fade-in">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <Moon className="w-3.5 h-3.5 text-[#9b7ede]" />
            <span className="text-white font-semibold">Lunareth OS</span>
            <span>•</span>
            <span>Made by allnew</span>
          </div>

          <a
            href="https://github.com/meskylines17"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Github className="w-3.5 h-3.5" />
            GitHub
            <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>
      </footer>

      {activeMenu && (
        <div
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6 lunareth-fade-in"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setActiveMenu(null);
            }
          }}
        >
          <div className="w-full sm:max-w-2xl max-h-[88vh] overflow-hidden bg-[#111319] border border-zinc-800 rounded-t-3xl sm:rounded-3xl shadow-2xl lunareth-scale-in">
            <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                  {activeMenu === 'packages' ? (
                    <Boxes className="w-4 h-4 text-[#b8a9fc]" />
                  ) : (
                    <Server className="w-4 h-4 text-[#b8a9fc]" />
                  )}
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-white">
                    {activeMenu === 'packages'
                      ? 'Browse Packages'
                      : 'Repository Information'}
                  </h2>

                  <p className="text-[11px] text-stone-500">
                    {activeMenu === 'packages'
                      ? `${filteredPackages.length} of ${packages.length} packages`
                      : 'Lunareth package repository'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveMenu(null)}
                className="w-8 h-8 rounded-lg hover:bg-zinc-800 flex items-center justify-center text-stone-500 hover:text-white hover:rotate-90 transition-all duration-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto max-h-[calc(88vh-73px)]">
              {activeMenu === 'packages' ? (
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-600" />
                    <input
                      id="package-search"
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search packages..."
                      className="w-full h-11 pl-10 pr-12 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white placeholder:text-stone-600 outline-none focus:border-[#9b7ede]/60 focus:ring-2 focus:ring-[#9b7ede]/10 transition-all"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-stone-600 border border-zinc-800 rounded px-1.5 py-0.5 font-mono">
                      /
                    </span>
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    <Filter className="w-3.5 h-3.5 text-stone-600 shrink-0" />

                    {categories.map((item) => (
                      <button
                        key={item}
                        onClick={() => setCategory(item)}
                        className={`px-3 py-1.5 rounded-lg text-[11px] whitespace-nowrap border transition-all ${
                          category === item
                            ? 'bg-[#9b7ede]/15 border-[#9b7ede]/40 text-[#c8bbff]'
                            : 'bg-zinc-950 border-zinc-800 text-stone-500 hover:text-white hover:border-zinc-700'
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>

                  {filteredPackages.length > 0 ? (
                    <div className="space-y-3">
                      {filteredPackages.map((pkg, index) => (
                        <div
                          key={`${pkg.name}-${pkg.version}`}
                          className={`lunareth-fade-up lunareth-delay-${Math.min(
                            index + 1,
                            5
                          )}`}
                        >
                          <PackageCard
                            pkg={pkg}
                            baseUrl={baseUrl}
                            detailed
                            onDetails={() => setSelectedPackage(pkg)}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-14 text-center">
                      <Package className="w-8 h-8 mx-auto text-stone-700 mb-3" />
                      <p className="text-sm text-stone-400">
                        No packages found
                      </p>
                      <p className="text-xs text-stone-600 mt-1">
                        Try another search
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <RepositoryInfo
                  repoUrl={repoUrl}
                  packageCount={packages.length}
                  copied={copied}
                  copyRepoUrl={() => copyText(repoUrl, 'repo')}
                  onRefresh={loadRepository}
                  refreshing={refreshing}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {selectedPackage && (
        <div
          className="fixed inset-0 z-[120] bg-black/70 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-6 lunareth-fade-in"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedPackage(null);
            }
          }}
        >
          <div className="w-full sm:max-w-lg bg-[#111319] border border-zinc-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden lunareth-scale-in">
            <div className="p-5 border-b border-zinc-800 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#9b7ede]/10 border border-[#9b7ede]/20 flex items-center justify-center">
                  <Package className="w-5 h-5 text-[#b8a9fc]" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-mono font-semibold text-white">
                      {selectedPackage.name}
                    </h2>

                    <span className="px-2 py-0.5 rounded-md bg-zinc-800 border border-zinc-700 text-[#b8a9fc] font-mono text-[10px]">
                      v{selectedPackage.version}
                    </span>
                  </div>

                  <p className="text-xs text-stone-500 mt-1">
                    {selectedPackage.category || 'Package'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedPackage(null)}
                className="w-8 h-8 rounded-lg hover:bg-zinc-800 text-stone-500 hover:text-white flex items-center justify-center transition-all hover:rotate-90"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <p className="text-sm text-stone-400 leading-relaxed">
                {selectedPackage.description ||
                  'A package available from the Lunareth repository.'}
              </p>

              <div className="grid grid-cols-2 gap-3">
                <InfoCard
                  icon={<HardDrive className="w-3.5 h-3.5" />}
                  label="Architecture"
                  value={selectedPackage.architecture || 'x86_64'}
                />

                <InfoCard
                  icon={<Package className="w-3.5 h-3.5" />}
                  label="Format"
                  value=".rpm"
                />

                <InfoCard
                  icon={<HardDrive className="w-3.5 h-3.5" />}
                  label="Size"
                  value={selectedPackage.size || 'Unknown'}
                />

                <InfoCard
                  icon={<BookOpen className="w-3.5 h-3.5" />}
                  label="License"
                  value={selectedPackage.license || 'Unknown'}
                />
              </div>

              {selectedPackage.dependencies &&
                selectedPackage.dependencies.length > 0 && (
                  <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4">
                    <div className="text-xs text-stone-500 mb-3">
                      Dependencies
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {selectedPackage.dependencies.map((dependency) => (
                        <span
                          key={dependency}
                          className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-stone-400"
                        >
                          {dependency}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              <div className="flex gap-2">
                <a
                  href={`${baseUrl}/${selectedPackage.file}`}
                  download
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#9b7ede] hover:bg-[#a88de5] text-zinc-950 font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5"
                >
                  <Download className="w-4 h-4" />
                  Download RPM
                </a>

                <button
                  onClick={() =>
                    copyText(
                      `luna install ${selectedPackage.name}`,
                      'install'
                    )
                  }
                  className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white text-sm flex items-center justify-center gap-2 transition-all"
                >
                  {copiedInstall ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  luna
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PackageCard({
  pkg,
  baseUrl,
  detailed = false,
  onDetails,
}: {
  pkg: PackageInfo;
  baseUrl: string;
  detailed?: boolean;
  onDetails?: () => void;
}) {
  const packageUrl = `${baseUrl}/${pkg.file}`;

  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 hover:border-[#9b7ede]/25 hover:-translate-y-1 transition-all duration-300 group">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="min-w-0">
          <div className="flex items-center flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-[#9b7ede] group-hover:scale-110 transition-transform" />

              <h3 className="font-mono font-semibold text-white">
                {pkg.name}
              </h3>
            </div>

            <span className="px-2 py-0.5 rounded-md bg-zinc-800 border border-zinc-700 text-[#b8a9fc] font-mono text-xs">
              v{pkg.version}
            </span>

            {pkg.category && (
              <span className="px-2 py-0.5 rounded-md bg-zinc-950 border border-zinc-800 text-stone-500 text-[10px]">
                {pkg.category}
              </span>
            )}
          </div>

          <p className="text-xs text-stone-400 mt-2 leading-relaxed">
            {pkg.description ||
              'A package available from the Lunareth repository.'}
          </p>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3 text-[11px] font-mono text-stone-500">
            <span>{pkg.architecture || 'x86_64'}</span>
            <span>•</span>
            <span>.rpm</span>

            {pkg.size && (
              <>
                <span>•</span>
                <span>{pkg.size}</span>
              </>
            )}

            {detailed && (
              <>
                <span>•</span>
                <span className="truncate max-w-[220px]">{pkg.file}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onDetails && (
            <button
              onClick={onDetails}
              className="px-3 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-xs text-stone-300 hover:text-white font-medium transition-all duration-200 flex items-center gap-2"
            >
              Details
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}

          <a
            href={packageUrl}
            download
            className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 hover:-translate-y-0.5 border border-zinc-700 text-xs text-white font-medium transition-all duration-200 flex items-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            Download
          </a>

          <a
            href={packageUrl}
            target="_blank"
            rel="noreferrer"
            className="w-9 h-9 rounded-xl bg-zinc-950 hover:bg-zinc-900 hover:-translate-y-0.5 border border-zinc-800 flex items-center justify-center text-stone-500 hover:text-white transition-all duration-200"
            title="Open package"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}

function RepositoryInfo({
  repoUrl,
  packageCount,
  copied,
  copyRepoUrl,
  onRefresh,
  refreshing,
}: {
  repoUrl: string;
  packageCount: number;
  copied: boolean;
  copyRepoUrl: () => void;
  onRefresh: () => void;
  refreshing: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <InfoCard
          icon={<Server className="w-4 h-4" />}
          label="Status"
          value="Online"
          valueClass="text-emerald-400"
        />

        <InfoCard
          icon={<Boxes className="w-4 h-4" />}
          label="Packages"
          value={String(packageCount)}
        />

        <InfoCard
          icon={<HardDrive className="w-4 h-4" />}
          label="Architecture"
          value="x86_64"
        />

        <InfoCard
          icon={<Package className="w-4 h-4" />}
          label="Format"
          value=".rpm"
        />
      </div>

      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4">
        <div className="text-xs text-stone-500 mb-2">
          Repository URL
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <code className="flex-1 min-w-0 px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-[#9b7ede] overflow-x-auto whitespace-nowrap">
            {repoUrl}
          </code>

          <button
            onClick={copyRepoUrl}
            className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs text-white flex items-center justify-center gap-2 cursor-pointer"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#9b7ede]" />
            <span className="text-xs font-medium text-white">
              luna configuration
            </span>
          </div>

          <button
            onClick={onRefresh}
            className="text-stone-600 hover:text-white transition-colors"
            title="Refresh"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`}
            />
          </button>
        </div>

        <code className="block text-xs font-mono text-stone-400 leading-6">
          <span className="text-[#9b7ede]">$</span> luna update
          <br />
          <span className="text-[#9b7ede]">$</span> luna install &lt;package&gt;
        </code>
      </div>

      <a
        href="https://github.com/meskylines17"
        target="_blank"
        rel="noreferrer"
        className="flex items-center justify-between bg-zinc-950 border border-zinc-800 rounded-2xl p-4 hover:border-zinc-700 transition-all group"
      >
        <div className="flex items-center gap-3">
          <Github className="w-4 h-4 text-stone-500 group-hover:text-white transition-colors" />
          <div>
            <div className="text-xs text-white">Lunareth on GitHub</div>
            <div className="text-[11px] text-stone-600 mt-0.5">
              github.com/meskylines17
            </div>
          </div>
        </div>

        <ArrowUpRight className="w-4 h-4 text-stone-600 group-hover:text-[#b8a9fc] transition-colors" />
      </a>
    </div>
  );
}

function InfoCard({
  icon,
  label,
  value,
  valueClass = 'text-white',
  delay = '',
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClass?: string;
  delay?: string;
}) {
  return (
    <div
      className={`bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 hover:-translate-y-1 hover:border-zinc-700 transition-all duration-200 lunareth-fade-up ${delay}`}
    >
      <div className="flex items-center gap-2 text-xs text-stone-500">
        {icon}
        {label}
      </div>

      <div className={`font-mono font-semibold text-sm mt-2 ${valueClass}`}>
        {value}
      </div>
    </div>
  );
}
