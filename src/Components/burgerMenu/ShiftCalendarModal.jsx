import { useState, useEffect } from 'react'
import {
  Overlay, Modal,
  Header, HeaderTitle, CloseBtn, Body,
  SectionLabel,
  ShiftGrid, ShiftBtn, ShiftIcon, ShiftLabel,
  MonthNav, NavBtn, MonthTitle,
  DayHeaders, DayHeader, CalGrid, DayCell, DayNum, DayIcon,
  Legend, LegendItem, LegendDot, LegendText,
  SaveBtn,
} from './ShiftCalendarModal.styled'

// ── Constants ────────────────────────────────────────────
const CYCLE = ['shift1', 'shift2', 'dayoff1', 'dayoff2']

const SHIFT_CONFIG = {
  shift1:  { label: '1 зміна',    icon: '☀️', bg: '#fef08a', border: '#f59e0b', text: '#713f12' },
  shift2:  { label: '2 зміна',    icon: '🌙', bg: '#bfdbfe', border: '#3b82f6', text: '#1e3a5f' },
  dayoff1: { label: '1 вихідний', icon: '🛏️', bg: '#4ade80', border: '#16a34a', text: '#14532d' },
  dayoff2: { label: '2 вихідний', icon: '🎪', bg: '#4ade80', border: '#16a34a', text: '#14532d' },
}

const LEGEND_ITEMS = [
  { key: 'shift1', ...SHIFT_CONFIG.shift1 },
  { key: 'shift2', ...SHIFT_CONFIG.shift2 },
  { key: 'dayoff', label: 'Вихідний', bg: '#4ade80', border: '#16a34a' },
]

const MONTHS_UK = [
  'Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень',
  'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень',
]
const DAYS_UK = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд']

const LS_KEY = 'shiftCalendar_v1'

// ── Helpers ──────────────────────────────────────────────
function getShiftForDate(targetDate, anchorDate, anchorIdx) {
  const diff = Math.round((targetDate - anchorDate) / 86400000)
  return CYCLE[((anchorIdx + diff) % 4 + 4) % 4]
}

function buildCells(year, month) {
  const firstDow = (new Date(year, month, 1).getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = Array(firstDow).fill(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d))
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

// ── Component ────────────────────────────────────────────
export const ShiftCalendarModal = ({ onClose }) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [anchorIdx, setAnchorIdx] = useState(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY)
      if (raw) {
        const { anchorDate, anchorShiftIndex } = JSON.parse(raw)
        const stored = new Date(anchorDate)
        stored.setHours(0, 0, 0, 0)
        const diff = Math.round((today - stored) / 86400000)
        setAnchorIdx(((anchorShiftIndex + diff) % 4 + 4) % 4)
      }
    } catch {}
  }, [])

  const handleSelect = (idx) => { setAnchorIdx(idx); setSaved(false) }

  const handleSave = () => {
    if (anchorIdx === null) return
    localStorage.setItem(LS_KEY, JSON.stringify({
      anchorDate: today.toISOString(),
      anchorShiftIndex: anchorIdx,
    }))
    setSaved(true)
  }

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) }
    else setViewMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) }
    else setViewMonth(m => m + 1)
  }

  const cells = buildCells(viewYear, viewMonth)
  const todayStr = today.toDateString()

  return (
    <>
      <Overlay onClick={onClose} />

      <Modal>
        <Header>
          <HeaderTitle>📅 Календар змін</HeaderTitle>
          <CloseBtn onClick={onClose}>✕</CloseBtn>
        </Header>

        <Body>
          <SectionLabel>
            Сьогодні — {today.toLocaleDateString('uk-UA', { day: 'numeric', month: 'long' })}
          </SectionLabel>

          {/* Shift selector */}
          <ShiftGrid>
            {CYCLE.map((key, idx) => {
              const cfg = SHIFT_CONFIG[key]
              const sel = anchorIdx === idx
              return (
                <ShiftBtn
                  key={key}
                  $selected={sel}
                  $bg={cfg.bg}
                  $border={cfg.border}
                  onClick={() => handleSelect(idx)}
                >
                  <ShiftIcon>{cfg.icon}</ShiftIcon>
                  <ShiftLabel $selected={sel} $text={cfg.text}>{cfg.label}</ShiftLabel>
                </ShiftBtn>
              )
            })}
          </ShiftGrid>

          {/* Month navigator */}
          <MonthNav>
            <NavBtn onClick={prevMonth}>‹</NavBtn>
            <MonthTitle>{MONTHS_UK[viewMonth]} {viewYear}</MonthTitle>
            <NavBtn onClick={nextMonth}>›</NavBtn>
          </MonthNav>

          {/* Day-of-week headers */}
          <DayHeaders>
            {DAYS_UK.map(d => <DayHeader key={d}>{d}</DayHeader>)}
          </DayHeaders>

          {/* Calendar grid */}
          <CalGrid>
            {cells.map((date, i) => {
              if (!date) return <div key={i} />
              const isToday = date.toDateString() === todayStr
              const shiftKey = anchorIdx !== null ? getShiftForDate(date, today, anchorIdx) : null
              const cfg = shiftKey ? SHIFT_CONFIG[shiftKey] : null

              return (
                <DayCell key={i} $bg={cfg?.bg} $isToday={isToday}>
                  <DayNum $isToday={isToday} $color={cfg?.text}>{date.getDate()}</DayNum>
                  {cfg && <DayIcon>{cfg.icon}</DayIcon>}
                </DayCell>
              )
            })}
          </CalGrid>

          {/* Legend */}
          <Legend>
            {LEGEND_ITEMS.map(item => (
              <LegendItem key={item.key}>
                <LegendDot $bg={item.bg} $border={item.border} />
                <LegendText>{item.label}</LegendText>
              </LegendItem>
            ))}
          </Legend>

          {/* Save */}
          <SaveBtn
            $saved={saved}
            $active={anchorIdx !== null}
            onClick={handleSave}
            disabled={anchorIdx === null}
          >
            {saved ? '✓ Збережено' : 'Зберегти'}
          </SaveBtn>
        </Body>
      </Modal>
    </>
  )
}
