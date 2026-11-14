import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initLoveStage } from './lib/loveStage';

if ('serviceWorker' in navigator && window.location.protocol !== 'file:') {
  const checkSwUpdates = () => {
    navigator.serviceWorker
      .getRegistrations?.()
      .then((regs) => regs.forEach((reg) => void reg.update()))
      .catch(() => {});
  };
  checkSwUpdates();
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') checkSwUpdates();
  });

  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return;
    refreshing = true;
    window.location.reload();
  });
}

initLoveStage();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
