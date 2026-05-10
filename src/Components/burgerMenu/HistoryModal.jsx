import { useState, useEffect } from 'react'

const overlayStyle = {
  position: 'fixed', inset: 0,
  backgroundColor: 'rgba(0,0,0,0.45)',
  zIndex: 300,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const modalStyle = {
  backgroundColor: '#fff',
  borderRadius: '14px',
  boxShadow: '0 8px 40px rgba(0,0,0,0.22)',
  width: '92vw',
  maxWidth: '740px',
  maxHeight: '85vh',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
}

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px 20px',
  borderBottom: '1px solid #eee',
  flexShrink: 0,
}

const closeBtnStyle = {
  background: 'none',
  border: 'none',
  fontSize: '22px',
  cursor: 'pointer',
  color: '#666',
  lineHeight: 1,
  padding: '4px',
}

const controlsStyle = {
  display: 'flex',
  gap: '12px',
  alignItems: 'center',
  padding: '14px 20px',
  borderBottom: '1px solid #eee',
  flexShrink: 0,
  flexWrap: 'wrap',
}

const inputStyle = {
  padding: '7px 12px',
  borderRadius: '8px',
  border: '1px solid #ddd',
  fontSize: '14px',
  outline: 'none',
}

const tableWrapStyle = {
  overflowY: 'auto',
  flex: 1,
}

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '14px',
}

const thStyle = {
  padding: '10px 14px',
  textAlign: 'left',
  fontWeight: '500',
  fontSize: '13px',
  color: '#888',
  borderBottom: '1px solid #eee',
  position: 'sticky',
  top: 0,
  backgroundColor: '#fff',
  whiteSpace: 'nowrap',
}

const tdStyle = {
  padding: '11px 14px',
  borderBottom: '1px solid #f4f4f4',
  color: '#333',
}

const emptyStyle = {
  textAlign: 'center',
  padding: '40px 20px',
  color: '#aaa',
  fontSize: '15px',
}

const MONTH_NAMES = [
  'Січень','Лютий','Березень','Квітень','Травень','Червень',
  'Липень','Серпень','Вересень','Жовтень','Листопад','Грудень'
]

function formatMoney(val) {
  const n = parseFloat(val)
  if (isNaN(n)) return '—'
  return n.toLocaleString('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ₴'
}

function formatNum(val, digits = 3) {
  const n = parseFloat(val)
  if (isNaN(n)) return '—'
  return n.toLocaleString('uk-UA', { minimumFractionDigits: digits, maximumFractionDigits: digits })
}

function formatPrice(val) {
  const n = parseFloat(val)
  if (isNaN(n)) return '—'
  return n.toLocaleString('uk-UA') + ' ₴'
}

/**
 * Структура workShifts у localStorage:
 * [
 *   {
 *     shiftDate: "YYYY-MM-DD",
 *     results: [
 *       { data: "YYYY-MM-DD", diameter: "1.80", price: "45000", totalTons: 1.234, totalMoney: 55530, ... }
 *     ]
 *   }
 * ]
 *
 * Поле дати у результаті — r.data (може відрізнятись від shiftDate при переході діаметра).
 * Якщо r.data відсутнє — беремо shift.shiftDate.
 */
function loadFromStorage(year, month) {
  try {
    const raw = localStorage.getItem('workShifts')
    if (!raw) return []
    const shifts = JSON.parse(raw)
    if (!Array.isArray(shifts)) return []

    const rows = []
    shifts.forEach(shift => {
      if (!Array.isArray(shift.results)) return
      shift.results.forEach(r => {
        const dateStr = r.data || shift.shiftDate || ''
        const d = new Date(dateStr)
        if (isNaN(d)) return
        if (d.getFullYear() === year && d.getMonth() + 1 === month) {
          rows.push({
            date: dateStr,
            diameter: r.diameter,
            tons: r.totalTons,
            price: r.price,
            earned: r.totalMoney,
          })
        }
      })
    })

    rows.sort((a, b) => new Date(a.date) - new Date(b.date))
    return rows
  } catch {
    return []
  }
}

export function HistoryModal({ onClose }) {
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())
  const [rows, setRows] = useState([])

  useEffect(() => {
    setRows(loadFromStorage(year, month))
  }, [year, month])

  const totalTons = rows.reduce((s, r) => s + (parseFloat(r.tons) || 0), 0)
  const totalEarned = rows.reduce((s, r) => s + (parseFloat(r.earned) || 0), 0)

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div style={overlayStyle} onClick={handleOverlayClick}>
      <div style={modalStyle} onClick={e => e.stopPropagation()}>

        <div style={headerStyle}>
          <span style={{ fontWeight: '600', fontSize: '16px' }}>📋 Історія змін</span>
          <button style={closeBtnStyle} onClick={onClose} aria-label="Закрити">✕</button>
        </div>

        <div style={controlsStyle}>
          <label style={{ fontSize: '14px', color: '#555' }}>Місяць:</label>
          <select
            value={month}
            onChange={e => setMonth(Number(e.target.value))}
            style={inputStyle}
          >
            {MONTH_NAMES.map((name, i) => (
              <option key={i + 1} value={i + 1}>{name}</option>
            ))}
          </select>

          <label style={{ fontSize: '14px', color: '#555' }}>Рік:</label>
          <input
            type="number"
            value={year}
            min={2000}
            max={2100}
            onChange={e => setYear(Number(e.target.value))}
            style={{ ...inputStyle, width: '90px' }}
          />

          {rows.length > 0 && (
            <span style={{ marginLeft: 'auto', fontSize: '13px', color: '#aaa' }}>
              Записів: {rows.length}
            </span>
          )}
        </div>

        <div style={tableWrapStyle}>
          {rows.length === 0 ? (
            <div style={emptyStyle}>
              Немає даних за {MONTH_NAMES[month - 1]} {year}
            </div>
          ) : (
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Дата</th>
                  <th style={thStyle}>Діаметр, мм</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>Кількість, т</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>Ціна за т</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>Зароблено</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                    <td style={tdStyle}>
                      {new Date(row.date).toLocaleDateString('uk-UA')}
                    </td>
                    <td style={tdStyle}>{row.diameter ?? '—'}</td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>
                      {formatNum(row.tons, 3)}
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>
                      {formatPrice(row.price)}
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'right', color: '#1a7a4a', fontWeight: '500' }}>
                      {formatMoney(row.earned)}
                    </td>
                  </tr>
                ))}

                <tr style={{ backgroundColor: '#f0f4ff', fontWeight: '500' }}>
                  <td style={{ ...tdStyle, color: '#555', fontSize: '13px' }} colSpan={2}>
                    Разом за {MONTH_NAMES[month - 1]}
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'right' }}>
                    {formatNum(totalTons, 3)}
                  </td>
                  <td style={tdStyle} />
                  <td style={{ ...tdStyle, textAlign: 'right', color: '#1a7a4a', fontWeight: '600' }}>
                    {formatMoney(totalEarned)}
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  )
}
