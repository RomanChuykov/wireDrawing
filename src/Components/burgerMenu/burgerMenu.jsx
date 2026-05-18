import { useState } from 'react'
import { HistoryModal } from './HistoryModal'
import { DeleteDayModal } from './DeleteDayModal'
import { ShiftCalendarModal } from './ShiftCalendarModal'

export const BurgerMenu = () => {

  const [isOpen, setIsOpen] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [showDeleteDay, setShowDeleteDay] = useState(false)
  const [showShiftCalendar, setShowShiftCalendar] = useState(false)

  const menuItems = [
    {/* label: '🏠 Головна', href: '#', onClick: null*/ },
    {
      label: '🗑️ Видалити день',
      href: null,
      onClick: () => { setIsOpen(false); setShowDeleteDay(true) }
    },
    { label: '📋 Історія змін', href: null, onClick: () => { setIsOpen(false); setShowHistory(true) } },
    { label: '📅 Календар змін', href: null, onClick: () => { setIsOpen(false); setShowShiftCalendar(true) } },
    { /*label: '⚙️ Налаштування', href: '#settings', onClick: null */},
    { /*label: 'ℹ️ Про програму', href: '#about', onClick: null*/ },
  ]

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '24px', padding: '4px 8px' }}
        aria-label="Меню"
      >
        ☰
      </button>

      {isOpen && (
        <>
          <div
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed', inset: 0,
              backgroundColor: 'rgba(0,0,0,0.4)',
              zIndex: 200,
            }}
          />
          <div style={{
            position: 'fixed', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#fff',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            minWidth: '240px',
            zIndex: 201,
            overflow: 'hidden',
          }}>
            <div style={{ padding: '16px', borderBottom: '1px solid #eee', fontWeight: 'bold', fontSize: '16px' }}>
              Меню
            </div>
            {menuItems.map((item, i) => {
              const sharedStyle = {
                display: 'block', padding: '14px 20px', color: '#333',
                textDecoration: 'none', fontSize: '15px', cursor: 'pointer',
                borderBottom: i < menuItems.length - 1 ? '1px solid #f0f0f0' : 'none',
                background: 'none', border: 'none', width: '100%', textAlign: 'left',
              }
              if (item.onClick) {
                return <button key={i} style={sharedStyle} onClick={item.onClick}>{item.label}</button>
              }
              return <a key={i} href={item.href} onClick={() => setIsOpen(false)} style={sharedStyle}>{item.label}</a>
            })}
          </div>
        </>
      )}

      {showHistory && <HistoryModal onClose={() => setShowHistory(false)} />}

      {showDeleteDay && (
        <DeleteDayModal
          onClose={() => setShowDeleteDay(false)}
          onDeleted={() => {}}
        />
      )}

      {showShiftCalendar && (
        <ShiftCalendarModal onClose={() => setShowShiftCalendar(false)} />
      )}
    </>
  )
}
