import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Wrench,
  Activity,
  Scale,
  TrendingUp,
  Briefcase,
  Shield,
  Palette,
  Atom,
  BookOpen,
  Megaphone,
  Radio,
  Plane,
  Coffee,
  Trophy,
  Film,
  Sprout,
  Dna,
  Rocket,
  Compass,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { api } from '../services/api';

const iconMap: Record<string, any> = {
  Cpu, Wrench, Activity, Scale, TrendingUp, Briefcase, Shield, Palette, Atom,
  BookOpen, Megaphone, Radio, Plane, Coffee, Trophy, Film, Sprout, Dna, Rocket, Compass,
};

export const DomainsPage: React.FC = () => {
  const [packs, setPacks] = useState<any[]>([]);

  useEffect(() => {
    api.getDomainPacks().then(setPacks).catch(console.error);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in">
      <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-2">
        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
          Platform Scope (Part 2.2 & 2.3)
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
          All 20 Supported Domains & Verified Taxonomy Packs
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Every domain carries seeded skill taxonomies, sample roles, assessment styles, and practical proof templates.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {packs.map((pack) => {
          const Icon = iconMap[pack.icon] || Compass;
          const isHealthcareOrLaw = pack.domainCode === 'healthcare' || pack.domainCode === 'law';

          return (
            <div
              key={pack.domainCode}
              className="glass-card p-5 rounded-2xl flex flex-col justify-between space-y-4 hover:border-indigo-400 transition-colors"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
                  {pack.domainName}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2">
                  {pack.description}
                </p>

                {isHealthcareOrLaw && (
                  <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[10px] text-amber-800 dark:text-amber-200 flex items-start gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-600" />
                    <span>Career guidance & exam preparation only. Not medical/legal advice.</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span>{pack.skillsCount} Skills</span>
                <span>{pack.rolesCount} Sample Roles</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
