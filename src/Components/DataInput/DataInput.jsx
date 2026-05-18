import { useState } from 'react';
import stan6 from '../../Data/6.json';
import stan9 from '../../Data/9.json';
import { Routes } from '../Routes/Routes.jsx';
import { useShift, formatDecimal } from '../../context/ShiftContext.jsx';
import {
  Section, SectionTitle, Row, Label,
  StanSelect, WideSelect, SmallInput, DateInput,
  SearchButton, ActionButton,
  InfoGrid, InfoCell, InfoLabel, InfoValue,Buttons
} from './DataInput.styled.js';

export function DataInput() {
  const {
    today, setToday,
    diameterDigits, setDiameterDigits,
    price, setPrice,
    findDiameter, setFindDiameter,
    speed, setSpeed,
    production, setProduction,
    timeNorm, setTimeNorm,
    spools, setSpools,
    results, setResults,
    currentTons, currentMoney, currentCount,
    persistShift, resetShift,
  } = useShift();

  // ── Локальний стейт (стан/катанка/заміна — не потрібні іншим компонентам) ─
  const [stan, setStan] = useState(() => localStorage.getItem('stan') ?? '');
  const [katanka, setKatanka] = useState(() => localStorage.getItem('katanka') ?? '');
  const [replasement, setReplasement] = useState(() => localStorage.getItem('zamina') ?? '');

  const saveStan    = (v) => { setStan(v);        localStorage.setItem('stan',    v); };
  const saveKatanka = (v) => { setKatanka(v);     localStorage.setItem('katanka', v); };
  const saveZamina  = (v) => { setReplasement(v); localStorage.setItem('zamina',  v); };

  // ── Діаметр ───────────────────────────────────────────────────────────────
  const handleDiameterChange = (e) => {
    setDiameterDigits(e.target.value.replace(/\D/g, ''));
  };

  const handlePriceChange = (e) => setPrice(e.target.value);

  // ── Пошук діаметра ────────────────────────────────────────────────────────
  const searchDiameter = () => {
    const stans = { 6: stan6.data, 9: stan9.data };
    const stanInfo = stans[+stan];
    if (!stanInfo) return;

    const filtered = stanInfo.filter(item =>
      Number(item.section)     === Number(katanka) &&
      Number(item.replacement) === Number(replasement)
    );
    if (filtered.length === 0) return;

    const exact = filtered.find(item =>
      Number(item.final_diameter_mm) === Number(diameterDigits) / 100
    );

    const found = exact ?? filtered.reduce((closest, item) => {
      const diff     = Math.abs(Number(item.final_diameter_mm) - Number(diameterDigits) / 100);
      const bestDiff = Math.abs(Number(closest.final_diameter_mm) - Number(diameterDigits) / 100);
      return diff < bestDiff ? item : closest;
    }, filtered[0]);

    const nextSpeed      = (found.drawing_speed_m_per_min / 60).toFixed(2);
    const nextFindDiam   = found.final_diameter_mm;
    const nextPrice      = found.rozcinka_grn;
    const nextProduction = found.production_norm_kg;
    const nextTimeNorm   = found.norm_time;

    setFindDiameter(nextFindDiam);
    setPrice(nextPrice);
    setSpeed(nextSpeed);
    setProduction(nextProduction);
    setTimeNorm(nextTimeNorm);

    persistShift(results, spools, {
      findDiameter: nextFindDiam,
      price:        nextPrice,
      speed:        nextSpeed,
      production:   nextProduction,
      timeNorm:     nextTimeNorm,
    });
  };

  // ── Новий діаметр ─────────────────────────────────────────────────────────
  const handleNewDiameter = () => {
    if (!confirm('Переходимо на новий діаметр?')) return;

    const updatedResults = [...results, {
      data:       today,
      diameter:   formatDecimal(diameterDigits, 2),
      price,
      countSpool: currentCount,
      totalMoney: currentMoney,
      totalTons:  currentTons,
      spools:     [...spools],
    }];

    setResults(updatedResults);
    setSpools([]);
    setDiameterDigits(''); setPrice(''); setFindDiameter('');
    setSpeed(''); setProduction(''); setTimeNorm('');

    persistShift(updatedResults, [], {
      diameterDigits: '', price: '', findDiameter: '',
      speed: '', production: '', timeNorm: '',
    });
  };

  // ── Зберегти зміну ────────────────────────────────────────────────────────
  const handleSaveShift = () => {
    const newResult = {
      data:       today,
      diameter:   formatDecimal(diameterDigits, 2),
      price,
      countSpool: currentCount,
      totalMoney: currentMoney,
      totalTons:  currentTons,
      spools:     [...spools],
    };
    const updatedResults = [...results, newResult];

    const savedShifts = JSON.parse(localStorage.getItem('workShifts')) || [];
    localStorage.setItem('workShifts', JSON.stringify([
      ...savedShifts,
      { shiftDate: today, results: updatedResults },
    ]));
    localStorage.removeItem('currentShift');

    resetShift();
  };

  // ── Рендер ────────────────────────────────────────────────────────────────
  return (
    <Section>
      {/*<SectionTitle>Введення даних</SectionTitle>*/}

      <Row>
        <Label>Сьогодні</Label>
        <DateInput
          type="date"
          value={today}
          onChange={(e) => setToday(e.target.value)}
        />
      </Row>

      <Row>
          <StanSelect value={stan} onChange={(e) => saveStan(e.target.value)}>
          <option value="">-- Виберіть стан --</option>
          <option value="6">Стан № 6</option>
          <option value="9">Стан № 9</option>
        </StanSelect>
      </Row>

      <Row>
        
        <WideSelect value={katanka} onChange={(e) => saveKatanka(e.target.value)}>
          <option value="">-- Виберіть тип катанки --</option>
          <option value="1">Торгова</option>
          <option value="4">СВІВ(А)</option>
          <option value="19">Пружинний</option>
          <option value="20">КП для холодної висадки</option>
          <option value="21">Торговий з окаліноломателем</option>
          <option value="26">Напівфабрикат для фібри</option>
          <option value="29">Пружинний з окаліноломателем</option>
        </WideSelect>
      </Row>

      <Row>
        
        <WideSelect value={replasement} onChange={(e) => saveZamina(e.target.value)}>
          <option value="">-- Заміна --</option>
          <option value="0">великовантажні мотки</option>
          <option value="4">великовантажні мотки переробна заготівля</option>
          <option value="16">мотки 400-600 кг</option>
        </WideSelect>
      </Row>

      <Row>
        <Label>Діаметр дроту</Label>
        <SmallInput
          id="diameter"
          type="text"
          inputMode="decimal"
          value={formatDecimal(diameterDigits, 2)}
          onChange={handleDiameterChange}
        />
        <Buttons>
          <SearchButton onClick={searchDiameter}>Пошук</SearchButton>
          <Routes />
        </Buttons>
      </Row>


      <InfoGrid>
        <InfoCell>
          <InfoLabel>Знайдений діаметр</InfoLabel>
          <InfoValue>{findDiameter || '—'}</InfoValue>
        </InfoCell>
        <InfoCell>
          <InfoLabel>Ціна за тону, грн</InfoLabel>
          <SmallInput
            id="price"
            type="text"
            inputMode="decimal"
            value={price}
            onChange={handlePriceChange}
          />
        </InfoCell>
        <InfoCell>
          <InfoLabel>Швидкість, м/с</InfoLabel>
          <InfoValue>{speed || '—'}</InfoValue>
        </InfoCell>
        <InfoCell>
          <InfoLabel>Норма виробництва</InfoLabel>
          <InfoValue>{production || '—'}</InfoValue>
        </InfoCell>
        <InfoCell>
          <InfoLabel>Норма часу, хв/т</InfoLabel>
          <InfoValue>{timeNorm ? (timeNorm * 60).toFixed(0) : '—'}</InfoValue>
        </InfoCell>
      </InfoGrid>

      <Row style={{ marginTop: '12px', gap: '8px' }}>
        <ActionButton onClick={handleNewDiameter}>⇄ Новий діаметр</ActionButton>
        <ActionButton $variant="save" onClick={handleSaveShift}>💾 Зберегти зміну</ActionButton>
      </Row>
    </Section>
  );
}
