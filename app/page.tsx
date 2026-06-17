"use client";
import { useEffect } from "react";

const PIX    = 7;
const GAP    = 1;
const CELL   = PIX - GAP;
const RADIUS = 8;
const DECAY  = 0.92;

const WORDS = ['B2C Subscription Legend','Ex-High Stakes Poker Pro','AI Builder','Media & Content Native','Growth Mindset'];

let wIdx = 0;
let rotInt: ReturnType<typeof setInterval> | null = null;

const R: Record<string, string> = {
  default:      `j'ai 8 ans d'expérience en subscription B2C media.\n\nchez <span class="hi">valmonde</span> : <span class="num">×17</span> abonnés from scratch en 4 ans — équipe lean, meilleur taux croissance marché 2 années consécutives.\n\nchez <span class="hi">lagardère</span> (JDD, Paris Match) : <span class="num">+28%</span> recrutement abonnés en marché décroissant, <span class="num">+21%</span> ARPU, <span class="num">11K</span> abonnés GTM JDNews lancé from scratch.`,
  ia:           `je build en parallèle de mon activité principale.\n\n— moteur de podcasts synthétiques quotidiens (<span class="hi">openai + anthropic + supabase + vercel</span>)\n— agent "alfred" sur VPS hetzner, pilotable via telegram\n— MCP server santé agrégeant <span class="hi">garmin + withings</span> dans sqlite\n— ce site lui-même : le chatbot tourne sur l'api anthropic`,
  achievements: `les trois chiffres qui comptent :\n\n<span class="num">×17</span>  abonnés valmonde en 4 ans (1K → 17K)\n<span class="num">+28%</span> recrutement lagardère en marché décroissant\n<span class="num">+21%</span> ARPU via repricing (+29% tarifs, zéro churn)\n\net 140+ scénarios d'automation lifecycle déployés.`,
  poker:        `5 ans de poker professionnel en parallèle des études.\nHU sit&go, buy-ins les plus élevés du marché .fr.\ncircuit live unibet open.\n\nce que ça m'a appris :\n— décisions data-driven sous incertitude\n— gestion de la variance long terme\n— pattern recognition comportemental\n— calcul EV et ROI en temps réel\n\nles mêmes compétences que je mobilise en growth.`,
};

function getR(q: string): string {
  const l = q.toLowerCase();
  if (l.includes('ia') || l.includes('projet') || l.includes('build') || l.includes('ai')) return R.ia;
  if (l.includes('achiev') || l.includes('résult') || l.includes('chiffre') || l.includes('key')) return R.achievements;
  if (l.includes('poker')) return R.poker;
  return R.default;
}

function typewrite(el: Element, html: string, speed = 12) {
  let i = 0;
  const wrap = document.getElementById('chatMessages')!;
  const t = setInterval(() => {
    i += 3;
    el.innerHTML = html.slice(0, i);
    wrap.scrollTop = 99999;
    if (i >= html.length) { el.innerHTML = html; clearInterval(t); }
  }, speed);
}

function appendMsg(role: string, _: unknown, bodyHTML: string) {
  const wrap = document.getElementById('chatMessages')!;
  const div  = document.createElement('div');
  div.className = 'msg-line';
  const pre = role === 'user'
    ? `<div class="msg-prompt user-prompt">&gt; you</div>`
    : role === 'system'
    ? `<div class="msg-prompt" style="color:#86EFAC">// system</div>`
    : `<div class="msg-prompt">// charles_clone</div>`;
  div.innerHTML = pre + `<div class="msg-body"></div>`;
  wrap.appendChild(div);
  const el = div.querySelector('.msg-body')!;
  if (role === 'ai') { typewrite(el, bodyHTML); }
  else { el.innerHTML = bodyHTML; }
  setTimeout(() => { wrap.scrollTop = 99999; }, 30);
}

function sendQ(btn: HTMLElement | null, custom?: string) {
  const q = custom || (btn && btn.textContent?.replace(/^>\s*/, '')) || '';
  if (!q.trim()) return;
  (document.getElementById('chatInput') as HTMLInputElement).value = '';
  document.getElementById('chatSuggestions')!.style.display = 'none';
  appendMsg('user', null, q.toLowerCase());
  setTimeout(() => appendMsg('ai', null, getR(q)), 300);
}

function startRotating() {
  const el = document.getElementById('rotWord');
  if (!el) return;
  rotInt = setInterval(() => {
    el.style.cssText = 'opacity:0;transform:translateY(-4px);transition:opacity .22s,transform .22s';
    setTimeout(() => {
      wIdx = (wIdx + 1) % WORDS.length;
      el.textContent = WORDS[wIdx];
      el.style.cssText = 'opacity:0;transform:translateY(4px);transition:none';
      requestAnimationFrame(() => {
        el.style.cssText = 'opacity:1;transform:translateY(0);transition:opacity .28s,transform .28s';
      });
    }, 230);
  }, 2800);
}

function openChat() {
  if (rotInt) { clearInterval(rotInt); rotInt = null; }
  const hero = document.getElementById('hero')!;
  const chat = document.getElementById('chat')!;
  hero.style.transition = 'opacity 0.3s';
  hero.style.opacity = '0';
  setTimeout(() => {
    hero.style.display = 'none';
    chat.style.display = 'flex';
    chat.style.opacity = '0';
    chat.style.transition = 'opacity 0.38s';
    requestAnimationFrame(() => { chat.style.opacity = '1'; });
    (document.getElementById('chatInput') as HTMLInputElement).focus();
    appendMsg('system', null, 'session ouverte — charles_clone v2.6 — posez vos questions');
  }, 340);
}

function closeChat() {
  const hero = document.getElementById('hero')!;
  const chat = document.getElementById('chat')!;
  chat.style.opacity = '0';
  setTimeout(() => {
    chat.style.display = 'none';
    document.getElementById('chatMessages')!.innerHTML = '';
    document.getElementById('chatSuggestions')!.style.display = 'flex';
    hero.style.display = 'flex';
    hero.style.opacity = '0';
    hero.style.transition = 'opacity 0.38s';
    requestAnimationFrame(() => { hero.style.opacity = '1'; });
    startRotating();
  }, 320);
}

const css = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body { height: 100%; overflow: hidden; background: #F7FBF8; }

#canvas { position: fixed; inset: 0; z-index: 0; }

.vignette {
  position: fixed; inset: 0; z-index: 1; pointer-events: none;
  background: radial-gradient(ellipse 80% 80% at 50% 50%,
    transparent 50%, rgba(210,235,215,0.3) 85%, rgba(195,225,205,0.5) 100%);
}

.scanline {
  position: fixed; inset: 0; z-index: 2; pointer-events: none;
  background: repeating-linear-gradient(0deg,
    transparent, transparent 3px, rgba(0,0,0,0.006) 3px, rgba(0,0,0,0.006) 4px);
}

#terminal {
  position: fixed; inset: 0; z-index: 10;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: 40px 24px;
  font-family: 'Share Tech Mono', monospace;
}

#boot { width: 100%; max-width: 640px; display: flex; flex-direction: column; }

.boot-line {
  font-size: 13px; color: #166534;
  line-height: 1.8; opacity: 0;
  letter-spacing: 0.04em; white-space: pre;
}
.boot-line.dim   { color: #4A7A58; }
.boot-line.white { color: #052e16; font-weight: bold; }

#hero { display: none; flex-direction: column; align-items: center; text-align: center; }

.hero-name {
  font-family: 'Instrument Serif', serif; font-style: italic;
  font-size: clamp(42px, 7vw, 82px); color: #052e16;
  letter-spacing: -0.03em; line-height: 1;
}

.hero-divider {
  width: 1px; height: 28px;
  background: linear-gradient(to bottom, #4ADE80, transparent);
  margin: 16px auto;
}

.hero-rotating {
  font-size: clamp(12px, 1.6vw, 15px); color: #15803D;
  letter-spacing: 0.14em; text-transform: uppercase;
  height: 22px; display: flex; align-items: center; gap: 8px; margin-bottom: 5px;
}
.hero-rotating .prefix { color: #4ADE80; }
.rotating-word { display: inline-block; min-width: 180px; text-align: left; }

.ask-btn {
  font-family: 'Share Tech Mono', monospace; font-size: 13px;
  color: #15803D; background: none; border: 1px solid #4ADE80;
  padding: 11px 34px; cursor: pointer; letter-spacing: 0.14em;
  text-transform: uppercase; transition: all 0.2s;
  animation: pulse-border 2.5s ease-in-out infinite;
}
.ask-btn:hover {
  background: rgba(21,128,61,0.06); color: #14532D;
  border-color: #16A34A; box-shadow: 0 0 18px rgba(21,128,61,0.12);
  animation: none; letter-spacing: 0.18em;
}
@keyframes pulse-border {
  0%,100% { border-color: #86EFAC; box-shadow: none; }
  50%      { border-color: #4ADE80; box-shadow: 0 0 12px rgba(74,222,128,0.14); }
}

#chat {
  display: none; flex-direction: column;
  width: 100%; max-width: 680px; height: min(560px, 80vh);
}

.chat-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 18px; padding-bottom: 12px; border-bottom: 1px solid #4ADE80;
}
.chat-title { font-size: 10px; color: #166534; letter-spacing: 0.12em; text-transform: uppercase; }
.chat-close {
  font-size: 10px; color: #166534; cursor: pointer;
  background: none; border: none; font-family: 'Share Tech Mono', monospace;
  letter-spacing: 0.08em; transition: color 0.15s;
}
.chat-close:hover { color: #14532D; }

.chat-messages {
  flex: 1; overflow-y: auto; display: flex; flex-direction: column;
  gap: 20px; padding-right: 6px; margin-bottom: 16px;
  scrollbar-width: thin; scrollbar-color: #86EFAC transparent;
}

.msg-line { display: flex; flex-direction: column; gap: 5px; }
.msg-prompt { font-size: 10px; color: #166534; letter-spacing: 0.06em; }
.msg-prompt.user-prompt { color: #15803D; font-weight: bold; }

.msg-body {
  font-size: 13px; line-height: 1.78; color: #052e16;
  padding-left: 14px; border-left: 2px solid #86EFAC;
}
.msg-body .hi  { color: #14532D; font-weight: bold; }
.msg-body .num { color: #15803D; }

.chat-suggestions { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 14px; }
.sug {
  font-family: 'Share Tech Mono', monospace; font-size: 11px;
  color: #166534; background: none; border: 1px solid #86EFAC;
  padding: 5px 12px; cursor: pointer; letter-spacing: 0.04em; transition: all 0.15s;
}
.sug::before { content: '> '; color: #4ADE80; }
.sug:hover { color: #14532D; border-color: #4ADE80; background: rgba(21,128,61,0.04); }

.chat-input-row {
  display: flex; align-items: center;
  border-top: 1px solid #86EFAC; padding-top: 13px;
}
.prompt-prefix { font-size: 13px; color: #15803D; margin-right: 8px; flex-shrink: 0; }
.chat-input {
  flex: 1; background: none; border: none; outline: none;
  font-family: 'Share Tech Mono', monospace; font-size: 13px;
  color: #052e16; caret-color: #15803D; letter-spacing: 0.03em;
}
.chat-input::placeholder { color: #86EFAC; }
.chat-send {
  font-family: 'Share Tech Mono', monospace; font-size: 11px;
  color: #166534; background: none; border: 1px solid #86EFAC;
  padding: 5px 12px; cursor: pointer; letter-spacing: 0.06em;
  transition: all 0.15s; flex-shrink: 0;
}
.chat-send:hover { color: #15803D; border-color: #4ADE80; }

.corner {
  position: fixed; z-index: 15;
  font-family: 'Share Tech Mono', monospace; font-size: 10px;
  color: #166534; letter-spacing: 0.06em; line-height: 1.7;
  pointer-events: none;
}
.corner-tl { top: 20px; left: 24px; }
.corner-tr { top: 20px; right: 24px; text-align: right; }
.corner-label { display: block; color: #166534; }

.bottom-nav {
  position: fixed; bottom: 22px; left: 50%; transform: translateX(-50%);
  z-index: 15; display: flex; align-items: center; gap: 4px;
}
.nav-link {
  display: inline-flex; align-items: center; gap: 7px;
  font-family: 'Share Tech Mono', monospace; font-size: 11px;
  color: #15803D; text-decoration: none; letter-spacing: 0.08em;
  padding: 7px 16px; border: 1px solid #4ADE80;
  transition: all 0.18s; white-space: nowrap;
  background: rgba(247,251,248,0.90);
  backdrop-filter: blur(4px);
}
.nav-link svg { width: 12px; height: 12px; flex-shrink: 0; stroke: currentColor; fill: none; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }
.nav-link:hover {
  color: #14532D; border-color: #16A34A;
  background: rgba(247,251,248,1);
  box-shadow: 0 0 10px rgba(74,222,128,0.10);
}
.nav-sep { font-family: 'Share Tech Mono', monospace; font-size: 10px; color: #86EFAC; padding: 0 2px; }

.blink {
  display: inline-block; width: 7px; height: 13px;
  background: #15803D; vertical-align: middle; margin-left: 2px;
  animation: blink 1s step-end infinite;
}
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
`;

export default function Home() {
  useEffect(() => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const ctx    = canvas.getContext('2d')!;

    let cols: number, rows: number, grid: Float32Array;
    let mouseX = -9999, mouseY = -9999;
    let animFrameId: number;

    function initGrid() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      cols = Math.ceil(canvas.width  / PIX) + 1;
      rows = Math.ceil(canvas.height / PIX) + 1;
      grid = new Float32Array(cols * rows);
    }

    const resizeHandler = () => initGrid();
    window.addEventListener('resize', resizeHandler);
    initGrid();

    const mouseMoveHandler = (e: MouseEvent) => { mouseX = e.clientX; mouseY = e.clientY; };
    document.addEventListener('mousemove', mouseMoveHandler);

    function drawFrame() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const mx = mouseX, my = mouseY;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const px = c * PIX, py = r * PIX;
          const dx = px - mx, dy = py - my;
          const dist = Math.sqrt(dx*dx + dy*dy);
          let b = grid[r * cols + c];
          if (dist < RADIUS) b = Math.min(1, b + (1 - dist / RADIUS) * 0.55);
          b *= DECAY;
          grid[r * cols + c] = b;
          if (b < 0.005) {
            ctx.fillStyle = 'rgba(0,0,0,0.03)';
          } else {
            ctx.fillStyle = `rgba(30,60,35,${b * 0.13})`;
          }
          ctx.fillRect(px, py, CELL, CELL);
        }
      }
      animFrameId = requestAnimationFrame(drawFrame);
    }
    animFrameId = requestAnimationFrame(drawFrame);

    [
      {id:'b0',d:0},{id:'b1',d:180},{id:'b2',d:420},{id:'b3',d:660},
      {id:'b4',d:900},{id:'b5',d:1140},{id:'b6',d:1360},{id:'b7',d:1580}
    ].forEach(({id,d}) => setTimeout(() => {
      const el = document.getElementById(id);
      if (el) { el.style.transition = 'opacity 0.22s'; el.style.opacity = '1'; }
    }, d));

    const bootTimeout = setTimeout(() => {
      const boot = document.getElementById('boot')!;
      boot.style.transition = 'opacity 0.55s';
      boot.style.opacity = '0';
      setTimeout(() => {
        boot.style.display = 'none';
        const hero = document.getElementById('hero')!;
        hero.style.display = 'flex';
        hero.style.opacity = '0';
        hero.style.transition = 'opacity 0.7s';
        requestAnimationFrame(() => { hero.style.opacity = '1'; });
        startRotating();
      }, 580);
    }, 2400);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', resizeHandler);
      document.removeEventListener('mousemove', mouseMoveHandler);
      clearTimeout(bootTimeout);
      if (rotInt) { clearInterval(rotInt); rotInt = null; }
    };
  }, []);

  return (
    <>
      <style>{css}</style>

      <canvas id="canvas"></canvas>
      <div className="vignette"></div>
      <div className="scanline"></div>

      <div className="corner corner-tl">
        <span className="corner-label">charlesbonnet.xyz · v2.6.1</span>
        <span className="corner-label">2026 · paris, france</span>
      </div>
      <div className="corner corner-tr">
        <span className="corner-label">digital_clone · ai</span>
        <span className="corner-label">status: online</span>
      </div>

      <nav className="bottom-nav">
        <a className="nav-link" href="https://www.linkedin.com/in/charlesbonn3t/" target="_blank" rel="noopener noreferrer">
          <svg viewBox="0 0 16 16"><path d="M13 3.5A5.5 5.5 0 1 0 9.5 13.9V11H8V8.5h1.5V6.8c0-1.5.9-2.3 2.2-2.3.6 0 1.3.1 1.3.1v1.5h-.7c-.7 0-1 .5-1 1v1.2H13L12.7 11H11.3v2.9A5.5 5.5 0 0 0 13 3.5z"/></svg>
          LinkedIn
        </a>
        <span className="nav-sep">//</span>
        <a className="nav-link" href="mailto:charles.bonnet@pm.me">
          <svg viewBox="0 0 16 16"><rect x="2" y="4" width="12" height="9" rx="1.5"/><path d="M2 6l6 4 6-4"/></svg>
          Email
        </a>
        <span className="nav-sep">//</span>
        <a className="nav-link" href="/apps">
          <svg viewBox="0 0 16 16"><rect x="2" y="2" width="5" height="5" rx="1"/><rect x="9" y="2" width="5" height="5" rx="1"/><rect x="2" y="9" width="5" height="5" rx="1"/><rect x="9" y="9" width="5" height="5" rx="1"/></svg>
          My Apps
        </a>
      </nav>

      <div id="terminal">

        <div id="boot">
          <div className="boot-line dim"  id="b0">CHARLES_BONNET.AI — SYSTEM BOOT</div>
          <div className="boot-line dim"  id="b1">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
          <div className="boot-line"      id="b2">loading profile .............. <span style={{ color: '#15803D' }}>[OK]</span></div>
          <div className="boot-line"      id="b3">initializing growth engine ... <span style={{ color: '#15803D' }}>[OK]</span></div>
          <div className="boot-line"      id="b4">mounting subscription stack .. <span style={{ color: '#15803D' }}>[OK]</span></div>
          <div className="boot-line"      id="b5">connecting anthropic api ..... <span style={{ color: '#15803D' }}>[OK]</span></div>
          <div className="boot-line dim"  id="b6">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
          <div className="boot-line white"id="b7">all systems operational. <span className="blink"></span></div>
        </div>

        <div id="hero" style={{ display: 'none' }}>
          <div className="hero-name">Charles Bonnet</div>
          <div className="hero-divider"></div>
          <div className="hero-rotating">
            <span className="prefix">// </span>
            <span className="rotating-word" id="rotWord">B2C Subscription Legend</span>
          </div>
          <button className="ask-btn" onClick={openChat}>[ Ask me ]</button>
        </div>

        <div id="chat" style={{ display: 'none' }}>
          <div className="chat-header">
            <span className="chat-title">// charles_clone@bonnet.ai — interactive session</span>
            <button className="chat-close" onClick={closeChat}>[ × close ]</button>
          </div>
          <div className="chat-messages" id="chatMessages"></div>
          <div className="chat-suggestions" id="chatSuggestions">
            <button className="sug" onClick={(e) => sendQ(e.currentTarget)}>résume ton parcours</button>
            <button className="sug" onClick={(e) => sendQ(e.currentTarget)}>tes projets IA</button>
            <button className="sug" onClick={(e) => sendQ(e.currentTarget)}>key achievements</button>
            <button className="sug" onClick={(e) => sendQ(e.currentTarget)}>pourquoi le poker</button>
          </div>
          <div className="chat-input-row">
            <span className="prompt-prefix">&gt;&nbsp;</span>
            <input
              className="chat-input"
              id="chatInput"
              placeholder="type your question..."
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                  sendQ(null, e.currentTarget.value);
                }
              }}
            />
            <button
              className="chat-send"
              onClick={() => {
                const input = document.getElementById('chatInput') as HTMLInputElement;
                sendQ(null, input?.value || 'résume ton parcours');
              }}
            >[enter]</button>
          </div>
        </div>

      </div>
    </>
  );
}
