import { useState, useEffect } from 'react'

export const DeleteDayModal = ({ onClose, onDeleted }) => {
  const [shifts, setShifts] = useState([])
  const [selectedDates, setSelectedDates] = useState(new Set())
  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = new Date()
    return { year: d.getFullYear(), month: d.getMonth() }
  })
  const [confirmed, setConfirmed] = useState(false)

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('workShifts')) || []
    setShifts(saved)
    // Переходимо на місяць із останнім записом
    if (saved.length > 0) {
      const lastDate = new Date(saved[saved.length - 1].shiftDate)
      setCurrentMonth({ year: lastDate.getFullYear(), month: lastDate.getMonth() })
    }
  }, [])

  // Всі дати, що мають записи
  const shiftDates = new Set(shifts.map(s => s.shiftDate))

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate()
  const getFirstDayOfWeek = (year, month) => {
    const day = new Date(year, month, 1).getDay()
    return day === 0 ? 6 : day - 1 // пн=0 ... нд=6
  }

  const formatDate = (year, month, day) => {
    const mm = String(month + 1).padStart(2, '0')
    const dd = String(day).padStart(2, '0')
    return `${year}-${mm}-${dd}`
  }

  const toggleDate = (dateStr) => {
    if (!shiftDates.has(dateStr)) return
    setSelectedDates(prev => {
      const next = new Set(prev)
      next.has(dateStr) ? next.delete(dateStr) : next.add(dateStr)
      return next
    })
  }

  const prevMonth = () => {
    setCurrentMonth(({ year, month }) =>
      month === 0 ? { year: year - 1, month: 11 } : { year, month: month - 1 }
    )
  }

  const nextMonth = () => {
    setCurrentMonth(({ year, month }) =>
      month === 11 ? { year: year + 1, month: 0 } : { year, month: month + 1 }
    )
  }

  const handleDelete = () => {
    if (selectedDates.size === 0) return
    if (!confirmed) { setConfirmed(true); return }

    const updated = shifts.filter(s => !selectedDates.has(s.shiftDate))
    localStorage.setItem('workShifts', JSON.stringify(updated))
    onDeleted?.()
    onClose()
  }

  const { year, month } = currentMonth
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfWeek(year, month)
  const monthNames = ['Січень','Лютий','Березень','Квітень','Травень','Червень',
                      'Липень','Серпень','Вересень','Жовтень','Листопад','Грудень']
  const weekDays = ['Пн','Вт','Ср','Чт','Пт','Сб','Нд']

  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  const selectedList = [...selectedDates].sort()

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 300,
          backdropFilter: 'blur(2px)',
        }}
      />

      {/* Modal */}
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#fff',
        borderRadius: '16px',
        boxShadow: '0 12px 48px rgba(0,0,0,0.25)',
        width: 'min(400px, 95vw)',
        zIndex: 301,
        overflow: 'hidden',
        fontFamily: 'sans-serif',
      }}>

        {/* Header */}
        <div style={{
          padding: '18px 20px',
          borderBottom: '1px solid #eee',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div style={{ fontWeight: 700, fontSize: '16px', color: '#c0392b' }}>
            🗑️ Видалити дні
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#999', lineHeight: 1 }}
          >×</button>
        </div>

        <div style={{ padding: '16px 20px' }}>

          {/* Month nav */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <button onClick={prevMonth} style={navBtnStyle}>‹</button>
            <span style={{ fontWeight: 600, fontSize: '15px', color: '#333' }}>
              {monthNames[month]} {year}
            </span>
            <button onClick={nextMonth} style={navBtnStyle}>›</button>
          </div>

          {/* Weekday headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginBottom: '4px' }}>
            {weekDays.map(d => (
              <div key={d} style={{ textAlign: 'center', fontSize: '11px', fontWeight: 600, color: '#999', padding: '4px 0' }}>
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
            {cells.map((day, i) => {
              if (!day) return <div key={`empty-${i}`} />
              const dateStr = formatDate(year, month, day)
              const hasShift = shiftDates.has(dateStr)
              const isSelected = selectedDates.has(dateStr)
              const today = new Date().toISOString().split('T')[0]
              const isToday = dateStr === today

              return (
                <button
                  key={dateStr}
                  onClick={() => toggleDate(dateStr)}
                  style={{
                    padding: '6px 2px',
                    borderRadius: '8px',
                    border: isToday ? '2px solid #3498db' : '2px solid transparent',
                    cursor: hasShift ? 'pointer' : 'default',
                    fontSize: '13px',
                    fontWeight: hasShift ? 600 : 400,
                    backgroundColor: isSelected
                      ? '#e74c3c'
                      : hasShift
                      ? '#ffeaea'
                      : 'transparent',
                    color: isSelected ? '#fff' : hasShift ? '#c0392b' : '#ccc',
                    transition: 'all 0.15s',
                    position: 'relative',
                  }}
                  title={hasShift ? `${dateStr} — є запис` : ''}
                >
                  {day}
                  {hasShift && !isSelected && (
                    <span style={{
                      position: 'absolute', bottom: '2px', left: '50%',
                      transform: 'translateX(-50%)',
                      width: '4px', height: '4px', borderRadius: '50%',
                      backgroundColor: '#e74c3c', display: 'block',
                    }} />
                  )}
                </button>
              )
            })}
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '10px', fontSize: '11px', color: '#888' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ffeaea', border: '1px solid #e74c3c', display: 'inline-block' }} />
              є запис
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#e74c3c', display: 'inline-block' }} />
              вибрано
            </span>
          </div>

          {/* Selected list */}
          {selectedDates.size > 0 && (
            <div style={{
              marginTop: '14px',
              padding: '10px 12px',
              backgroundColor: '#fff5f5',
              borderRadius: '8px',
              border: '1px solid #f5c6c6',
            }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#c0392b', marginBottom: '6px' }}>
                Вибрано до видалення ({selectedDates.size}):
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {selectedList.map(d => (
                  <span
                    key={d}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '4px',
                      padding: '3px 8px', backgroundColor: '#e74c3c', color: '#fff',
                      borderRadius: '6px', fontSize: '12px', fontWeight: 500,
                    }}
                  >
                    {d}
                    <button
                      onClick={() => toggleDate(d)}
                      style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 0, fontSize: '12px', lineHeight: 1, opacity: 0.8 }}
                    >×</button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Confirm warning */}
          {confirmed && selectedDates.size > 0 && (
            <div style={{
              marginTop: '12px',
              padding: '10px 12px',
              backgroundColor: '#fff3cd',
              borderRadius: '8px',
              border: '1px solid #ffc107',
              fontSize: '13px',
              color: '#856404',
            }}>
              ⚠️ Підтвердіть! Ці дані буде видалено назавжди. Натисніть ще раз щоб підтвердити.
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '12px 20px',
          borderTop: '1px solid #eee',
          display: 'flex', justifyContent: 'space-between', gap: '10px',
        }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: '10px', borderRadius: '8px',
              border: '1px solid #ddd', background: '#f8f8f8',
              cursor: 'pointer', fontSize: '14px', color: '#555',
            }}
          >
            Скасувати
          </button>
          <button
            onClick={handleDelete}
            disabled={selectedDates.size === 0}
            style={{
              flex: 1, padding: '10px', borderRadius: '8px',
              border: 'none',
              background: selectedDates.size === 0 ? '#ddd' : confirmed ? '#c0392b' : '#e74c3c',
              color: selectedDates.size === 0 ? '#999' : '#fff',
              cursor: selectedDates.size === 0 ? 'not-allowed' : 'pointer',
              fontSize: '14px', fontWeight: 600,
              transition: 'background 0.2s',
            }}
          >
            {confirmed ? '⚠️ Підтвердити' : `🗑️ Видалити (${selectedDates.size})`}
          </button>
        </div>
      </div>
    </>
  )
}

const navBtnStyle = {
  background: 'none', border: '1px solid #eee', borderRadius: '6px',
  width: '30px', height: '30px', cursor: 'pointer', fontSize: '16px',
  color: '#555', display: 'flex', alignItems: 'center', justifyContent: 'center',
  padding: 0,
}
