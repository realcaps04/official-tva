import { useState, useEffect, useRef } from 'react';
import './Chatbot.css';

const STEP = { IDLE: 'idle', ASK_NAME: 'ask_name', NAMED: 'named' };

const SUBJECTS = ['Bug Report', 'Help Request', 'Suggestion', 'Report User', 'Other'];

const MAIN_OPTIONS = [
  { id: 'support',  label: 'Support'   },
  { id: 'features', label: 'Features'  },
  { id: 'links',    label: 'Links'     },
  { id: 'about',    label: 'About TVA' },
];

const OPTION_REPLIES = {
  features: {
    text: 'The site has: Tournaments tracker, Highlights gallery, Crew roster, Our Stuff (drip + vehicles + servers), and more coming soon.',
    options: [{ id: 'back', label: 'Back to menu' }],
  },
  links: {
    text: 'Quick links — check the Navbar: Tournaments, Highlights, Crew, Our Stuff. Social links are pinned in the footer.',
    options: [{ id: 'back', label: 'Back to menu' }],
  },
  about: {
    text: 'TVA is a GTA RP gang and esports crew based in India. We compete in PUBG, run on Xlantis City FiveM, and create content across YouTube and Instagram.',
    options: [{ id: 'back', label: 'Back to menu' }],
  },
};

const WELCOME = { id: 'w1', from: 'bot', text: 'Yo! Welcome to TVA. Got questions? Drop them.' };

function getBotReply(step, userName, userText, optionId) {
  if (optionId && optionId !== 'back' && optionId !== 'support' && OPTION_REPLIES[optionId]) {
    return { ...OPTION_REPLIES[optionId], id: Date.now() + 'b', from: 'bot' };
  }
  if (optionId === 'back') {
    return { id: Date.now() + 'b', from: 'bot', text: 'What else can I help you with?', options: MAIN_OPTIONS };
  }
  if (step === STEP.IDLE) {
    return { id: Date.now() + 'b', from: 'bot', text: 'Please share your name ', nextStep: STEP.ASK_NAME };
  }
  if (step === STEP.ASK_NAME) {
    const name = userText.trim() || 'Stranger';
    return { id: Date.now() + 'b', from: 'bot', text: `Wassup ${name}! Welcome to the TVA family. How can I help you today?`, options: MAIN_OPTIONS, nextStep: STEP.NAMED, name };
  }
  const lower = userText.toLowerCase();
  if (lower.includes('tournament')) return { id: Date.now() + 'b', from: 'bot', text: 'Check the Tournaments page — TVA already ran PUBG x Xlantis 2026! More coming soon.', options: MAIN_OPTIONS };
  if (lower.includes('crew') || lower.includes('member')) return { id: Date.now() + 'b', from: 'bot', text: 'Head to the Crew page to meet the squad — Demon, Goku, Savage, Ash and the whole gang.', options: MAIN_OPTIONS };
  if (lower.includes('merch') || lower.includes('stuff') || lower.includes('drip')) return { id: Date.now() + 'b', from: 'bot', text: 'Peep the "Our Stuff" page for Dress Collections, Gang Vehicles and Xlantis City server info.', options: MAIN_OPTIONS };
  if (lower.includes('highlight') || lower.includes('video') || lower.includes('clip')) return { id: Date.now() + 'b', from: 'bot', text: 'Highlights page has all the fire clips — gang wars, chases, heists. Go watch.', options: MAIN_OPTIONS };
  if (lower.includes('server') || lower.includes('fivem') || lower.includes('xlantis')) return { id: Date.now() + 'b', from: 'bot', text: "Xlantis City is TVA's official FiveM GTA RP server. Check it in Our Stuff → FiveM Servers.", options: MAIN_OPTIONS };
  return { id: Date.now() + 'b', from: 'bot', text: `Noted! Anything else I can help you with, ${userName}?`, options: MAIN_OPTIONS };
}

/* ══════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════ */
export default function Chatbot() {
  const [open, setOpen]             = useState(false);
  const [messages, setMessages]     = useState([WELCOME]);
  const [input, setInput]           = useState('');
  const [step, setStep]             = useState(STEP.IDLE);
  const [userName, setUserName]     = useState('');
  const [typing, setTyping]         = useState(false);
  const [unread, setUnread]         = useState(0);
  const [supportOpen, setSupportOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, typing]);
  useEffect(() => {
    if (open) { setUnread(0); setTimeout(() => inputRef.current?.focus(), 200); }
  }, [open]);

  function newChat() {
    setMessages([WELCOME]); setStep(STEP.IDLE); setUserName(''); setInput('');
  }

  function dispatch(userText, optionId = null) {
    if (!userText && !optionId) return;

    /* Support opens modal instead */
    if (optionId === 'support') { setSupportOpen(true); return; }

    setTyping(true);
    if (userText) {
      setMessages(prev => [...prev, { id: Date.now() + 'u', from: 'user', text: userText }]);
      setInput('');
    }
    setTimeout(() => {
      const reply = getBotReply(step, userName, userText || '', optionId);
      setTyping(false);
      setMessages(prev => [...prev, { id: reply.id, from: reply.from, text: reply.text, options: reply.options }]);
      if (reply.nextStep) setStep(reply.nextStep);
      if (reply.name)     setUserName(reply.name);
      if (!open)          setUnread(n => n + 1);
    }, 700);
  }

  function handleSubmit(e) { e.preventDefault(); if (input.trim()) dispatch(input.trim()); }

  function handleSupportSubmit() {
    setSupportOpen(false);
    setSuccessOpen(true);
    /* Add bot message confirming ticket */
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 'b', from: 'bot',
        text: 'Your support ticket has been submitted. The TVA team will get back to you soon.',
        options: MAIN_OPTIONS,
      }]);
    }, 400);
  }

  return (
    <>
      {/* Toggle */}
      <button className={`cb-toggle ${open ? 'open' : ''}`} onClick={() => setOpen(o => !o)} aria-label="Toggle chat">
        {open ? <CloseIcon /> : <ChatIcon />}
        {!open && unread > 0 && <span className="cb-badge">{unread}</span>}
      </button>

      {/* Chat window */}
      <div className={`cb-window ${open ? 'visible' : ''}`}>

        {/* Header */}
        <div className="cb-header">
          <div className="cb-header-avatar">
            <img src="/images/bot_avatar.png" alt="Thakkudu Sahayi" />
          </div>
          <div className="cb-header-info">
            <span className="cb-header-name">Thakkudu Sahayi</span>
            <span className="cb-header-status"><span className="cb-online-dot" />Online</span>
          </div>
          <button className="cb-new-chat-btn" onClick={newChat} title="New chat" aria-label="New chat"><NewChatIcon /></button>
          <button className="cb-close-btn" onClick={() => setOpen(false)} aria-label="Close"><CloseIcon /></button>
        </div>

        {/* Messages */}
        <div className="cb-messages">
          {messages.map(msg => (
            <div key={msg.id}>
              <div className={`cb-msg ${msg.from}`}>
                {msg.from === 'bot' && <div className="cb-bot-avatar"><img src="/images/bot_avatar.png" alt="bot" /></div>}
                <div className="cb-bubble">{msg.text}</div>
              </div>
              {msg.options?.length > 0 && (
                <div className="cb-options">
                  {msg.options.map(opt => (
                    <button key={opt.id} className="cb-option-btn" onClick={() => dispatch(null, opt.id)}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          {typing && (
            <div className="cb-msg bot">
              <div className="cb-bot-avatar"><img src="/images/bot_avatar.png" alt="bot" /></div>
              <div className="cb-bubble cb-typing"><span /><span /><span /></div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form className="cb-input-bar" onSubmit={handleSubmit}>
          <input ref={inputRef} className="cb-input" value={input} onChange={e => setInput(e.target.value)}
            placeholder={step === STEP.ASK_NAME ? 'Enter your name...' : 'Ask something...'} autoComplete="off" />
          <button type="submit" className="cb-send" disabled={!input.trim()}><SendIcon /></button>
        </form>

        {/* ── Support Modal ── */}
        {supportOpen && (
          <div className="sp-overlay" onClick={() => setSupportOpen(false)}>
            <div className="sp-modal" onClick={e => e.stopPropagation()}>
              <div className="sp-header">
                <span className="sp-title">Contact Support</span>
                <button className="sp-close" onClick={() => setSupportOpen(false)}><CloseIcon /></button>
              </div>

              <SupportForm onSubmit={handleSupportSubmit} onCancel={() => setSupportOpen(false)} subjects={SUBJECTS} />
            </div>
          </div>
        )}
      </div>

      {/* ── Success Popup ── */}
      {successOpen && (
        <div className="sc-overlay" onClick={() => setSuccessOpen(false)}>
          <div className="sc-popup" onClick={e => e.stopPropagation()}>
            <div className="sc-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="32" height="32">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h3 className="sc-title">Ticket Submitted!</h3>
            <p className="sc-sub">The TVA team will review your message and get back to you soon.</p>
            <button className="sc-btn" onClick={() => setSuccessOpen(false)}>Got it</button>
          </div>
        </div>
      )}
    </>
  );
}

/* ── Support Form ─────────────────────────────── */
function SupportForm({ onSubmit, onCancel, subjects }) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError]     = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!subject) { setError('Please select a subject.'); return; }
    if (!message.trim()) { setError('Please enter a message.'); return; }
    setError('');
    onSubmit({ subject, message });
  }

  return (
    <form className="sp-form" onSubmit={handleSubmit}>
      <label className="sp-label">Subject</label>
      <div className="sp-subjects">
        {subjects.map(s => (
          <button
            key={s} type="button"
            className={`sp-subject-btn ${subject === s ? 'active' : ''}`}
            onClick={() => { setSubject(s); setError(''); }}
          >
            {s}
          </button>
        ))}
      </div>

      <label className="sp-label" style={{ marginTop: 14 }}>Message</label>
      <textarea
        className="sp-textarea"
        placeholder="Describe your issue or suggestion..."
        value={message}
        onChange={e => { setMessage(e.target.value); setError(''); }}
        rows={4}
      />

      {error && <p className="sp-error">{error}</p>}

      <div className="sp-actions">
        <button type="button" className="sp-cancel-btn" onClick={onCancel}>Cancel</button>
        <button type="submit" className="sp-submit-btn">Submit</button>
      </div>
    </form>
  );
}

/* ── Icons ───────────────────────────────────── */
function NewChatIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      <line x1="12" y1="8" x2="12" y2="14"/><line x1="9" y1="11" x2="15" y2="11"/>
    </svg>
  );
}
function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="24" height="24">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="18" height="18">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}
function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" width="18" height="18">
      <line x1="22" y1="2" x2="11" y2="13"/>
      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  );
}
