"use client";
import { useEffect } from "react";
import AppsShowcase from "./components/AppsShowcase";

const WORDS = ['B2C Subscription Legend','Ex-High Stakes Poker Pro','AI Builder','Media & Content Native','Growth Mindset'];

let wIdx = 0;
let rotInt: ReturnType<typeof setInterval> | null = null;
let conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = [];

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>');
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
    ? `<div class="msg-prompt user-prompt">guest@charlesbonnet:~$</div>`
    : role === 'system'
    ? `<div class="msg-prompt sys-prompt">[sys]</div>`
    : `<div class="msg-prompt">charles_clone ›</div>`;
  div.innerHTML = pre + `<div class="msg-body"></div>`;
  wrap.appendChild(div);
  const el = div.querySelector('.msg-body')!;
  if (role === 'ai') { typewrite(el, bodyHTML); }
  else { el.innerHTML = bodyHTML; }
  setTimeout(() => { wrap.scrollTop = 99999; }, 30);
}

async function sendQ(btn: HTMLElement | null, custom?: string) {
  const q = custom || (btn && btn.textContent?.replace(/^>\s*/, '')) || '';
  if (!q.trim()) return;

  const input = document.getElementById('chatInput') as HTMLInputElement;
  input.value = '';
  document.getElementById('chatSuggestions')!.style.display = 'none';

  conversationHistory.push({ role: 'user', content: q });
  appendMsg('user', null, escapeHtml(q));

  const wrap = document.getElementById('chatMessages')!;
  const loadEl = document.createElement('div');
  loadEl.id = 'loadMsg';
  loadEl.className = 'msg-line';
  loadEl.innerHTML = '<div class="msg-prompt">charles_clone ›</div><div class="msg-body"><span class="blink"></span></div>';
  wrap.appendChild(loadEl);
  wrap.scrollTop = 99999;
  input.disabled = true;

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: conversationHistory }),
    });
    const data = await res.json();
    const reply = data.reply || "Je ne suis pas à même de répondre à cette question.";
    loadEl.remove();
    conversationHistory.push({ role: 'assistant', content: reply });
    appendMsg('ai', null, escapeHtml(reply));
  } catch {
    loadEl.remove();
    appendMsg('ai', null, 'Erreur de connexion. Veuillez réessayer.');
  } finally {
    input.disabled = false;
    input.focus();
  }
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
    appendMsg('system', null, 'session ouverte — charles_clone v2.6 — ask me anything about Charles');
  }, 340);
}

function closeChat() {
  conversationHistory = [];
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
html, body { height: 100%; overflow: hidden; background: var(--term-bg); }

#terminal {
  position: fixed; inset: 0; z-index: 10;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: 40px 24px;
  font-family: var(--term-font);
}

#hero { display: flex; flex-direction: column; align-items: flex-start; text-align: left; width: 100%; max-width: 640px; }

.hero-cmd { font-size: 12px; color: var(--term-muted); margin-bottom: 14px; }
.hero-cmd .ps1 { color: var(--term-accent); }

.hero-name {
  font-family: var(--term-font); font-weight: 500;
  font-size: clamp(30px, 5.2vw, 56px); color: var(--term-fg-bright);
  letter-spacing: -0.02em; line-height: 1.05;
}

.hero-divider {
  width: 100%; height: 1px;
  background: var(--term-border);
  margin: 20px 0 16px;
}

.hero-rotating {
  font-size: 13px; color: var(--term-fg);
  height: 22px; display: flex; align-items: center; gap: 8px; margin-bottom: 26px;
}
.hero-rotating .prefix { color: var(--term-muted); }
.rotating-word { display: inline-block; min-width: 180px; text-align: left; }

.ask-btn {
  font-family: var(--term-font); font-size: 12px;
  color: var(--term-bg); background: var(--term-fg); border: 1px solid var(--term-fg);
  padding: 9px 22px; cursor: pointer; letter-spacing: 0.06em;
  text-transform: lowercase; transition: background 0.15s, color 0.15s, border-color 0.15s;
}
.ask-btn:hover { background: var(--term-accent); border-color: var(--term-accent); color: var(--term-bg); }

#chat {
  display: none; flex-direction: column;
  width: 100%; max-width: 720px; height: min(580px, 80vh);
  border: 1px solid var(--term-border); background: var(--term-bg);
}

.chat-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 8px 14px; border-bottom: 1px solid var(--term-border);
  background: var(--term-surface);
}
.chat-title { font-size: 11px; color: var(--term-dim); }
.chat-close {
  font-size: 11px; color: var(--term-dim); cursor: pointer;
  background: none; border: none; font-family: var(--term-font);
  transition: color 0.15s;
}
.chat-close:hover { color: var(--term-fg-bright); }

.chat-messages {
  flex: 1; overflow-y: auto; display: flex; flex-direction: column;
  gap: 18px; padding: 16px 14px; margin-bottom: 0;
}

.msg-line { display: flex; flex-direction: column; gap: 4px; }
.msg-prompt { font-size: 11px; color: var(--term-muted); }
.msg-prompt.user-prompt { color: var(--term-accent); }
.msg-prompt.sys-prompt { color: var(--term-accent-dim); }

.msg-body {
  font-size: 13px; line-height: 1.75; color: var(--term-fg);
  padding-left: 14px; border-left: 1px solid var(--term-border-2);
}
.msg-body .hi  { color: var(--term-fg-bright); font-weight: bold; }
.msg-body .num { color: var(--term-accent); }

.chat-suggestions { display: flex; gap: 6px; flex-wrap: wrap; padding: 0 14px 12px; }
.sug {
  font-family: var(--term-font); font-size: 11px;
  color: var(--term-dim); background: none; border: 1px solid var(--term-border);
  padding: 4px 10px; cursor: pointer; transition: all 0.15s;
}
.sug::before { content: '> '; color: var(--term-muted); }
.sug:hover { color: var(--term-fg-bright); border-color: var(--term-border-2); background: var(--term-surface); }
.sug:hover::before { color: var(--term-accent); }

.chat-input-row {
  display: flex; align-items: center;
  border-top: 1px solid var(--term-border); padding: 10px 14px;
}
.prompt-prefix { font-size: 13px; color: var(--term-accent); margin-right: 8px; flex-shrink: 0; }
.chat-input {
  flex: 1; background: none; border: none; outline: none;
  font-family: var(--term-font); font-size: 13px;
  color: var(--term-fg-bright); caret-color: var(--term-accent);
}
.chat-input:focus-visible { outline: none; }
.chat-input::placeholder { color: var(--term-muted); }
.chat-send {
  font-family: var(--term-font); font-size: 11px;
  color: var(--term-dim); background: none; border: 1px solid var(--term-border);
  padding: 4px 10px; cursor: pointer;
  transition: all 0.15s; flex-shrink: 0;
}
.chat-send:hover { color: var(--term-fg-bright); border-color: var(--term-border-2); }

.corner {
  position: fixed; z-index: 15;
  font-family: var(--term-font); font-size: 10px;
  color: var(--term-muted); line-height: 1.7;
  pointer-events: none;
}
.corner-tl { top: 20px; left: 24px; }
.corner-tr { top: 20px; right: 24px; text-align: right; }
.corner-label { display: block; }
.status-dot { color: var(--term-accent); }

.bottom-nav {
  position: fixed; bottom: 22px; left: 50%; transform: translateX(-50%);
  z-index: 15; display: flex; align-items: center; gap: 4px;
}
.nav-link {
  display: inline-flex; align-items: center; gap: 7px;
  font-family: var(--term-font); font-size: 11px;
  color: var(--term-dim); text-decoration: none;
  padding: 6px 14px; border: 1px solid var(--term-border);
  transition: all 0.15s; white-space: nowrap; cursor: pointer;
  background: var(--term-bg);
}
.nav-link svg { width: 12px; height: 12px; flex-shrink: 0; stroke: currentColor; fill: none; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }
.nav-link:hover { color: var(--term-fg-bright); border-color: var(--term-border-2); background: var(--term-surface); }
.nav-sep { font-family: var(--term-font); font-size: 10px; color: var(--term-border-2); padding: 0 2px; }

@media (max-width: 560px) {
  .corner-tr { display: none; }
  .nav-link { padding: 6px 9px; }
  .nav-sep { display: none; }
}

.blink {
  display: inline-block; width: 7px; height: 14px;
  background: var(--term-fg); vertical-align: middle; margin-left: 2px;
  animation: blink 1s step-end infinite;
}
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
`;

export default function Home() {
  useEffect(() => {
    startRotating();
    return () => {
      if (rotInt) { clearInterval(rotInt); rotInt = null; }
    };
  }, []);

  return (
    <>
      <style>{css}</style>

      <div className="corner corner-tl">
        <span className="corner-label">charlesbonnet.xyz · v2.6.1</span>
        <span className="corner-label">2026 · paris, france</span>
      </div>
      <div className="corner corner-tr">
        <span className="corner-label">digital_clone · ai</span>
        <span className="corner-label"><span className="status-dot">●</span> status: online</span>
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
        <AppsShowcase variant="terminal" />
      </nav>

      <div id="terminal">

        <div id="hero">
          <div className="hero-cmd"><span className="ps1">guest@charlesbonnet:~$</span> whoami</div>
          <div className="hero-name">Charles Bonnet</div>
          <div className="hero-divider"></div>
          <div className="hero-rotating">
            <span className="prefix">--role</span>
            <span className="rotating-word" id="rotWord">B2C Subscription Legend</span>
          </div>
          <button className="ask-btn" onClick={openChat}>&gt; ask_me</button>
        </div>

        <div id="chat" style={{ display: 'none' }}>
          <div className="chat-header">
            <span className="chat-title">charles_clone — interactive session — tty1</span>
            <button className="chat-close" onClick={closeChat}>[x] close</button>
          </div>
          <div className="chat-messages" id="chatMessages"></div>
          <div className="chat-suggestions" id="chatSuggestions">
            <button className="sug" onClick={(e) => sendQ(e.currentTarget)}>Résume ton parcours</button>
            <button className="sug" onClick={(e) => sendQ(e.currentTarget)}>Quelles sont tes principales réussites ?</button>
            <button className="sug" onClick={(e) => sendQ(e.currentTarget)}>Cite moi un livre qui t&apos;a marqué</button>
            <button className="sug" onClick={(e) => sendQ(e.currentTarget)}>Summarise your background</button>
            <button className="sug" onClick={(e) => sendQ(e.currentTarget)}>What are your key achievements?</button>
            <button className="sug" onClick={(e) => sendQ(e.currentTarget)}>Name a book that marked you</button>
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
