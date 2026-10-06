import React, { useState } from 'react';
import {
  Copy,
  Check,
  Server,
  Package,
  HardDrive,
} from 'lucide-react';

export default function App() {
  const [copied, setCopied] = useState(false);

  // Uses the actual Cloudflare Pages domain automatically
  const repoUrl =
  typeof window !== 'undefined'
  ? `${window.location.origin}/index.json`
  : 'https://lunareth-repo.pages.dev/index.json';

  const packageUrl =
  typeof window !== 'undefined'
  ? `${window.location.origin}/packages/hello-1.0.0.lpk`
  : 'https://lunareth-repo.pages.dev/packages/hello-1.0.0.lpk';

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

  return (
    <div className="min-h-screen bg-[#0d0f14] text-stone-300 font-sans antialiased flex flex-col selection:bg-purple-500/30 selection:text-white">

    {/* Header */}
    <header className="border-b border-zinc-800/80 bg-[#0d0f14]/80 backdrop-blur-md sticky top-0 z-50">
    <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">

    <div className="flex items-center space-x-3">
    <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#9b7ede] font-mono font-bold text-sm">
    L
    </div>

    <span className="font-semibold text-white tracking-wide text-sm">
    Lunareth Repository
    </span>
    </div>

    <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-emerald-400 font-medium">
    <span className="w-2 h-2 rounded-full bg-emerald-400" />
    <span>Repository Online</span>
    </div>

    </div>
    </header>

    {/* Main */}
    <main className="flex-grow max-w-4xl mx-auto px-6 py-12 w-full space-y-16">

    {/* Hero */}
    <section className="text-center space-y-6 pt-6 pb-4">

    <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 text-xs font-mono text-[#b8a9fc]">
    Lunareth OS
    </div>

    <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
    Lunareth Repository
    </h1>

    <p className="text-base text-stone-400 max-w-lg mx-auto">
    The package repository for Lunareth OS
    </p>

    <div className="flex flex-wrap justify-center gap-3 pt-2">

    <a
    href="#packages"
    className="px-5 py-2.5 rounded-xl bg-[#9b7ede] hover:bg-[#8a6ecb] text-zinc-950 font-semibold text-sm transition-all"
    >
    Browse Packages
    </a>

    <a
    href="#repository-info"
    className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-sm border border-zinc-800 transition-all"
    >
    Repository Info
    </a>

    </div>
    </section>

    {/* Repository Information */}
    <section id="repository-info" className="space-y-4">

    <div className="flex items-center justify-between">
    <h2 className="text-sm font-semibold text-white tracking-wide uppercase font-mono">
    Repository Specifications
    </h2>

    <span className="text-xs text-stone-500 font-mono">
    index.json
    </span>
    </div>

    <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-6">

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

    {/* Architecture */}
    <div className="space-y-1">

    <span className="text-xs text-stone-500 uppercase tracking-wider font-medium flex items-center space-x-1.5">
    <HardDrive className="w-3.5 h-3.5 text-[#7ea2de]" />
    <span>Architecture</span>
    </span>

    <p className="font-mono text-sm text-white font-semibold">
    x86_64
    </p>

    </div>

    {/* Package format */}
    <div className="space-y-1">

    <span className="text-xs text-stone-500 uppercase tracking-wider font-medium flex items-center space-x-1.5">
    <Package className="w-3.5 h-3.5 text-[#9b7ede]" />
    <span>Package Format</span>
    </span>

    <p className="font-mono text-sm text-white font-semibold">
    .lpk
    </p>

    </div>

    {/* Status */}
    <div className="space-y-1">

    <span className="text-xs text-stone-500 uppercase tracking-wider font-medium flex items-center space-x-1.5">
    <Server className="w-3.5 h-3.5 text-emerald-400" />
    <span>Status</span>
    </span>

    <p className="font-mono text-sm text-emerald-400 font-semibold flex items-center space-x-1.5">
    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
    <span>Online</span>
    </p>

    </div>

    </div>

    {/* Repository URL */}
    <div className="pt-4 border-t border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">

    <div className="flex items-center space-x-2 overflow-x-auto py-1">

    <span className="text-xs text-stone-500 whitespace-nowrap">
    Repository URL:
    </span>

    <code className="px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-mono text-[#7ea2de] select-all">
    {repoUrl}
    </code>

    </div>

    <button
    onClick={copyRepoUrl}
    className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs text-white font-medium border border-zinc-700 transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
    >
    {copied ? (
      <Check className="w-3.5 h-3.5 text-emerald-400" />
    ) : (
      <Copy className="w-3.5 h-3.5" />
    )}

    <span>
    {copied ? 'Copied!' : 'Copy URL'}
    </span>
    </button>

    </div>

    </div>
    </section>

    {/* Packages */}
    <section id="packages" className="space-y-4">

    <div className="flex items-center justify-between">

    <div>
    <h2 className="text-sm font-semibold text-white tracking-wide uppercase font-mono">
    Available Packages
    </h2>

    <p className="text-xs text-stone-500 mt-0.5">
    Packages available from this repository
    </p>
    </div>

    <span className="text-xs font-mono text-stone-400 bg-zinc-900 px-2.5 py-1 rounded-lg border border-zinc-800">
    1 package
    </span>

    </div>

    {/* Hello package */}
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-all">

    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

    <div className="space-y-2">

    <div className="flex items-center flex-wrap gap-2">

    <h3 className="text-base font-semibold text-white font-mono">
    hello
    </h3>

    <span className="px-2.5 py-0.5 rounded-md bg-zinc-800 text-[#9b7ede] font-mono text-xs border border-zinc-700">
    v1.0.0
    </span>

    <span className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
    Example Package
    </span>

    </div>

    <p className="text-xs text-stone-400 max-w-md">
    An example package for testing Lunareth OS package management.
    </p>

    <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-stone-500 pt-1">
    <span>Arch: x86_64</span>
    <span>•</span>
    <span>Format: .lpk</span>
    </div>

    </div>

    <a
    href={packageUrl}
    className="text-xs font-mono text-[#b8a9fc] bg-zinc-950 px-3 py-2 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-all"
    >
    View Package
    </a>

    </div>

    </div>
    </section>

    {/* Lunepkg */}
    <section className="space-y-4">

    <div className="space-y-1">

    <h2 className="text-sm font-semibold text-white tracking-wide uppercase font-mono">
    Package Manager
    </h2>

    <p className="text-xs text-stone-400">
    Lunareth OS uses{' '}
    <code className="text-[#b8a9fc] font-mono">
    lunepkg
    </code>{' '}
    to manage packages.
    </p>

    </div>

    <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl overflow-hidden font-mono text-xs">

    <div className="bg-zinc-950 px-4 py-3 border-b border-zinc-800 flex items-center justify-between">

    <div className="flex items-center space-x-2">
    <span className="w-3 h-3 rounded-full bg-zinc-800" />
    <span className="w-3 h-3 rounded-full bg-zinc-800" />
    <span className="w-3 h-3 rounded-full bg-zinc-800" />
    </div>

    <span className="text-stone-500">
    Terminal
    </span>

    <div className="w-12" />

    </div>

    <div className="p-5 space-y-4 text-stone-300">

    <div className="flex items-start space-x-2">
    <span className="text-[#9b7ede]">$</span>
    <span className="text-white font-medium">
    lunepkg update
    </span>
    </div>

    <div className="text-stone-500 pl-4">
    Fetching repository index...
    </div>

    <div className="flex items-start space-x-2 pt-2">
    <span className="text-[#9b7ede]">$</span>
    <span className="text-white font-medium">
    lunepkg install hello
    </span>
    </div>

    <div className="text-stone-500 pl-4">
    Resolving package 'hello'...
    </div>

    </div>

    </div>
    </section>

    </main>

    {/* Footer */}
    <footer className="border-t border-zinc-800/80 bg-zinc-950">

    <div className="max-w-4xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 font-medium">

    <div className="flex items-center space-x-2">
    <span className="text-white font-semibold">
    Lunareth OS
    </span>

    <span>•</span>

    <span>
    Made by meskylines
    </span>
    </div>

    <div className="flex items-center space-x-1.5">
    <span className="w-2 h-2 rounded-full bg-emerald-400" />
    <span>Repository Online</span>
    </div>

    </div>

    </footer>

    </div>
  );
}
