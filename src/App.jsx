import { useState } from 'react'
import {Today, Legend, InputNumber, Container} from "./App.styled.js"
import './App.css'
import stan6 from './Data/6.json';
import stan9 from './Data/9.json';

function App() {
  const [diameter, setDiameter] = useState(3);
  const [currentMassa, setCurrentMassa] = useState(850);
  const [spools, setSpools] = useState([]); // [{massa: 800}, {massa: 850}, ...]
  const [results, setResults] = useState([]);
  const [diameterDigits, setDiameterDigits] = useState("");
  const [numberStan, setNumberStan]=useState('');
  const [katanka, setKatanka]=useState('');
  const [replasement, setreplasement]=useState('');
  const [stan, setStan] = useState('')
  const [initDiameter,setInitDiameter]= useState("")
  const [price, setPrice] = useState('');
  const [speed, setSpeed] = useState('');
  const [production, setProduction] = useState('');
  const [timeNorm, setTimeNorm] = useState('');

  const today = new Date();

  

  // === РОЗРАХУНКИ ЗА ПОТОЧНИЙ ДІАМЕТР ===
  const currentTons = spools.reduce((sum, s) => sum + s.massa / 1000, 0);
  const priceNum = Number(price) || 0;                    
  const currentMoney = currentTons * priceNum;
  const currentCount = spools.length;

  // === ЗАГАЛЬНІ РОЗРАХУНКИ ЗА ВСЮ СЕСІЮ ===
  const grandTotalTons = results.reduce((sum, r) => sum + (r.totalTons || 0), 0) + currentTons;
  const grandTotalMoney = results.reduce((sum, r) => sum + (r.totalMoney || 0), 0) + currentMoney;

  function formatDecimal(digits, decimals = 2) {
    if (!digits) return '0.00';
    const num = parseInt(digits, 10);
    return (num / Math.pow(10, decimals)).toFixed(decimals);
  }

  const handleDiameterChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "");
    setDiameterDigits(digits);
  }

  const handleInitDiameterChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "");
    setInitDiameter(digits);
    console.log('init diameter',initDiameter)
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
    const newDiametrQuestion = confirm('Переходимо на новий діаметр?');
    if (!newDiametrQuestion) return;

    setResults([...results, {  
      diameter: formatDecimal(diameterDigits, 2),   // правильний діаметр
      price,
      countSpool: currentCount,
      totalMoney: currentMoney,
      totalTons: currentTons,
      spools: [...spools]
    }]);

    setDiameter('');
    setDiameterDigits('');
    setPrice('');
    setSpools([]);
    setCurrentMassa(850);
  }
  
  //пошук діаметра

  const searchDiameter = (stan, katanka, final, replasement) => {
  console.log('Пошук:', { stan,katanka, final, replasement });

  const stans = {
    6: stan6.data,
    9: stan9.data
  };

  const stanInfo = stans[+stan];
  if (!stanInfo) {
    console.error('Невідомий стан:', stan);
    return null;
  }

  const filtered = stanInfo.filter(item => 
    Number(item.section) == Number(katanka) &&
    Number(item.replacement) == Number(replasement)
  );
  console.log('filtered',filtered);

  if (filtered.length === 0) {
    console.log('Нічого не знайдено');
    return null;
  }

  // Точний збіг
  const exact = filtered.find(item => 
    Number(item.final_diameter_mm) === Number(final) / 100   // або diameter_mm — перевір у json
  );
  console.log('exact',exact)

  if (exact) {
    console.log('Знайдено точний:', exact);
    setPrice(exact.rozcinka_grn);
    setSpeed((exact.drawing_speed_m_per_min / 60).toFixed(2));
    setProduction(exact.production_norm_kg);
    setTimeNorm(exact.norm_time*60);
    console.log('price',price)
    return exact;
  }

  // Найближчий
  let closest = filtered[0];
  let minDiff = Math.abs(Number(filtered[0].final_diameter_mm) - Number(final) / 100);

  for (const item of filtered) {
    const diff = Math.abs(Number(item.final_diameter_mm) - Number(final) / 100);
    if (diff < minDiff) {
      minDiff = diff;
      closest = item;
    }
  }

  console.log('Найближчий:', closest);
  setPrice(closest.rozcinka_grn);
  setSpeed((closest.drawing_speed_m_per_min / 60).toFixed(2));
  setProduction(closest.production_norm_kg);
  setTimeNorm(closest.norm_time);
  
  return closest;
};

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

      <Legend>Початковий діаметр дроту</Legend>
          
          <InputNumber
            id='init_diameter'
            type="text"
            inputMode="decimal"
            step="0.01"
            value={formatDecimal(initDiameter, 1)}
            onChange={handleInitDiameterChange}
          />

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
            <option value="4">СВІВ(А)</option>
            <option value="19">Пружинний</option>
            <option value="20">КП для холодної висадки</option>
            <option value="21">Торговий з окаліноломателем</option>
            <option value="26">Напівфабрикат для фібри</option>
            <option value="29">Пружинний з окаліноломателем</option>
            
          </select>
        </div>
        <div>
           <select value={replasement} onChange={(e) => setreplasement(e.target.value)}>
            <option value="">-- Заміна --</option>
            <option value="0">великовантажні мотки</option>
            <option value="4">великовантажні мотки переробна заготівля</option>
            <option value="16">мотки 400-600 кг</option>
           
          </select>
        </div>

        <div>
          
         <button onClick={()=>searchDiameter(stan, katanka, diameterDigits,replasement)}>Пошук</button>
        </div>
        <div>
          
          <Legend>ціна за тону</Legend>
          <InputNumber
            value={formatDecimal(price, 2)*100}  
          />
          <Legend>швидкість волочіння м/с</Legend>
          <InputNumber
             value={speed} readOnly
          />
          
           <Legend>норма виробництва</Legend>
          <InputNumber
             value={production} readOnly
          />
           <Legend>норма часу год/т</Legend>
          <InputNumber
            value={timeNorm} readOnly
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
            <button onClick={handleRemoveSpool} disabled={currentCount === 0}>▼ Видалити останню</button><button onClick={handleRemoveSpool} disabled={currentCount === 0}>▼ Видалити останню</button>
          </div>
        </div>

        {/* Список шпуль */}
        {spools.length > 0 && (
          <div style={{ marginTop: '12px' }}>
            <strong>Шпулі ({currentCount} шт.):</strong>
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

        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e8f5e9', borderRadius: '10px', border: '1px solid #81c784' }}>
  
  <h4 style={{ margin: '0 0 10px 0', color: '#2e7d32' }}>✅ Поточний діаметр</h4>
  <p><strong>Заробив:</strong> <span style={{ fontSize: '1.25em' }}>{currentMoney.toFixed(2)}</span> грн</p>
  <p><strong>Тон:</strong> {currentTons.toFixed(3)} т</p>
  <p><strong>Шпуль:</strong> {currentCount} шт.</p>

  <hr style={{ margin: '12px 0' }} />

  <h4 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>📊 Всього за всю сесію</h4>
  <p><strong>Заробив усього:</strong> <span style={{ fontSize: '1.35em', color: '#1976d2', fontWeight: 'bold' }}>
    {grandTotalMoney.toFixed(2)}
  </span> грн</p>
  <p><strong>Тон усього:</strong> {grandTotalTons.toFixed(3)} т</p>
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
