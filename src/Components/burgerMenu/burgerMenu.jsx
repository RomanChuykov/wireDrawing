import { useState } from 'react'


export const BurgerMenu=({userData})=>{

  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: '🏠 Головна', href: '#' },
    { label: '📋 Історія змін', href: '#history' },
    { label: '⚙️ Налаштування', href: '#settings' },
    { label: 'ℹ️ Про програму', href: '#about' },
  ];

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
          {/* Затемнення фону — клік закриває */}
          <div
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed', inset: 0,
              backgroundColor: 'rgba(0,0,0,0.4)',
              zIndex: 200,
            }}
          />

          {/* Модальне вікно */}
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
            {menuItems.map((item, i) => (
              <a key={i} href={item.href} onClick={() => setIsOpen(false)}
                style={{
                  display: 'block', padding: '14px 20px', color: '#333',
                  textDecoration: 'none', fontSize: '15px',
                  borderBottom: i < menuItems.length - 1 ? '1px solid #f0f0f0' : 'none',
                }}
              >
                {item.label}
              </a>
            ))}
          </div>
        </>
      )}
    </>
  );

}