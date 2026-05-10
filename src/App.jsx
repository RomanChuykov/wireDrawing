import { useState } from 'react'
//import { useEffect } from "react";
import {Today, Legend, InputNumber, Container} from "./App.styled.js"
import './App.css'
import stan6 from './Data/6.json';
import stan9 from './Data/9.json';
import { BurgerMenu } from './Components/burgerMenu/burgerMenu.jsx';
import { Routes } from './Components/Routes/Routes.jsx';

import { supabase } from './supabase.js';


function App() {
 

  
  const [stan, setStan] = useState(()=> {
    const savedStan = localStorage.getItem('stan');
    return savedStan ? savedStan : '';
  });
  const [replasement, setreplasement]=useState(()=> {
    const zamina = localStorage.getItem('zamina');
    return zamina ? zamina : '';
  });
  const [katanka, setKatanka]=useState(()=> {
    const typeKatanki = localStorage.getItem('katanka');
    return typeKatanki ? typeKatanki : '';
  });
  const [spools, setSpools] = useState(() => {
  const saved = localStorage.getItem('currentShift');
  return saved ? JSON.parse(saved).spools ?? [] : [];
});
const [results, setResults] = useState(() => {
  const saved = localStorage.getItem('currentShift');
  return saved ? JSON.parse(saved).results ?? [] : [];
});
const [diameterDigits, setDiameterDigits] = useState(() => {
  const saved = localStorage.getItem('currentShift');
  return saved ? JSON.parse(saved).diameterDigits ?? "" : "";
});
const [initDiameter, setInitDiameter] = useState("");
const [price, setPrice] = useState(() => {
  const saved = localStorage.getItem('currentShift');
  return saved ? JSON.parse(saved).price ?? '' : '';
});
const [findDiameter, setFindDiameter] = useState(() => {
  const saved = localStorage.getItem('currentShift');
  return saved ? JSON.parse(saved).findDiameter ?? '' : '';
});
const [speed, setSpeed] = useState(() => {
  const saved = localStorage.getItem('currentShift');
  return saved ? JSON.parse(saved).speed ?? '' : '';
});
const [production, setProduction] = useState(() => {
  const saved = localStorage.getItem('currentShift');
  return saved ? JSON.parse(saved).production ?? '' : '';
});
const [timeNorm, setTimeNorm] = useState(() => {
  const saved = localStorage.getItem('currentShift');
  return saved ? JSON.parse(saved).timeNorm ?? '' : '';
});
  
  
  
  const [currentMassa, setCurrentMassa] = useState(850);
  //const [spools, setSpools] = useState([]); // [{massa: 800}, {massa: 850}, ...]
  //const [results, setResults] = useState([]);
//  const [diameterDigits, setDiameterDigits] = useState("");
  //const [initDiameter,setInitDiameter]= useState("")
  //const [price, setPrice] = useState('');
  //const [findDiameter, setFindDiameter] = useState('');
  //const [speed, setSpeed] = useState('');
  //const [production, setProduction] = useState('');
  //const [timeNorm, setTimeNorm] = useState('');
 
 const getToday = () => {
    const d = new Date();
    return d.toISOString().split('T')[0]; // формат YYYY-MM-DD
  } ;
 
  const [today, setToday] = useState(getToday());

  

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

  {/*const handleInitDiameterChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "");
    setInitDiameter(digits);
    console.log('init diameter',initDiameter)
  }*/ }


  const handlePriceChange = (e) => {
    setPrice(e.target.value);
  }

  const handleAddSpool = () => {
  const updatedSpools = [...spools, { massa: currentMassa }];
  setSpools(updatedSpools);
  saveCurrentShift(results, updatedSpools);
}

  const handleRemoveSpool = () => {
  if (spools.length === 0) return;
  const updatedSpools = spools.slice(0, -1);
  setSpools(updatedSpools);
  saveCurrentShift(results, updatedSpools);
}

 const handleSpoolMassaChange = (index, value) => {
  const updatedSpools = [...spools];
  updatedSpools[index] = { ...updatedSpools[index], massa: Number(value) };
  setSpools(updatedSpools);
  saveCurrentShift(results, updatedSpools);
}

  
// Збереження результатів при переході на новий діаметр
  const handleNewDiameter = () => {
  const newDiametrQuestion = confirm('Переходимо на новий діаметр?');
  if (!newDiametrQuestion) return;

  const updatedResults = [...results, {
    data: today,
    diameter: formatDecimal(diameterDigits, 2),
    price,
    countSpool: currentCount,
    totalMoney: currentMoney,
    totalTons: currentTons,
    spools: [...spools]
  }];

  setResults(updatedResults);
  // зберігаємо у поточну зміну, скидаємо дані по діаметру
  saveCurrentShift(updatedResults, [], {
    diameterDigits: '',
    price: '',
    findDiameter: '',
    speed: '',
    production: '',
    timeNorm: '',
  });

  setDiameterDigits('');
  setPrice('');
  setFindDiameter('');
  setSpeed('');
  setProduction('');
  setTimeNorm('');
  setSpools([]);
  setCurrentMassa(850);
};
  // зберігаємо дані зміни у локалсторідж
 const handleSaveShift = () => {
  const newResult = {
    data: today,
    diameter: formatDecimal(diameterDigits, 2),
    price,
    countSpool: currentCount,
    totalMoney: currentMoney,
    totalTons: currentTons,
    spools: [...spools]
  };

  const updatedResults = [...results, newResult];

  // Зберігаємо архів усіх змін — тільки додаємо, не перезаписуємо
  const savedShifts = JSON.parse(localStorage.getItem('workShifts')) || [];
  const shift = {
    shiftDate: today,
    results: updatedResults
  };
  localStorage.setItem('workShifts', JSON.stringify([...savedShifts, shift]));

  // Обнуляємо ключ поточної зміни
  localStorage.removeItem('currentShift');

  // Скидаємо весь стейт
  setResults([]);
  setDiameterDigits('');
  setPrice('');
  setFindDiameter('');
  setSpeed('');
  setProduction('');
  setTimeNorm('');
  setSpools([]);
  setCurrentMassa(850);
};

  //номер стана у localstoridge
  const saveStan = (stan) => {
    setStan(stan)
    localStorage.setItem('stan', stan);
  }
  //тип катанки у localstoridge
  const savekatanka = (typeKat) => {
    setKatanka(typeKat)
    localStorage.setItem('katanka', typeKat);
  }
  //заміна у localstoridge
  const savezamina = (zamina) => {
    setreplasement(zamina)
    localStorage.setItem('zamina', zamina);
  }
// додає у локалсторідж дані поточної зміни
  const saveCurrentShift = (updatedResults, updatedSpools, extra = {}) => {
  const current = {
    results: updatedResults,
    spools: updatedSpools,
    date: today,
    diameterDigits: extra.diameterDigits ?? diameterDigits,
    price: extra.price !== undefined ? extra.price : price,
    findDiameter: extra.findDiameter ?? findDiameter,
    speed: extra.speed ?? speed,
    production: extra.production ?? production,
    timeNorm: extra.timeNorm ?? timeNorm,
  };
  localStorage.setItem('currentShift', JSON.stringify(current));
};

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
      setFindDiameter(exact.final_diameter_mm);
      setPrice(exact.rozcinka_grn);
      //setPrice(String(Math.round(Number(exact.rozcinka_grn) * 100)));
      setSpeed((exact.drawing_speed_m_per_min / 60).toFixed(2));
      setProduction(exact.production_norm_kg);
      setTimeNorm(exact.norm_time);
      console.log('price',exact.norm_time)
      saveCurrentShift(results, spools, {
        findDiameter: exact.final_diameter_mm,
        price: exact.rozcinka_grn,
        speed: (exact.drawing_speed_m_per_min / 60).toFixed(2),
        production: exact.production_norm_kg,
        timeNorm: exact.norm_time,
      });
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
  setFindDiameter(closest.final_diameter_mm);
  setPrice(closest.rozcinka_grn);
  //setPrice(String(Math.round(Number(closest.rozcinka_grn) * 100)));
  setSpeed((closest.drawing_speed_m_per_min / 60).toFixed(2));
  setProduction(closest.production_norm_kg);
  setTimeNorm(closest.norm_time);
  saveCurrentShift(results, spools, {
      findDiameter: closest.final_diameter_mm,
      price: closest.rozcinka_grn,
      speed: (closest.drawing_speed_m_per_min / 60).toFixed(2),
      production: closest.production_norm_kg,
      timeNorm: closest.norm_time,
    });
  return closest;
};

//пошук маршрута    гкеф_sb_secret_8LlvLmLIS6W-Y-hHYPRrIw_8Nv10KOx
// project id qacwmjsapfwqvyrvxapg
// publishable key - sb_publishable__7ulnRhjN8TBhldT9duq_Q_CCgNVBgM
// API Url - https://qacwmjsapfwqvyrvxapg.supabase.co/rest/v1/
const searchRoute = (stan, katanka, final, replasement) => {
 
}
  return (
    <>
      <Container>
        <div>
          <BurgerMenu />
          
        </div>
        <h1>Калькулятор </h1>
        <h2> Волочільника дроту </h2>
        <div>
          <Today>сьогодні</Today>
          <input
              type="date"
              value={today}
              onChange={(e) => setToday(e.target.value)}
          />
        </div>
        
        <div>
          <select value={stan} onChange={(e) => saveStan(e.target.value)}>
            <option value="">-- Виберіть номер стана --</option>
            <option value="6">Стан № 6</option>
            <option value="9">Стан № 9</option>
          </select>

      {/*<Legend>Початковий діаметр дроту</Legend>
          
          <InputNumber
            id='init_diameter'
            type="text"
            inputMode="decimal"
            step="0.01"
            value={formatDecimal(initDiameter, 1)}
            onChange={handleInitDiameterChange}
          />*/}

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
           <select value={katanka} onChange={(e) => savekatanka(e.target.value)}>
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
           <select value={replasement} onChange={(e) => savezamina(e.target.value)}>
            <option value="">-- Заміна --</option>
            <option value="0">великовантажні мотки</option>
            <option value="4">великовантажні мотки переробна заготівля</option>
            <option value="16">мотки 400-600 кг</option>
           
          </select>
        </div>

        <div>
          
         <button onClick={()=>searchDiameter(stan, katanka, diameterDigits,replasement)}>Пошук</button>
         <Routes />
        </div>
        <div>
          

          <Legend>діаметр</Legend>
          <InputNumber
            value={findDiameter}  
          />
          <Legend>ціна за тону</Legend>
            <InputNumber
              id='price'
              type="text"
              inputMode="decimal"
              step="0.01"
              value={price}
              onChange={handlePriceChange}
            />
          <Legend>швидкість волочіння м/с</Legend>
          <InputNumber
             value={speed} readOnly
          />
          
           <Legend>норма виробництва</Legend>
          <InputNumber
             value={production} readOnly
          />
           <Legend>норма часу хв/т</Legend>
          <InputNumber
            value={(timeNorm*60).toFixed(0)} readOnly
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
            <button onClick={handleRemoveSpool} disabled={currentCount === 0}>▼ Видалити останню</button>
            
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
                    style={{ width: '30px', fontSize: '13px', padding: '2px 4px' }}
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
        <button onClick={handleSaveShift} style={{ marginTop: '16px' }}>
          Зберегти дані
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
