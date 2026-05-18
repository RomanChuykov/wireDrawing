import { useEffect, useMemo, useState } from 'react';
import {
  TriggerBtn,
  Overlay,
  ModalWrap,
  ModalTitle,
  BtnClose,
  SectionHeader,
  SectionChevron,
  SectionBody,
  SectionDivider,
  ParamGrid,
  ParamField,
  ParamLabel,
  NumInput,
  RouteList,
  RouteItem,
  RouteName,
  RouteValues,
  RouteValue,
  RouteInputCell,
  InfoBar,
  InfoItem,
  BtnRow,
  BtnSecondary,
  ErrorMsg,
} from './Routes.styled.js';

function fmt2(n) {
  if (n === null || n === undefined || isNaN(n)) return '-';
  return (Math.round(n * 100) / 100).toFixed(2);
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

function calcDiffs(katanka, diams) {
  const all = [parseFloat(katanka), ...diams.map(d => parseFloat(d))];
  return all.slice(0, -1).map((d, i) => {
    const next = all[i + 1];
    if (isNaN(d) || isNaN(next)) return null;
    return round2(d - next);
  });
}

function calcDiametersByDiffs(katanka, diffs) {
  const start = parseFloat(katanka);
  if (isNaN(start)) return [];

  const diams = [];
  let current = start;

  for (const diffValue of diffs) {
    const diff = parseFloat(diffValue);
    if (isNaN(diff)) {
      diams.push(null);
      current = null;
      continue;
    }

    if (current === null || isNaN(current)) {
      diams.push(null);
      continue;
    }

    current = round2(current - diff);
    diams.push(current);
  }

  return diams;
}

function calcAutoRoute(dIn, dOut, nBlocks) {
  if (!dIn || !dOut || dIn <= dOut || nBlocks < 1) return [];
  const totalStrain = 2 * Math.log(dIn / dOut);
  const strainPerBlock = totalStrain / nBlocks;
  const diams = [dIn];
  let prev = dIn;

  for (let i = 0; i < nBlocks; i++) {
    const d = round2(prev * Math.exp(-strainPerBlock / 2));
    diams.push(d);
    prev = d;
  }

  return diams;
}

export function Routes() {
  const [isOpen, setIsOpen] = useState(false);

  const [sec1Open, setSec1Open] = useState(true);
  const [manKatanka, setManKatanka] = useState('');
  const [manWire, setManWire] = useState('');
  const [manBlocks, setManBlocks] = useState('');
  const [manDiffsInput, setManDiffsInput] = useState([]);

  const manN = parseInt(manBlocks, 10);
  const manValid = !isNaN(manN) && manN >= 1 && manN <= 20;

  useEffect(() => {
    if (!manValid) {
      setManDiffsInput([]);
      return;
    }

    setManDiffsInput(prev => {
      if (manN > prev.length) return [...prev, ...Array(manN - prev.length).fill('')];
      return prev.slice(0, manN);
    });
  }, [manN, manValid]);

  const setManDiff = (i, val) => {
    setManDiffsInput(prev => {
      const updated = [...prev];
      updated[i] = val;
      return updated;
    });
  };

  const manDiams = useMemo(() => {
    if (!manValid || manKatanka === '') return [];
    return calcDiametersByDiffs(manKatanka, manDiffsInput);
  }, [manKatanka, manDiffsInput, manValid]);

  const manLastDiam = manDiams[manN - 1];
  const manWireVal = parseFloat(manWire);
  const manMismatch = manWire !== '' && manLastDiam !== null && !isNaN(manLastDiam) && !isNaN(manWireVal)
    && Math.abs(manLastDiam - manWireVal) > 0.005;

  const [sec2Open, setSec2Open] = useState(true);
  const [autoKatanka, setAutoKatanka] = useState('');
  const [autoWire, setAutoWire] = useState('');
  const [autoBlocks, setAutoBlocks] = useState('');
  const [taper, setTaper] = useState('10');
  const [autoDiamsInput, setAutoDiamsInput] = useState([]);

  const autoN = parseInt(autoBlocks, 10);
  const autoValid = !isNaN(autoN) && autoN >= 1 && autoN <= 20;

  const calculatedAutoDiams = useMemo(() => {
    const dIn = parseFloat(autoKatanka);
    const dOut = parseFloat(autoWire);
    if (!autoValid || isNaN(dIn) || isNaN(dOut) || dIn <= dOut) return [];
    return calcAutoRoute(dIn, dOut, autoN).slice(1);
  }, [autoKatanka, autoWire, autoN, autoValid]);

  useEffect(() => {
    if (!autoValid) {
      setAutoDiamsInput([]);
      return;
    }

    setAutoDiamsInput(prev => {
      const next = Array.from({ length: autoN }, (_, i) => {
        const current = prev[i];
        if (current !== undefined && current !== '') return current;
        return calculatedAutoDiams[i] !== undefined ? fmt2(calculatedAutoDiams[i]) : '';
      });

      return next;
    });
  }, [autoN, autoValid, calculatedAutoDiams]);

  const setAutoDiam = (i, val) => {
    setAutoDiamsInput(prev => {
      const updated = [...prev];
      updated[i] = val;
      return updated;
    });
  };

  const autoAllDiams = useMemo(() => {
    if (!autoValid || autoKatanka === '') return [];
    return [parseFloat(autoKatanka), ...autoDiamsInput.map(d => parseFloat(d))];
  }, [autoKatanka, autoDiamsInput, autoValid]);

  const autoDiffs = useMemo(() => {
    if (autoAllDiams.length < 2) return [];
    return calcDiffs(autoKatanka, autoDiamsInput);
  }, [autoAllDiams.length, autoKatanka, autoDiamsInput]);

  const autoReduction = useMemo(() => {
    const dIn = parseFloat(autoKatanka);
    const dOut = parseFloat(autoWire);
    if (isNaN(dIn) || isNaN(dOut) || dIn <= dOut) return null;
    return (1 - (dOut * dOut) / (dIn * dIn)) * 100;
  }, [autoKatanka, autoWire]);

  const suggestedBlocks = useMemo(() => {
    const dIn = parseFloat(autoKatanka);
    const dOut = parseFloat(autoWire);
    if (isNaN(dIn) || isNaN(dOut) || dIn <= dOut) return null;
    return Math.ceil(2 * Math.log(dIn / dOut) / 0.28);
  }, [autoKatanka, autoWire]);

  const autoLastDiam = parseFloat(autoDiamsInput[autoN - 1]);
  const autoWireVal = parseFloat(autoWire);
  const autoMismatch = autoWire !== '' && !isNaN(autoLastDiam) && !isNaN(autoWireVal)
    && Math.abs(autoLastDiam - autoWireVal) > 0.005;

  const handleClose = () => setIsOpen(false);

  return (
    <>
      <TriggerBtn onClick={() => setIsOpen(true)}>Маршрут</TriggerBtn>

      {isOpen && (
        <Overlay onClick={handleClose}>
          <ModalWrap onClick={e => e.stopPropagation()}>
            <BtnClose onClick={handleClose}>x</BtnClose>
            <ModalTitle>Маршрут волочіння</ModalTitle>

            <SectionHeader onClick={() => setSec1Open(o => !o)}>
              Ручний розрахунок
              <SectionChevron $open={sec1Open}>v</SectionChevron>
            </SectionHeader>

            <SectionBody $open={sec1Open}>
              <ParamGrid>
                <ParamField>
                  <ParamLabel>Ø катанки (мм)</ParamLabel>
                  <NumInput type="number" step="0.1" inputMode="decimal"
                    value={manKatanka} onChange={e => setManKatanka(e.target.value)} />
                </ParamField>
                <ParamField>
                  <ParamLabel>Ø дроту (мм)</ParamLabel>
                  <NumInput type="number" step="0.01" inputMode="decimal"
                    value={manWire} onChange={e => setManWire(e.target.value)} />
                </ParamField>
                <ParamField>
                  <ParamLabel>К-сть блоків</ParamLabel>
                  <NumInput type="number" step="1" min="1" max="20" inputMode="numeric"
                    value={manBlocks} onChange={e => setManBlocks(e.target.value)} />
                </ParamField>
              </ParamGrid>

              {manValid && manKatanka !== '' && (
                <RouteList>
                  {Array.from({ length: manN }, (_, i) => {
                    const isLast = i === manN - 1;
                    return (
                      <RouteItem key={i} $isWire={isLast} $mismatch={isLast && manMismatch}>
                        <RouteName>{isLast ? 'Дріт' : `Блок ${i + 1}`}</RouteName>
                        <RouteValues>
                          <RouteInputCell>
                            <span>Різниця</span>
                            <NumInput
                              type="number"
                              step="0.01"
                              inputMode="decimal"
                              value={manDiffsInput[i] ?? ''}
                              onChange={e => setManDiff(i, e.target.value)}
                              $compact
                            />
                          </RouteInputCell>
                          <RouteValue>
                            <span>Діаметр</span>
                            <strong>{fmt2(manDiams[i])}</strong>
                          </RouteValue>
                        </RouteValues>
                      </RouteItem>
                    );
                  })}
                </RouteList>
              )}

              {manMismatch && (
                <ErrorMsg>
                  Останній діаметр ({fmt2(manLastDiam)} мм) не збігається з Ø дроту ({fmt2(manWireVal)} мм)
                </ErrorMsg>
              )}
            </SectionBody>

            <SectionDivider />

            <SectionHeader onClick={() => setSec2Open(o => !o)}>
              Автоматичний розрахунок
              <SectionChevron $open={sec2Open}>v</SectionChevron>
            </SectionHeader>

            <SectionBody $open={sec2Open}>
              <ParamGrid>
                <ParamField>
                  <ParamLabel>Ø катанки (мм)</ParamLabel>
                  <NumInput type="number" step="0.1" inputMode="decimal"
                    value={autoKatanka} onChange={e => setAutoKatanka(e.target.value)} />
                </ParamField>
                <ParamField>
                  <ParamLabel>Ø дроту (мм)</ParamLabel>
                  <NumInput type="number" step="0.01" inputMode="decimal"
                    value={autoWire} onChange={e => setAutoWire(e.target.value)} />
                </ParamField>
                <ParamField>
                  <ParamLabel>К-сть блоків</ParamLabel>
                  <NumInput type="number" step="1" min="1" max="20" inputMode="numeric"
                    value={autoBlocks} onChange={e => setAutoBlocks(e.target.value)} />
                </ParamField>
                <ParamField>
                  <ParamLabel>TAPER (°)</ParamLabel>
                  <NumInput type="number" step="1" min="1" max="30" inputMode="numeric"
                    value={taper} onChange={e => setTaper(e.target.value)} />
                </ParamField>
              </ParamGrid>

              {autoReduction !== null && (
                <InfoBar>
                  <InfoItem>
                    <span>Обтиснення</span>
                    <strong>{fmt2(autoReduction)}%</strong>
                  </InfoItem>
                  {suggestedBlocks && (
                    <InfoItem>
                      <span>Рек. блоків</span>
                      <strong>{suggestedBlocks}</strong>
                    </InfoItem>
                  )}
                  <InfoItem>
                    <span>TAPER</span>
                    <strong>{taper}°</strong>
                  </InfoItem>
                </InfoBar>
              )}

              {autoValid && autoKatanka !== '' && (
                <RouteList>
                  {Array.from({ length: autoN }, (_, i) => {
                    const isLast = i === autoN - 1;
                    return (
                      <RouteItem key={i} $isWire={isLast} $mismatch={isLast && autoMismatch}>
                        <RouteName>{isLast ? 'Дріт' : `Блок ${i + 1}`}</RouteName>
                        <RouteValues>
                          <RouteInputCell>
                            <span>Діаметр</span>
                            <NumInput
                              type="number"
                              step="0.01"
                              inputMode="decimal"
                              value={autoDiamsInput[i] ?? ''}
                              onChange={e => setAutoDiam(i, e.target.value)}
                              $compact
                            />
                          </RouteInputCell>
                          <RouteValue>
                            <span>Різниця</span>
                            <strong>{fmt2(autoDiffs[i])}</strong>
                          </RouteValue>
                        </RouteValues>
                      </RouteItem>
                    );
                  })}
                </RouteList>
              )}

              {autoMismatch && (
                <ErrorMsg>
                  Останній діаметр ({fmt2(autoLastDiam)} мм) не збігається з Ø дроту ({fmt2(autoWireVal)} мм)
                </ErrorMsg>
              )}
            </SectionBody>

            <BtnRow>
              <BtnSecondary onClick={handleClose}>Закрити</BtnSecondary>
            </BtnRow>
          </ModalWrap>
        </Overlay>
      )}
    </>
  );
}
