import React, { useEffect, useState } from 'react';
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
} from 'lucide-react';

type PackageInfo = {
  name: string;
  version: string;
  file: string;
  architecture?: string;
  description?: string;
};

type RepositoryIndex = {
  name?: string;
  version?: string;
  packages?: Record<string, PackageInfo>;
};

export default function App() {
  const [copied, setCopied] = useState(false);
  const [activeMenu, setActiveMenu] = useState<'packages' | 'info' | null>(
    null
  );

  const [repository, setRepository] = useState<RepositoryIndex | null>(null);

  const repoUrl =
  typeof window !== 'undefined'
  ? `${window.location.origin}/index.json`
  : 'https://lunareth-repo.pages.dev/index.json';

  const baseUrl =
  typeof window !== 'undefined'
  ? window.location.origin
  : 'https://lunareth-repo.pages.dev';

  const fallbackPackages: PackageInfo[] = [
    {
      name: 'hello',
      version: '1.0.0',
      file: 'packages/hello-1.0.0.lpk',
      architecture: 'x86_64',
      description:
      'An example package for testing Lunareth OS package management.',
    },
  ];

  useEffect(() => {
    fetch('/index.json')
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to load repository index');
      }

      return response.json();
    })
    .then((data: RepositoryIndex) => {
      setRepository(data);
    })
    .catch(() => {
      // Keep the example package if the index isn't available.
      setRepository(null);
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveMenu(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const packages: PackageInfo[] =
  repository?.packages
  ? Object.entries(repository.packages).map(([name, pkg]) => ({
    ...pkg,
    name: pkg.name || name,
  }))
  : fallbackPackages;

  const copyRepoUrl = async () => {
    try {
      await navigator.clipboard.writeText(repoUrl);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy repository URL:', error);
    }
  };

  const openPackageBrowser = () => {
    setActiveMenu('packages');
  };

  const openRepositoryInfo = () => {
    setActiveMenu('info');
  };

  return (
    <div className="min-h-screen bg-[#0d0f14] text-stone-300 font-sans antialiased flex flex-col selection:bg-[#9b7ede]/30 selection:text-white">

    {/* Header */}
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

    <div className="hidden sm:flex items-center gap-2">

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

    <div className="ml-2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-emerald-400">
    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 lunareth-pulse" />
    Online
    </div>

    </div>

    </div>
    </header>

    {/* Main */}
    <main className="flex-grow max-w-5xl mx-auto px-5 sm:px-6 py-16 w-full">

    {/* Hero */}
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
    className="px-5 py-2.5 rounded-xl bg-[#9b7ede] hover:bg-[#a88de5] hover:-translate-y-0.5 active:scale-[0.98] text-zinc-950 font-semibold text-sm transition-all duration-200 flex items-center gap-2 cursor-pointer"
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

    {/* Quick stats */}
    <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-16">

    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 hover:-translate-y-1 hover:border-zinc-700 transition-all duration-200 lunareth-fade-up lunareth-delay-1">
    <div className="flex items-center gap-2 text-stone-500 text-xs uppercase tracking-wider">
    <Boxes className="w-4 h-4" />
    Packages
    </div>

    <div className="text-2xl font-semibold text-white mt-3">
    {packages.length}
    </div>
    </div>

    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 hover:-translate-y-1 hover:border-zinc-700 transition-all duration-200 lunareth-fade-up lunareth-delay-2">
    <div className="flex items-center gap-2 text-stone-500 text-xs uppercase tracking-wider">
    <HardDrive className="w-4 h-4" />
    Architecture
    </div>

    <div className="text-2xl font-semibold text-white mt-3 font-mono">
    x86_64
    </div>
    </div>

    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 hover:-translate-y-1 hover:border-zinc-700 transition-all duration-200 lunareth-fade-up lunareth-delay-3">
    <div className="flex items-center gap-2 text-stone-500 text-xs uppercase tracking-wider">
    <CircleCheck className="w-4 h-4 text-emerald-400" />
    Status
    </div>

    <div className="text-2xl font-semibold text-emerald-400 mt-3">
    Online
    </div>
    </div>

    </section>

    {/* Repository URL */}
    <section className="mt-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-colors lunareth-fade-up lunareth-delay-4">

    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

    <div className="min-w-0">
    <div className="text-xs text-stone-500 mb-2">
    Repository index
    </div>

    <code className="block text-xs sm:text-sm text-[#9b7ede] font-mono truncate">
    {repoUrl}
    </code>
    </div>

    <button
    onClick={copyRepoUrl}
    className="shrink-0 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 hover:-translate-y-0.5 border border-zinc-700 text-xs text-white font-medium transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
    >
    {copied ? (
      <Check className="w-3.5 h-3.5 text-emerald-400" />
    ) : (
      <Copy className="w-3.5 h-3.5" />
    )}

    {copied ? 'Copied!' : 'Copy URL'}
    </button>

    </div>

    </section>

    {/* Featured package */}
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

    {packages[0] && (
      <PackageCard
      pkg={packages[0]}
      baseUrl={baseUrl}
      />
    )}

    </section>

    {/* Luna */}
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

    <div className="px-4 py-3 border-b border-zinc-800 flex items-center gap-2">
    <Terminal className="w-4 h-4 text-stone-500" />

    <span className="text-xs text-stone-500 font-mono">
    terminal
    </span>
    </div>

    <div className="p-5 font-mono text-sm space-y-3">

    <div>
    <span className="text-[#9b7ede]">$</span>{' '}
    <span className="text-white">
    luna update
    </span>
    </div>

    <div className="text-stone-600">
    Fetching Lunareth repository index...
    </div>

    <div className="pt-2">
    <span className="text-[#9b7ede]">$</span>{' '}
    <span className="text-white">
    luna install hello
    </span>
    </div>

    <div className="text-stone-600">
    Resolving package...
    </div>

    </div>

    </div>

    </section>

    </main>

    {/* Footer */}
    <footer className="border-t border-zinc-800/80 bg-zinc-950 lunareth-fade-in">

    <div className="max-w-5xl mx-auto px-5 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">

    <div className="flex items-center gap-2">
    <Moon className="w-3.5 h-3.5 text-[#9b7ede]" />
    <span className="text-white font-semibold">
    Lunareth OS
    </span>

    <span>•</span>

    <span>
    Made by allnew
    </span>
    </div>

    <div className="flex items-center gap-1.5">
    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 lunareth-pulse" />
    Repository Online
    </div>

    </div>

    </footer>

    {/* Modal backdrop */}
    {activeMenu && (
      <div
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6 lunareth-fade-in"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          setActiveMenu(null);
        }
      }}
      >

      {/* Modal */}
      <div className="w-full sm:max-w-2xl max-h-[88vh] overflow-hidden bg-[#111319] border border-zinc-800 rounded-t-3xl sm:rounded-3xl shadow-2xl lunareth-scale-in">

      {/* Modal header */}
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
      ? `${packages.length} package${packages.length === 1 ? '' : 's'} available`
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

      {/* Modal body */}
      <div className="p-5 overflow-y-auto max-h-[calc(88vh-73px)]">

      {activeMenu === 'packages' ? (
        <div className="space-y-3">

        {packages.map((pkg, index) => (
          <div key={`${pkg.name}-${pkg.version}-wrap`} className={`lunareth-fade-up ${index < 5 ? `lunareth-delay-${index + 1}` : ""}`}>

          <PackageCard
          pkg={pkg}
          baseUrl={baseUrl}
          detailed
          />
          </div>
        ))}

        </div>
      ) : (
        <RepositoryInfo
        repoUrl={repoUrl}
        packageCount={packages.length}
        copied={copied}
        copyRepoUrl={copyRepoUrl}
        />
      )}

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
}: {
  pkg: PackageInfo;
  baseUrl: string;
  detailed?: boolean;
}) {
  const packageUrl = `${baseUrl}/${pkg.file}`;

  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 hover:-translate-y-1 transition-all duration-200 lunareth-fade-up">

    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">

    <div className="min-w-0">

    <div className="flex items-center flex-wrap gap-2">

    <div className="flex items-center gap-2">
    <Package className="w-4 h-4 text-[#9b7ede]" />

    <h3 className="font-mono font-semibold text-white">
    {pkg.name}
    </h3>
    </div>

    <span className="px-2 py-0.5 rounded-md bg-zinc-800 border border-zinc-700 text-[#b8a9fc] font-mono text-xs">
    v{pkg.version}
    </span>

    </div>

    <p className="text-xs text-stone-400 mt-2 leading-relaxed">
    {pkg.description ||
      'A package available from the Lunareth repository.'}
      </p>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3 text-[11px] font-mono text-stone-500">
      <span>
      {pkg.architecture || 'x86_64'}
      </span>

      <span>•</span>

      <span>.lpk</span>

      {detailed && (
        <>
        <span>•</span>
        <span className="truncate max-w-[220px]">
        {pkg.file}
        </span>
        </>
      )}
      </div>

      </div>

      <div className="flex items-center gap-2 shrink-0">

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
}: {
  repoUrl: string;
  packageCount: number;
  copied: boolean;
  copyRepoUrl: () => void;
}) {
  return (
    <div className="space-y-4">

    <div className="grid grid-cols-2 gap-3 lunareth-fade-up lunareth-delay-1">

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
    value=".lpk"
    />

    </div>

    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 lunareth-fade-up lunareth-delay-2">

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

    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 lunareth-fade-up lunareth-delay-3">

    <div className="flex items-center gap-2 mb-3">
    <Terminal className="w-4 h-4 text-[#9b7ede]" />

    <span className="text-xs font-medium text-white">
    luna configuration
    </span>
    </div>

    <code className="block text-xs font-mono text-stone-400 leading-6">
    <span className="text-[#9b7ede]">$</span> luna update
    <br />
    <span className="text-[#9b7ede]">$</span> luna install &lt;package&gt;
    </code>

    </div>

    </div>
  );
}

function InfoCard({
  icon,
  label,
  value,
  valueClass = 'text-white',
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 hover:-translate-y-1 hover:border-zinc-700 transition-all duration-200 lunareth-fade-up">

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
