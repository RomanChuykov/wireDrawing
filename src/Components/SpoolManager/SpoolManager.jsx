import { useState } from 'react';
import { useShift } from '../../context/ShiftContext.jsx';
import {
  Section, SectionTitle, Controls, MassLabel, MassInput,
  AddButton, RemoveButton, SpoolGrid, SpoolChip,
  SpoolIndex, SpoolMassInput, SpoolUnit, RemoveChipBtn, EmptyNote,
} from './SpoolManager.styled.js';

export function SpoolManager() {
  const {
    spools, setSpools,
    results,
    persistShift,
  } = useShift();

  // ── Локальний стейт ───────────────────────────────────────────────────────
  const [currentMassa, setCurrentMassa] = useState(850);

  // ── Обробники ─────────────────────────────────────────────────────────────
  const handleAddSpool = () => {
    const updated = [...spools, { massa: currentMassa }];
    setSpools(updated);
    persistShift(results, updated);
  };

  const handleRemoveSpool = () => {
    if (spools.length === 0) return;
    const updated = spools.slice(0, -1);
    setSpools(updated);
    persistShift(results, updated);
  };

  const handleRemoveSpoolAt = (index) => {
    const updated = spools.filter((_, i) => i !== index);
    setSpools(updated);
    persistShift(results, updated);
  };

  const handleSpoolMassaChange = (index, value) => {
    const updated = [...spools];
    updated[index] = { ...updated[index], massa: Number(value) };
    setSpools(updated);
    persistShift(results, updated);
  };

  // ── Рендер ────────────────────────────────────────────────────────────────
  return (
    <Section>
      <SectionTitle>Шпулі</SectionTitle>

      <Controls>
        <MassLabel>Маса (кг):</MassLabel>
        <MassInput
          type="number"
          value={currentMassa}
          onChange={(e) => setCurrentMassa(Number(e.target.value))}
        />
        <AddButton onClick={handleAddSpool}>▲ Додати</AddButton>
        <RemoveButton onClick={handleRemoveSpool} disabled={spools.length === 0}>
          ▼ Видалити останню
        </RemoveButton>
      </Controls>

      {spools.length > 0 ? (
        <SpoolGrid>
          {spools.map((spool, index) => (
            <SpoolChip key={index}>
              <SpoolIndex>#{index + 1}</SpoolIndex>
              <SpoolMassInput
                type="number"
                value={spool.massa}
                onChange={(e) => handleSpoolMassaChange(index, e.target.value)}
              />
              <SpoolUnit>кг</SpoolUnit>
              <RemoveChipBtn onClick={() => handleRemoveSpoolAt(index)} title="Видалити">
                ✕
              </RemoveChipBtn>
            </SpoolChip>
          ))}
        </SpoolGrid>
      ) : (
        <EmptyNote>Шпулі ще не додані</EmptyNote>
      )}
    </Section>
  );
}
