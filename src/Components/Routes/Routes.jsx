import { useState } from 'react';
import { supabase } from '../../supabase.js';

// Імпортуємо всі styled-компоненти з окремого файлу стилів
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

// Масив номерів волок від 1 до 12 — використовується для рендеру полів і колонок таблиці
const DIES = Array.from({ length: 12 }, (_, i) => i + 1);

// Конвертує рядок у число; повертає null якщо значення порожнє або не є числом
function parseDie(val) {
  const n = parseFloat(val);
  return isNaN(n) ? null : n;
}

export function Routes() {
  // ── Стан головного модального вікна (пошук) ──────────────────────────────

  // Чи відкрите головне модальне вікно
  const [isOpen, setIsOpen] = useState(false);

  // Значення полів форми пошуку
  const [searchKatanka, setSearchKatanka] = useState('');
  const [searchWire, setSearchWire] = useState('');

  // Масив маршрутів отриманих з бази після пошуку
  const [routes, setRoutes] = useState([]);

  // Прапорець завантаження під час запиту до бази
  const [searching, setSearching] = useState(false);

  // Повідомлення про помилку або відсутність результатів пошуку
  const [searchError, setSearchError] = useState('');

  // ── Стан модального вікна додавання маршруту ─────────────────────────────

  // Чи відкрите вікно додавання
  const [addOpen, setAddOpen] = useState(false);

  // Значення поля діаметра катанки у формі додавання
  const [addKatanka, setAddKatanka] = useState('');

  // Масив з 12 значень волок — індекс 0 = d1, індекс 11 = d12
  const [dies, setDies] = useState(Array(12).fill(''));

  // Прапорець завантаження під час збереження в базу
  const [saving, setSaving] = useState(false);

  // Повідомлення про помилку збереження
  const [saveError, setSaveError] = useState('');

  // Повідомлення про успішне збереження
  const [saveSuccess, setSaveSuccess] = useState('');

  // ── Пошук маршрутів у Supabase ────────────────────────────────────────────
  const handleSearch = async () => {
    // Скидаємо попередні результати і помилки перед новим пошуком
    setSearchError('');
    setRoutes([]);

    // Перетворюємо введені рядки на числа для порівняння з базою
    const katanka = parseFloat(searchKatanka);
    const wire = parseFloat(searchWire);

    // Валідація — якщо хоч одне поле не є числом, показуємо помилку
    if (isNaN(katanka) || isNaN(wire)) {
      setSearchError('Введіть коректні значення діаметрів.');
      return;
    }

    // Вмикаємо індикатор завантаження
    setSearching(true);
    try {
      // Запит до таблиці routes: вибираємо всі записи де katanka і wireDiameter збігаються
      const { data, error } = await supabase
        .from('routes')
        .select('*')
        .eq('katanka', katanka)
        .eq('wireDiameter', wire)
        .order('created_at', { ascending: false }); // Нові маршрути першими

      if (error) throw error;

      // Зберігаємо результати у стан для відображення в таблиці
      setRoutes(data || []);

      // Якщо база повернула порожній масив — повідомляємо користувача
      if (!data || data.length === 0) {
        setSearchError('Маршрутів для даних параметрів не знайдено.');
      }
    } catch (err) {
      // Показуємо технічну помилку підключення або запиту
      setSearchError('Помилка підключення до бази: ' + err.message);
    } finally {
      // Вимикаємо індикатор завантаження незалежно від результату
      setSearching(false);
    }
  };

  // ── Збереження нового маршруту у Supabase ────────────────────────────────
  const handleSaveRoute = async () => {
    // Скидаємо попередні повідомлення
    setSaveError('');
    setSaveSuccess('');

    // Перевіряємо що діаметр катанки введений коректно
    const katanka = parseFloat(addKatanka);
    if (isNaN(katanka)) {
      setSaveError('Введіть коректний діаметр катанки.');
      return;
    }

    // Формуємо об'єкт волок: { d1: value|null, d2: value|null, ... d12: value|null }
    // Порожні поля зберігаються як null у базі
    const diesObj = {};
    dies.forEach((val, i) => {
      diesObj[`d${i + 1}`] = parseDie(val);
    });

    // Визначаємо діаметр дроту автоматично —
    // це значення останньої заповненої волоки (кінцевий розмір після протяжки)
    let wireDiameter = null;
    for (let i = dies.length - 1; i >= 0; i--) {
      const v = parseDie(dies[i]);
      if (v !== null) { wireDiameter = v; break; }
    }

    // Вмикаємо індикатор збереження
    setSaving(true);
    try {
      // Вставляємо новий запис у таблицю routes із полями бази
      const { error } = await supabase
        .from('routes')
        .insert([{
          katanka,        // діаметр катанки
          wireDiameter,   // діаметр готового дроту (остання волока)
          ...diesObj,     // d1..d12 — розмір на кожній волоці
        }]);

      if (error) throw error;

      // Показуємо повідомлення про успіх
      setSaveSuccess('Маршрут успішно збережено!');

      // Якщо параметри нового маршруту збігаються з поточним пошуком —
      // автоматично оновлюємо таблицю результатів
      if (parseFloat(searchKatanka) === katanka && parseFloat(searchWire) === wireDiameter) {
        await handleSearch();
      }

      // Через 1 секунду закриваємо вікно і очищаємо форму
      setTimeout(() => {
        setAddOpen(false);
        setSaveSuccess('');
        setAddKatanka('');
        setDies(Array(12).fill(''));
      }, 1000);
    } catch (err) {
      // Показуємо помилку якщо Supabase повернув помилку
      setSaveError('Помилка збереження: ' + err.message);
    } finally {
      // Вимикаємо індикатор збереження
      setSaving(false);
    }
  };

  // Закриває головне вікно і скидає всі стани пошуку
  const handleClose = () => {
    setIsOpen(false);
    setRoutes([]);
    setSearchKatanka('');
    setSearchWire('');
    setSearchError('');
  };

  // Закриває вікно додавання і очищає форму
  const handleCloseAdd = () => {
    setAddOpen(false);
    setSaveError('');
    setSaveSuccess('');
    setAddKatanka('');
    setDies(Array(12).fill(''));
  };

  // ── Рендер ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Кнопка яка відкриває головне модальне вікно */}
      <TriggerBtn onClick={() => setIsOpen(true)}>Маршрут</TriggerBtn>

      {/* ════ Головне модальне вікно — пошук маршруту ════ */}
      {isOpen && (
        // Оверлей — клік поза модальним вікном закриває його
        <Overlay onClick={handleClose}>
          {/* Зупиняємо спливання кліку щоб вікно не закрилось при кліку всередині */}
          <Modal onClick={e => e.stopPropagation()}>

            {/* Кнопка закрити у правому верхньому куті */}
            <BtnClose onClick={handleClose}>✕</BtnClose>
            <ModalTitle>🔍 Маршрут волочіння</ModalTitle>

            {/* Поля пошуку: діаметр катанки і діаметр готового дроту */}
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

            {/* Показуємо повідомлення про помилку або відсутність результатів */}
            {searchError && <ErrorMsg>{searchError}</ErrorMsg>}

            {/* Таблиця маршрутів — відображається тільки якщо є результати */}
            {routes.length > 0 && (
              <div style={{ overflowX: 'auto' }}> {/* Горизонтальний скрол для 14 колонок */}
                <ResultTable>
                  <thead>
                    <tr>
                      <Th>Катанка</Th>
                      <Th>Дріт</Th>
                      {/* Генеруємо заголовки В1..В12 динамічно */}
                      {DIES.map(n => <Th key={n}>В{n}</Th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Рендеримо рядок для кожного маршруту з бази */}
                    {routes.map((r, i) => (
                      <tr key={r.id ?? i}>
                        <Td>{r.katanka}</Td>
                        <Td>{r.wireDiameter}</Td>
                        {/* Виводимо значення d1..d12; якщо null — показуємо тире */}
                        {DIES.map(n => <Td key={n}>{r[`d${n}`] ?? '—'}</Td>)}
                      </tr>
                    ))}
                  </tbody>
                </ResultTable>
              </div>
            )}

            {/* Кнопки дій: пошук, додати маршрут, закрити */}
            <BtnRow>
              <BtnPrimary onClick={handleSearch} disabled={searching}>
                {searching ? 'Пошук...' : '🔍 Пошук'}
              </BtnPrimary>
              <BtnSecondary onClick={() => setAddOpen(true)}>
                ➕ Додати маршрут
              </BtnSecondary>
              <BtnSecondary onClick={handleClose}>Закрити</BtnSecondary>
            </BtnRow>

          </Modal>
        </Overlay>
      )}

      {/* ════ Вікно додавання нового маршруту ════ */}
      {addOpen && (
        // $zIndex={1100} — вище за головне модальне вікно (1000)
        <Overlay $zIndex={1100} onClick={handleCloseAdd}>
          <ModalLarge onClick={e => e.stopPropagation()}>

            <BtnClose onClick={handleCloseAdd}>✕</BtnClose>
            <ModalTitle>➕ Новий маршрут волочіння</ModalTitle>

            {/* Поле діаметра катанки — вхідний діаметр заготовки */}
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

            {/* Сітка 4×3 для введення діаметрів на кожній волоці d1..d12 */}
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
                      // Оновлюємо тільки змінений елемент масиву, решту не чіпаємо
                      const updated = [...dies];
                      updated[i] = e.target.value;
                      setDies(updated);
                    }}
                  />
                </DieField>
              ))}
            </DiesGrid>

            {/* Повідомлення про помилку або успіх збереження */}
            {saveError && <ErrorMsg>{saveError}</ErrorMsg>}
            {saveSuccess && <SuccessMsg>{saveSuccess}</SuccessMsg>}

            {/* Кнопки: зберегти в базу або скасувати */}
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
