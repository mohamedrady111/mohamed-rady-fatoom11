import React, { useEffect, useRef, useState } from 'react';

interface SplashScreenProps {
  durationMs?: number;
  onFinish: () => void;
  onUserTap?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  durationMs = 12000,
  onFinish,
  onUserTap,
}) => {
  const [hiding, setHiding] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(Math.ceil(durationMs / 1000));
  const [progress, setProgress] = useState(0);
  const doneRef = useRef(false);
  const onFinishRef = useRef(onFinish);
  const onUserTapRef = useRef(onUserTap);

  useEffect(() => {
    onFinishRef.current = onFinish;
  }, [onFinish]);

  useEffect(() => {
    onUserTapRef.current = onUserTap;
  }, [onUserTap]);

  const triggerHide = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    setHiding(true);
    window.setTimeout(() => {
      onFinishRef.current();
    }, 720);
  };

  useEffect(() => {
    const start = performance.now();
    const interval = window.setInterval(() => {
      const elapsed = performance.now() - start;
      const pct = Math.min(100, (elapsed / durationMs) * 100);
      const left = Math.max(0, Math.ceil((durationMs - elapsed) / 1000));
      setProgress(pct);
      setSecondsLeft(left);
      if (elapsed >= durationMs) {
        window.clearInterval(interval);
        triggerHide();
      }
    }, 100);

    const safetyTimeout = window.setTimeout(() => {
      triggerHide();
    }, durationMs + 400);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(safetyTimeout);
    };
  }, [durationMs]);

  return (
    <div
      id="splash"
      role="presentation"
      className={hiding ? 'hide' : undefined}
      onClick={() => {
        onUserTapRef.current?.();
        triggerHide();
      }}
    >
      <i className="sh">💗</i>
      <i className="sh">💘</i>
      <i className="sh">💕</i>
      <i className="sh">🩷</i>
      <i className="sh">💞</i>
      <i className="sh">💖</i>
      <i className="sh">💗</i>
      <i className="sh">💘</i>

      <svg
        className="logo"
        viewBox="0 0 512 512"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="spGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>
        <circle
          cx="256"
          cy="256"
          r="150"
          fill="none"
          stroke="#fbbf24"
          strokeWidth="4"
          strokeOpacity="0.3"
        />
        <g className="ring" fill="url(#spGold)">
          <circle cx="256" cy="106" r="22" />
          <circle cx="341" cy="132" r="20" />
          <circle cx="398" cy="202" r="20" />
          <circle cx="406" cy="286" r="20" />
          <circle cx="359" cy="358" r="20" />
          <circle cx="282" cy="398" r="20" />
          <circle cx="198" cy="390" r="20" />
          <circle cx="130" cy="342" r="20" />
          <circle cx="106" cy="256" r="20" />
          <circle cx="132" cy="171" r="20" />
          <circle cx="190" cy="118" r="20" />
        </g>
        <g className="moon" fill="#fef08a">
          <path d="M 270 200 A 60 60 0 1 0 270 312 A 48 48 0 1 1 270 200 Z" />
          <polygon points="280,240 286,252 299,253 289,262 292,274 280,267 268,274 271,262 261,253 274,252" />
        </g>
      </svg>

      <span className="bead">📿</span>
      <h1>السبحة الإلكترونية الأسطورية</h1>
      <p className="ed">MOHAMED &amp; FATOUM 💘</p>

      <div className="pill">
        <span>۝</span>
        <b>« ﴿مُـحَـمَّـد رَاضِـي﴾ »</b>
        <span>۝</span>
        <em>🦊✨</em>
      </div>

      <div className="pill f">
        <span>۝</span>
        <b>« ﴿فُـطُـوم﴾ »</b>
        <span>۝</span>
        <em>🦦💗</em>
        <i>فَاطِمَة عَلَاء</i>
      </div>

      <p className="for">مني مُحَمَّد رَاضِي لـ فطوم 💗</p>
      <p className="dhikr">سبحان الله وبحمده، سبحان الله العظيم</p>
      <p className="load">جاري تهيئة عالم النور والذكر...</p>

      <div className="sp-progress-wrap" aria-hidden="true">
        <div className="sp-progress-bar" style={{ width: `${progress}%` }} />
      </div>

      <small>اضغط في أي مكان للتخطي ({secondsLeft}ث)</small>
    </div>
  );
};
