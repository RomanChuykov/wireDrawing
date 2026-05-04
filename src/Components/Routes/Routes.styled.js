import styled from 'styled-components';

// ── Кнопка-тригер що відкриває модальне вікно ────────────────────────────────
export const TriggerBtn = styled.button`
  padding: 8px 18px;
  background-color: #1565c0;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: background 0.2s;

  &:hover {
    background-color: #0d47a1;
  }
`;

// ── Напівпрозорий фон що перекриває сторінку позаду модального вікна ─────────
// $zIndex передається як prop — дозволяє накладати вікна одне на одне
export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${({ $zIndex }) => $zIndex ?? 1000};
`;

// ── Контейнер головного модального вікна (пошук) ────────────────────────────
export const Modal = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 28px;
  width: 440px;
  max-width: 95vw;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.25);
  position: relative; /* Потрібно для абсолютного позиціонування кнопки закрити */
`;

// ── Контейнер вікна додавання маршруту (ширше і з прокруткою) ───────────────
export const ModalLarge = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 28px;
  width: 560px;
  max-width: 97vw;
  max-height: 90vh;
  overflow-y: auto; /* Прокрутка якщо вміст не вміщується по висоті */
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.25);
  position: relative;
`;

// ── Заголовок модального вікна з нижньою рискою ─────────────────────────────
export const ModalTitle = styled.h3`
  margin: 0 0 20px 0;
  font-size: 18px;
  font-weight: 700;
  color: #1a237e;
  border-bottom: 2px solid #e8eaf6;
  padding-bottom: 10px;
`;

// ── Підпис над полем вводу ───────────────────────────────────────────────────
export const FieldLabel = styled.label`
  display: block;
  font-size: 13px;
  color: #555;
  margin-bottom: 4px;
  font-weight: 500;
`;

// ── Поле вводу для діаметрів катанки і дроту у формі пошуку/додавання ───────
// $maxWidth дозволяє обмежити ширину конкретного поля через prop
export const StyledInput = styled.input`
  width: 100%;
  padding: 8px 10px;
  border: 1.5px solid #c5cae9;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s;
  max-width: ${({ $maxWidth }) => $maxWidth ?? '100%'};

  &:focus {
    border-color: #3949ab;
  }
`;

// ── Компактне поле вводу для кожної з 12 волок у сітці ──────────────────────
export const DieInput = styled.input`
  padding: 6px 8px;
  border: 1.5px solid #c5cae9;
  border-radius: 5px;
  font-size: 13px;
  outline: none;
  box-sizing: border-box;
  width: 100%;
  transition: border-color 0.2s;

  &:focus {
    border-color: #3949ab;
  }
`;

// ── Горизонтальний рядок для двох полів пошуку поряд ────────────────────────
export const Row = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
`;

// ── Обгортка одного поля вводу з підписом ───────────────────────────────────
// $maxWidth — обмежує ширину (наприклад для поля катанки у формі додавання)
export const Field = styled.div`
  flex: 1;
  max-width: ${({ $maxWidth }) => $maxWidth ?? 'none'};
`;

// ── Сітка 4 колонки × 3 рядки для 12 полів волок ────────────────────────────
export const DiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-top: 8px;
`;

// ── Обгортка одного поля волоки (підпис + інпут) ────────────────────────────
export const DieField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

// ── Дрібний підпис над полем волоки ("Волока 1", "Волока 2" тощо) ────────────
export const DieLabel = styled.span`
  font-size: 11px;
  color: #757575;
  font-weight: 500;
`;

// ── Рядок з кнопками дій внизу модального вікна ─────────────────────────────
export const BtnRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
  flex-wrap: wrap; /* На вузьких екранах кнопки переносяться на новий рядок */
`;

// ── Синя кнопка головної дії (Пошук) ─────────────────────────────────────────
export const BtnPrimary = styled.button`
  padding: 9px 20px;
  background-color: #1565c0;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: background 0.2s;

  &:hover:not(:disabled) {
    background-color: #0d47a1;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

// ── Світла кнопка другорядної дії (Закрити, Скасувати, Додати маршрут) ───────
export const BtnSecondary = styled.button`
  padding: 9px 20px;
  background-color: #e8eaf6;
  color: #3949ab;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: background 0.2s;

  &:hover {
    background-color: #c5cae9;
  }
`;

// ── Зелена кнопка збереження (Зберегти маршрут) ──────────────────────────────
export const BtnSuccess = styled.button`
  padding: 9px 20px;
  background-color: #2e7d32;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: background 0.2s;

  &:hover:not(:disabled) {
    background-color: #1b5e20;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

// ── Кнопка ✕ у правому верхньому куті модального вікна ───────────────────────
export const BtnClose = styled.button`
  position: absolute;
  top: 14px;
  right: 16px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #9e9e9e;
  line-height: 1;
  transition: color 0.2s;

  &:hover {
    color: #333;
  }
`;

// ── Таблиця результатів пошуку маршрутів ─────────────────────────────────────
export const ResultTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
  font-size: 13px;
`;

// ── Комірка заголовку таблиці ────────────────────────────────────────────────
export const Th = styled.th`
  background-color: #e8eaf6;
  color: #283593;
  padding: 7px 10px;
  text-align: left;
  font-weight: 600;
`;

// ── Комірка даних таблиці; парні рядки мають легкий фон ──────────────────────
export const Td = styled.td`
  padding: 7px 10px;
  border-bottom: 1px solid #f0f0f0;
  color: #333;

  tr:nth-child(even) & {
    background-color: #fafafa;
  }
`;

// ── Блок з повідомленням про помилку (червоний) ───────────────────────────────
export const ErrorMsg = styled.div`
  color: #c62828;
  font-size: 13px;
  margin-top: 8px;
  padding: 8px 12px;
  background-color: #ffebee;
  border-radius: 6px;
`;

// ── Блок з повідомленням про успіх (зелений) ─────────────────────────────────
export const SuccessMsg = styled.div`
  color: #1b5e20;
  font-size: 13px;
  margin-top: 8px;
  padding: 8px 12px;
  background-color: #e8f5e9;
  border-radius: 6px;
`;
