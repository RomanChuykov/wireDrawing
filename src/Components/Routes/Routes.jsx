import { useState } from 'react';
import { supabase } from '../../supabase.js';
import {
  TriggerBtn,
  Overlay,
  Modal,
  ModalLarge,
  ModalTitle,
  FieldLabel,
  StyledInput,
  DieInput,
  Row,
  Field,
  DiesGrid,
  DieField,
  DieLabel,
  BtnRow,
  BtnPrimary,
  BtnSecondary,
  BtnSuccess,
  BtnClose,
  ResultTable,
  Th,
  Td,
  ErrorMsg,
  SuccessMsg,
} from './Routes.styled.js';

const DIES = Array.from({ length: 12 }, (_, i) => i + 1);

function parseDie(val) {
  const n = parseFloat(val);
  return isNaN(n) ? null : n;
}

export function Routes() {
  const [isOpen, setIsOpen] = useState(false);

  // Пошук
  const [searchKatanka, setSearchKatanka] = useState('');
  const [searchWire, setSearchWire] = useState('');
  const [routes, setRoutes] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  // Додавання
  const [addOpen, setAddOpen] = useState(false);
  const [addKatanka, setAddKatanka] = useState('');
  const [dies, setDies] = useState(Array(12).fill(''));
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');

  const handleSearch = async () => {
    setSearchError('');
    setRoutes([]);

    const katanka = parseFloat(searchKatanka);
    const wire = parseFloat(searchWire);

    if (isNaN(katanka) || isNaN(wire)) {
      setSearchError('Введіть коректні значення діаметрів.');
      return;
    }

    setSearching(true);
    try {
      const { data, error } = await supabase
        .from('routes')
        .select('*')
        .eq('katanka_diameter', katanka)
        .eq('wire_diameter', wire)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRoutes(data || []);
      if (!data || data.length === 0) {
        setSearchError('Маршрутів для даних параметрів не знайдено.');
      }
    } catch (err) {
      setSearchError('Помилка підключення до бази: ' + err.message);
    } finally {
      setSearching(false);
    }
  };

  const handleSaveRoute = async () => {
    setSaveError('');
    setSaveSuccess('');

    const katanka = parseFloat(addKatanka);
    if (isNaN(katanka)) {
      setSaveError('Введіть коректний діаметр катанки.');
      return;
    }

    const diesObj = {};
    dies.forEach((val, i) => {
      diesObj[`die_${i + 1}`] = parseDie(val);
    });

    let wireDiameter = null;
    for (let i = dies.length - 1; i >= 0; i--) {
      const v = parseDie(dies[i]);
      if (v !== null) { wireDiameter = v; break; }
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('routes')
        .insert([{ katanka_diameter: katanka, wire_diameter: wireDiameter, ...diesObj }]);

      if (error) throw error;

      setSaveSuccess('Маршрут успішно збережено!');

      if (parseFloat(searchKatanka) === katanka && parseFloat(searchWire) === wireDiameter) {
        await handleSearch();
      }

      setTimeout(() => {
        setAddOpen(false);
        setSaveSuccess('');
        setAddKatanka('');
        setDies(Array(12).fill(''));
      }, 1000);
    } catch (err) {
      setSaveError('Помилка збереження: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setRoutes([]);
    setSearchKatanka('');
    setSearchWire('');
    setSearchError('');
  };

  const handleCloseAdd = () => {
    setAddOpen(false);
    setSaveError('');
    setSaveSuccess('');
    setAddKatanka('');
    setDies(Array(12).fill(''));
  };

  return (
    <>
      <TriggerBtn onClick={() => setIsOpen(true)}>Маршрут</TriggerBtn>

      {/* ── Пошук маршруту ── */}
      {isOpen && (
        <Overlay onClick={handleClose}>
          <Modal onClick={e => e.stopPropagation()}>
            <BtnClose onClick={handleClose}>✕</BtnClose>
            <ModalTitle>🔍 Маршрут волочіння</ModalTitle>

            <Row>
              <Field>
                <FieldLabel>Діаметр катанки (мм)</FieldLabel>
                <StyledInput
                  type="number"
                  step="0.1"
                  placeholder="напр. 6.5"
                  value={searchKatanka}
                  onChange={e => setSearchKatanka(e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel>Діаметр дроту (мм)</FieldLabel>
                <StyledInput
                  type="number"
                  step="0.01"
                  placeholder="напр. 1.80"
                  value={searchWire}
                  onChange={e => setSearchWire(e.target.value)}
                />
              </Field>
            </Row>

            {searchError && <ErrorMsg>{searchError}</ErrorMsg>}

            {routes.length > 0 && (
              <div style={{ overflowX: 'auto' }}>
                <ResultTable>
                  <thead>
                    <tr>
                      <Th>Катанка</Th>
                      <Th>Дріт</Th>
                      {DIES.map(n => <Th key={n}>В{n}</Th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {routes.map((r, i) => (
                      <tr key={r.id ?? i}>
                        <Td>{r.katanka_diameter}</Td>
                        <Td>{r.wire_diameter}</Td>
                        {DIES.map(n => <Td key={n}>{r[`die_${n}`] ?? '—'}</Td>)}
                      </tr>
                    ))}
                  </tbody>
                </ResultTable>
              </div>
            )}

            <BtnRow>
              <BtnPrimary onClick={handleSearch} disabled={searching}>
                {searching ? 'Пошук...' : '🔍 Пошук'}
              </BtnPrimary>
              <BtnSecondary onClick={() => { setAddOpen(true); }}>
                ➕ Додати маршрут
              </BtnSecondary>
              <BtnSecondary onClick={handleClose}>Закрити</BtnSecondary>
            </BtnRow>
          </Modal>
        </Overlay>
      )}

      {/* ── Додати маршрут ── */}
      {addOpen && (
        <Overlay $zIndex={1100} onClick={handleCloseAdd}>
          <ModalLarge onClick={e => e.stopPropagation()}>
            <BtnClose onClick={handleCloseAdd}>✕</BtnClose>
            <ModalTitle>➕ Новий маршрут волочіння</ModalTitle>

            <Field $maxWidth="200px">
              <FieldLabel>Діаметр катанки (мм)</FieldLabel>
              <StyledInput
                type="number"
                step="0.1"
                placeholder="напр. 6.5"
                value={addKatanka}
                onChange={e => setAddKatanka(e.target.value)}
              />
            </Field>

            <FieldLabel style={{ marginTop: '16px' }}>
              Волоки (мм) — введіть ті, що використовуються
            </FieldLabel>
            <DiesGrid>
              {DIES.map((n, i) => (
                <DieField key={n}>
                  <DieLabel>Волока {n}</DieLabel>
                  <DieInput
                    type="number"
                    step="0.01"
                    placeholder="мм"
                    value={dies[i]}
                    onChange={e => {
                      const updated = [...dies];
                      updated[i] = e.target.value;
                      setDies(updated);
                    }}
                  />
                </DieField>
              ))}
            </DiesGrid>

            {saveError && <ErrorMsg>{saveError}</ErrorMsg>}
            {saveSuccess && <SuccessMsg>{saveSuccess}</SuccessMsg>}

            <BtnRow>
              <BtnSuccess onClick={handleSaveRoute} disabled={saving}>
                {saving ? 'Збереження...' : '💾 Зберегти'}
              </BtnSuccess>
              <BtnSecondary onClick={handleCloseAdd}>Скасувати</BtnSecondary>
            </BtnRow>
          </ModalLarge>
        </Overlay>
      )}
    </>
  );
}
