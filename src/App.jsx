import { useState } from 'react'
import {Today, Legend, InputNumber, Container} from "./App.styled.js"
import './App.css'
import stan6 from './Data/6.json';
import stan9 from './Data/9.json';

function App() {
  const [diameter, setDiameter] = useState(3);
  const [currentMassa, setCurrentMassa] = useState(850);
  const [price, setPrice] = useState("");
  const [spools, setSpools] = useState([]); // [{massa: 800}, {massa: 850}, ...]
  const [results, setResults] = useState([]);
  const [diameterDigits, setDiameterDigits] = useState("");
  const [numberStan, setNumberStan]=useState(0);
  const [katanka, setKatanka]=useState('');
  const [zamina, setZamina]=useState('');
  const [stan, setStan] = useState('')
  const today = new Date();

  // Розраховані значення з поточних шпуль
  const totalTons = spools.reduce((sum, s) => sum + s.massa / 1000, 0);
  const priceNum = Number(formatDecimal(price, 2));
  const totalMoney = totalTons * priceNum;
  const count = spools.length;

  function formatDecimal(digits, decimals = 2) {
    if (!digits) return '0.00';
    const num = parseInt(digits, 10);
    return (num / Math.pow(10, decimals)).toFixed(decimals);
  }

  const handleDiameterChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "");
    setDiameterDigits(digits);
  }

  const handlePriceChange = (e) => {
    const p = e.target.value.replace(/\D/g, "");
    setPrice(p);
  }

  const handleAddSpool = () => {
    setSpools(prev => [...prev, { massa: currentMassa }]);
  }

  const handleRemoveSpool = () => {
    if (spools.length === 0) return;
    setSpools(prev => prev.slice(0, -1));
  }

  const handleRemoveSpoolAt = (index) => {
    setSpools(prev => prev.filter((_, i) => i !== index));
  }

  const handleSpoolMassaChange = (index, value) => {
    const updated = [...spools];
    updated[index] = { ...updated[index], massa: Number(value) };
    setSpools(updated);
  }
// Збереження результатів при переході на новий діаметр
  const handleNewDiameter = () => {
    const newDiametrQuestion=confirm('Переходимо на новий діаметр?');
    if (!newDiametrQuestion) return;

    setResults([...results, {  
      diameter,
      price,
      countSpool: count,
      totalMoney,
      totalTons,
      spools: [...spools]
    }]);

    setDiameter('');
    setDiameterDigits('');
    setPrice('');
    setSpools([]);
    setCurrentMassa(850);
  }

  return (
    <>
      <Container>
        <h1>Калькулятор </h1>
        <h2> Волочіння дроту </h2>
        <div>
          <Today>сьогодні</Today>
          {today.toLocaleDateString()}
        </div>
        
        <div>
          <Legend>Введіть № стана</Legend>
          <select value={stan} onChange={(e) => setStan(e.target.value)}>
            <option value="">-- Виберіть номер стана --</option>
            <option value="6">Стан № 6</option>
            <option value="9">Стан № 9</option>
          </select>
          <Legend>Діаметр дроту</Legend>
          <InputNumber
            id='diameter'
            type="text"
            inputMode="decimal"
            step="0.01"
            value={formatDecimal(diameterDigits, 2)}
            onChange={handleDiameterChange}
          />
        </div>
        <div>
           <select value={katanka} onChange={(e) => setKatanka(e.target.value)}>
            <option value="">-- Виберіть тип катанки --</option>
            <option value="1">Торгова</option>
            <option value="19">Пружинний</option>
            <option value="21">Торговий з окаліноломателем</option>
            <option value="26">Напівфабрикат для фібри</option>
            <option value="29">Пружинний з окаліноломателем</option>
            <option value="A400S">A400S</option>
            <option value="A400S">A400S</option>
            <option value="A400S">A400S</option>
            <option value="A400S">A400S</option>
          </select>
        </div>
        <div>
           <select value={zamina} onChange={(e) => setZamina(e.target.value)}>
            <option value="">-- Заміна --</option>
            <option value="0">великовантажні мотки</option>
            <option value="4">великовантажні мотки переробна заготівля</option>
            <option value="16">мотки 400-600 кг</option>
            <option value="A400S">A400S</option>
            <option value="A400S">A400S</option>
            <option value="A400S">A400S</option>
            <option value="A400S">A400S</option>
            <option value="A400S">A400S</option>
            <option value="A400S">A400S</option>
          </select>
        </div>

        <div>
          
           <select value={katanka} onChange={(e) => setKatanka(e.target.value)}>
            <option value="">-- Виберіть тип катанки --</option>
            <option value="1">Торгова</option>
            <option value="19">Пружинний</option>
            <option value="21">Торговий з окаліноломателем</option>
            <option value="26">Напівфабрикат для фібри</option>
            <option value="29">Пружинний з окаліноломателем</option>
            <option value="A400S">A400S</option>
            <option value="A400S">A400S</option>
            <option value="A400S">A400S</option>
            <option value="A400S">A400S</option>
          </select>
        </div>
        <div>
          
          <Legend>ціна за тону</Legend>
          <InputNumber
            id='price'
            type="text"
            step="0.01"
            inputMode="decimal"
            value={formatDecimal(price, 2)}
            onChange={handlePriceChange}
          />
        </div>

        {/* Додавання шпуль */}
        <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f0f4ff', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 8px 0' }}>Додати шпулю</h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Маса (кг):</span>
            <input
              type='number'
              value={currentMassa}
              onChange={(e) => setCurrentMassa(Number(e.target.value))}
              style={{ width: '80px' }}
            />
            <button onClick={handleAddSpool}>▲ Додати</button>
            <button onClick={handleRemoveSpool} disabled={count === 0}>▼ Видалити останню</button>
          </div>
        </div>

        {/* Список шпуль */}
        {spools.length > 0 && (
          <div style={{ marginTop: '12px' }}>
            <strong>Шпулі ({count} шт.):</strong>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
              {spools.map((spool, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 8px',
                    backgroundColor: '#e8f0fe',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                >
                  <span>#{index + 1}</span>
                  <input
                    type='number'
                    value={spool.massa}
                    onChange={(e) => handleSpoolMassaChange(index, e.target.value)}
                    style={{ width: '35px', fontSize: '13px', padding: '2px 4px' }}
                  />
                  <span>кг</span>
                  <button
                    onClick={() => handleRemoveSpoolAt(index)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#999',
                      fontSize: '12px',
                      padding: '0 2px'
                    }}
                    title="Видалити"
                  >✕</button>
                </div>
              ))}
            </div>
          </div>
        )}

        <button onClick={handleNewDiameter} style={{ marginTop: '16px' }}>
          Новий діаметр
        </button>

        <div>
          <p>всього заробив - {totalMoney.toFixed(2)}</p>
          <p>всього тон за сесію - {totalTons.toFixed(3)}</p>
          <p>кількість шпуль - {count}</p>
        </div>

        {results.length > 0 && (
          <div style={{ marginTop: '20px', borderTop: '2px solid #ccc', paddingTop: '20px' }}>
            <h3>Збережені результати</h3>
            {results.map((result, index) => (
              <div
                key={index}
                style={{
                  marginBottom: '10px',
                  padding: '10px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '5px'
                }}
              >
                <p><strong>Діаметр:</strong> {result.diameter} мм</p>
                <p><strong>Ціна за тону:</strong> {result.price} грн</p>
                <p><strong>Кількість шпуль:</strong> {result.countSpool}</p>
                <p><strong>Тон:</strong> {result.totalTons.toFixed(3)}</p>
                <p><strong>Заробив:</strong> {result.totalMoney.toFixed(2)} грн</p>
                <details>
                  <summary style={{ cursor: 'pointer', color: '#555', fontSize: '13px' }}>
                    Деталі шпуль
                  </summary>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px' }}>
                    {result.spools.map((s, i) => (
                      <span
                        key={i}
                        style={{
                          padding: '2px 8px',
                          backgroundColor: '#dde8ff',
                          borderRadius: '4px',
                          fontSize: '13px'
                        }}
                      >
                        #{i + 1}: {s.massa} кг
                      </span>
                    ))}
                  </div>
                </details>
              </div>
            ))}
          </div>
        )}
      </Container>
    </>
  )
}

export default App;
