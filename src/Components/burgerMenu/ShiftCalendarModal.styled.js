import styled, { keyframes } from 'styled-components'

// ── Animation ────────────────────────────────────────────
export const fadeIn = keyframes`
  from { opacity: 0; transform: translate(-50%, -48%) scale(0.97); }
  to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
`

// ── Layout ───────────────────────────────────────────────
export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 300;
  background: rgba(30, 40, 60, 0.45);
  backdrop-filter: blur(4px);
`

export const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 301;
  width: 358px;
  max-width: 96vw;
  background: #ffffff;
  border-radius: 22px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.14), 0 0 0 1px rgba(0, 0, 0, 0.06);
  font-family: 'Nunito', 'Segoe UI', system-ui, sans-serif;
  color: #1a1a2e;
  overflow: hidden;
  animation: ${fadeIn} 0.2s ease;
`

export const Header = styled.div`
  padding: 16px 18px 14px;
  border-bottom: 1px solid #f0f0f4;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fafafa;
`

export const HeaderTitle = styled.span`
  font-weight: 800;
  font-size: 16px;
  letter-spacing: -0.2px;
  color: #1a1a2e;
`

export const Body = styled.div`
  padding: 14px 16px 18px;
  background: #ffffff;
`

// ── Buttons ──────────────────────────────────────────────
export const CloseBtn = styled.button`
  background: #f0f0f4;
  border: none;
  border-radius: 8px;
  width: 28px;
  height: 28px;
  color: #6b7280;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;

  &:hover {
    background: #e4e4ec;
  }
`

export const NavBtn = styled.button`
  background: #f0f0f4;
  border: none;
  border-radius: 8px;
  width: 32px;
  height: 32px;
  color: #374151;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;

  &:hover {
    background: #e4e4ec;
  }
`

export const SaveBtn = styled.button`
  margin-top: 14px;
  width: 100%;
  padding: 13px;
  border-radius: 11px;
  border: none;
  background: ${p =>
    p.$saved  ? '#16a34a' :
    p.$active ? '#1a1a2e' :
    '#f0f0f4'
  };
  color: ${p =>
    p.$saved  ? '#ffffff' :
    p.$active ? '#ffffff' :
    '#9ca3af'
  };
  font-size: 14px;
  font-weight: 800;
  cursor: ${p => p.$active ? 'pointer' : 'default'};
  transition: background 0.2s, color 0.2s;
  letter-spacing: -0.2px;

  &:hover {
    background: ${p =>
      p.$saved  ? '#15803d' :
      p.$active ? '#2d2d4e' :
      '#f0f0f4'
    };
  }
`

// ── Section label ────────────────────────────────────────
export const SectionLabel = styled.div`
  font-size: 11px;
  font-weight: 700;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  margin-bottom: 8px;
`

// ── Shift selector ───────────────────────────────────────
export const ShiftGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
  margin-bottom: 16px;
`

export const ShiftBtn = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  background: ${p => p.$selected ? p.$bg : '#f7f7f9'};
  border: 2px solid ${p => p.$selected ? p.$border : '#ebebf0'};
  border-radius: 11px;
  padding: 9px 4px 7px;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    background: ${p => p.$selected ? p.$bg : '#f0f0f5'};
    border-color: ${p => p.$selected ? p.$border : '#d8d8e4'};
  }
`

export const ShiftIcon = styled.span`
  font-size: 18px;
  line-height: 1;
`

export const ShiftLabel = styled.span`
  font-size: 10px;
  font-weight: 700;
  line-height: 1.25;
  text-align: center;
  color: ${p => p.$selected ? p.$text : '#9ca3af'};
`

// ── Month navigator ──────────────────────────────────────
export const MonthNav = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`

export const MonthTitle = styled.span`
  font-weight: 800;
  font-size: 15px;
  color: #1a1a2e;
`

// ── Calendar grid ────────────────────────────────────────
export const DayHeaders = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  margin-bottom: 3px;
`

export const DayHeader = styled.div`
  text-align: center;
  font-size: 10px;
  font-weight: 700;
  color: #b0b8c8;
  padding: 2px 0;
`

export const CalGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 3px;
`

export const DayCell = styled.div`
  border-radius: 7px;
  background: ${p => p.$bg || '#f7f7f9'};
  border: 2px solid ${p => p.$isToday ? '#1a1a2e' : 'transparent'};
  min-height: 38px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1px;
`

export const DayNum = styled.span`
  font-size: 12px;
  font-weight: ${p => p.$isToday ? 900 : 600};
  color: ${p => p.$color || '#b0b8c8'};
  line-height: 1;
`

export const DayIcon = styled.span`
  font-size: 9px;
  line-height: 1;
`

// ── Legend ───────────────────────────────────────────────
export const Legend = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
`

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`

export const LegendDot = styled.div`
  width: 11px;
  height: 11px;
  border-radius: 3px;
  background: ${p => p.$bg};
  border: 1px solid ${p => p.$border};
  flex-shrink: 0;
`

export const LegendText = styled.span`
  font-size: 10px;
  color: #9ca3af;
`
