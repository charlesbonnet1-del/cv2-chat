"use client";

import React, { useEffect } from 'react';

export default function GamePage() {
  return (
    <div className="min-h-screen bg-[var(--term-bg)] text-[var(--term-fg)] font-mono pb-20">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-[200] bg-[var(--term-surface)] border-b border-[var(--term-border)] h-[58px] flex items-center px-5 gap-3 shadow-md">
        <div className="flex items-center cursor-pointer mr-4 shrink-0" onClick={() => window.location.href='/bga2'}>
          <span className="text-white text-xl font-black italic">BGA<span className="text-[var(--term-accent)]">2</span></span>
        </div>
        <div className="flex items-center gap-1 flex-1">
          <button className="text-white/65 hover:text-white hover:bg-white/10 text-[13px] font-semibold px-3 py-1.5 rounded transition" onClick={() => window.location.href='/bga2'}>Retour à l'accueil</button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className="bg-[var(--term-surface)] pt-[90px] pb-10 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(156,204,156,.08) 1px,transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="max-w-[1140px] mx-auto px-6 grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-10 items-end relative z-10">
          <div>
            <div className="flex items-center gap-2 bg-[var(--term-accent)]/10 border border-[var(--term-accent)]/30 px-3 py-1.5 rounded-full text-[12px] font-bold text-[var(--term-accent)] mb-5 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              2 314 joueurs jouent à ce jeu actuellement
            </div>
            <h1 className="text-white text-4xl md:text-5xl font-black mb-3 leading-tight tracking-tight">Carcassonne</h1>
            <p className="text-white/60 text-[15px] mb-6 max-w-[600px] leading-relaxed">
              Bâtissez villes, routes, monastères et champs dans ce grand classique du placement de tuiles. Développez la région de Carcassonne et déployez vos partisans pour remporter la victoire.
            </p>
            <div className="flex flex-wrap gap-3 mb-6">
              <button className="bg-[var(--term-accent)] hover:bg-[var(--term-accent-dim)] text-[var(--term-bg)] font-bold py-3 px-6 rounded-md shadow-lg transition transform hover:-translate-y-0.5" onClick={() => window.location.href='/bga2/signup'}>
                Jouer maintenant
              </button>
              <button className="bg-transparent border border-white/20 text-white hover:bg-white/10 font-bold py-3 px-6 rounded-md transition" onClick={() => window.location.href='/bga2/learn'}>
                Tutoriel IA
              </button>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold text-white/50 uppercase tracking-widest">
              <span>👥 2-5 joueurs</span>
              <span>•</span>
              <span>⏱ 30-45 min</span>
              <span>•</span>
              <span>🧠 Complexe: 2/5</span>
            </div>
          </div>
          
          {/* BOX ART MOCKUP */}
          <div className="hidden md:flex justify-end perspective-1000">
            <div className="w-[200px] h-[280px] rounded-lg shadow-2xl flex flex-col justify-center items-center text-4xl" style={{ background: 'linear-gradient(150deg,var(--term-surface-2),var(--term-surface))', transform: 'rotateY(-15deg) rotateX(10deg)' }}>
              ♟
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1140px] mx-auto px-6 mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* LEFT COL - VIDEO & RULES */}
        <div className="md:col-span-2 space-y-8">
          <div className="bg-[var(--term-surface)] border border-[var(--term-border)] rounded-[14px] p-6 shadow-sm">
            <h2 className="text-[20px] font-black text-[var(--term-fg)] mb-4">📺 Apprendre les règles en 5 min</h2>
            <div className="aspect-video bg-[var(--term-fg)] rounded-lg overflow-hidden relative flex items-center justify-center">
               <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/1B9ZpX9J9pE?si=u3G0WlA-uEXw1gA3" 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen>
               </iframe>
            </div>
            <p className="text-[13px] text-[var(--term-dim)] mt-4 leading-relaxed">
              Cette vidéo officielle vous présente les règles de base de Carcassonne : comment piocher vos tuiles, placer vos meeples, et marquer les points de vos villes et routes complétées.
            </p>
          </div>
          
          <div className="bg-[var(--term-surface)] border border-[var(--term-border)] rounded-[14px] p-6 shadow-sm">
            <h2 className="text-[20px] font-black text-[var(--term-fg)] mb-4">🎮 Le principe du jeu</h2>
            <p className="text-[14px] text-[var(--term-dim)] leading-relaxed mb-4">
              Carcassonne est un jeu de placement de tuiles inspiré par la forteresse médiévale du sud de la France. Les joueurs tirent au sort une tuile de paysage et doivent la placer de sorte que ses bords correspondent à ceux des tuiles adjacentes (les routes doivent toucher les routes, les villes doivent toucher les villes, etc).
            </p>
            <p className="text-[14px] text-[var(--term-dim)] leading-relaxed">
              Après avoir placé une tuile, le joueur peut décider d'y placer un de ses "Meeples" sur une des zones de cette tuile : sur une ville pour en faire un chevalier, sur une route pour en faire un voleur, etc.
            </p>
          </div>
        </div>

        {/* RIGHT COL - STATS & COMMUNITY */}
        <div className="space-y-6">
          <div className="bg-[var(--term-surface)] border border-[var(--term-border)] rounded-[14px] p-5 shadow-sm">
             <h3 className="text-[12px] font-black text-[var(--term-muted)] tracking-widest uppercase mb-4">Stats du jeu</h3>
             <ul className="space-y-3">
               <li className="flex justify-between items-center text-[13px] border-b border-[var(--term-border)] pb-2">
                 <span className="text-[var(--term-dim)]">Classement BGA</span>
                 <strong className="text-[var(--term-fg)]">#4</strong>
               </li>
               <li className="flex justify-between items-center text-[13px] border-b border-[var(--term-border)] pb-2">
                 <span className="text-[var(--term-dim)]">Note Joueurs</span>
                 <strong className="text-[var(--term-accent)]">★ 4.8 / 5</strong>
               </li>
               <li className="flex justify-between items-center text-[13px] border-b border-[var(--term-border)] pb-2">
                 <span className="text-[var(--term-dim)]">Complexité</span>
                 <strong className="text-[var(--term-fg)]">Accessible</strong>
               </li>
               <li className="flex justify-between items-center text-[13px]">
                 <span className="text-[var(--term-dim)]">Parties jouées</span>
                 <strong className="text-[var(--term-fg)]">129 483 192</strong>
               </li>
             </ul>
          </div>

          <div className="bg-[var(--term-surface)] border border-[var(--term-border-2)] rounded-[14px] p-5 shadow-sm">
             <div className="flex items-center gap-2 text-[var(--term-fg)] font-black text-[14px] mb-2 uppercase tracking-wide">
               ★ Version Premium
             </div>
             <p className="text-[var(--term-fg)]/80 text-[13px] leading-relaxed mb-4">
               Carcassonne inclut de nombreuses extensions exclusives sur Board Game Arena. Le jeu de base est gratuit, mais l'accès aux extensions nécessite un compte Premium.
             </p>
             <button className="w-full bg-[var(--term-fg)] hover:bg-[var(--term-fg-bright)] text-[var(--term-bg)] font-black py-2 rounded-md transition text-sm">
               Découvrir Premium
             </button>
          </div>
        </div>

      </div>
    </div>
  );
}
