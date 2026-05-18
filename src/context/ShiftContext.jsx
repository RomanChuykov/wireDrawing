import { createContext, useContext, useState } from 'react';

const ShiftContext = createContext(null);

// ── Утиліта (потрібна кільком компонентам) ─────────────────────────────────
export function formatDecimal(digits, decimals = 2) {
  if (!digits) return '0.00';
  return (parseInt(digits, 10) / Math.pow(10, decimals)).toFixed(decimals);
}

// ── Провайдер ─────────────────────────────────────────────────────────────
export function ShiftProvider({ children }) {
  const load = () => {
    try { return JSON.parse(localStorage.getItem('currentShift')) || {}; }
    catch { return {}; }
  };

  const [spools, setSpools] = useState(() => load().spools ?? []);
  const [results, setResults] = useState(() => load().results ?? []);
  const [diameterDigits, setDiameterDigits] = useState(() => load().diameterDigits ?? '');
  const [price, setPrice] = useState(() => load().price ?? '');
  const [findDiameter, setFindDiameter] = useState(() => load().findDiameter ?? '');
  const [speed, setSpeed] = useState(() => load().speed ?? '');
  const [production, setProduction] = useState(() => load().production ?? '');
  const [timeNorm, setTimeNorm] = useState(() => load().timeNorm ?? '');

  const getToday = () => new Date().toISOString().split('T')[0];
  const [today, setToday] = useState(getToday());

  // ── Розрахунки (доступні всім) ────────────────────────────────────────────
  const currentTons  = spools.reduce((sum, s) => sum + s.massa / 1000, 0);
  const currentMoney = currentTons * (Number(price) || 0);
  const currentCount = spools.length;
  const grandTotalTons  = results.reduce((sum, r) => sum + (r.totalTons  || 0), 0) + currentTons;
  const grandTotalMoney = results.reduce((sum, r) => sum + (r.totalMoney || 0), 0) + currentMoney;

  // ── Збереження поточної зміни в localStorage ─────────────────────────────
  const persistShift = (nextResults, nextSpools, extra = {}) => {
    localStorage.setItem('currentShift', JSON.stringify({
      results:        nextResults,
      spools:         nextSpools,
      date:           today,
      diameterDigits: extra.diameterDigits  ?? diameterDigits,
      price:          extra.price !== undefined ? extra.price : price,
      findDiameter:   extra.findDiameter    ?? findDiameter,
      speed:          extra.speed           ?? speed,
      production:     extra.production      ?? production,
      timeNorm:       extra.timeNorm        ?? timeNorm,
    }));
  };

  // ── Скидання після збереження зміни ──────────────────────────────────────
  const resetShift = () => {
    setResults([]); setSpools([]);
    setDiameterDigits(''); setPrice(''); setFindDiameter('');
    setSpeed(''); setProduction(''); setTimeNorm('');
  };

  return (
    <ShiftContext.Provider value={{
      // стейт
      spools, setSpools,
      results, setResults,
      diameterDigits, setDiameterDigits,
      price, setPrice,
      findDiameter, setFindDiameter,
      speed, setSpeed,
      production, setProduction,
      timeNorm, setTimeNorm,
      today, setToday,
      // розрахунки
      currentTons, currentMoney, currentCount,
      grandTotalTons, grandTotalMoney,
      // хелпери
      persistShift, resetShift,
    }}>
      {children}
    </ShiftContext.Provider>
  );
}

// ── Хук ───────────────────────────────────────────────────────────────────
export function useShift() {
  const ctx = useContext(ShiftContext);
  if (!ctx) throw new Error('useShift must be used within ShiftProvider');
  return ctx;
}
