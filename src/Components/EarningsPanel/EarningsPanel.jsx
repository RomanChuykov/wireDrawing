import { useShift } from '../../context/ShiftContext.jsx';
import {
  Section, SectionTitle,
  CurrentBlock, CurrentTitle, StatRow, StatLabel, BigValue,
  ResultsList, ResultCard, ResultRow, ResultLabel, ResultValue,
  SpoolDetails, SpoolBadge,
  Divider, TotalBlock, TotalTitle, TotalRow, GrandValue,
} from './EarningsPanel.styled.js';

export function EarningsPanel() {
  const {
    results,
    currentMoney, currentTons, currentCount,
    grandTotalMoney, grandTotalTons,
  } = useShift();

  return (
    <Section>
      <SectionTitle>Заробіток</SectionTitle>

      {/* Поточний діаметр */}
      <CurrentBlock>
        <CurrentTitle>✅ Поточний діаметр</CurrentTitle>
        <StatRow>
          <StatLabel>Заробив:</StatLabel>
          <BigValue>{currentMoney.toFixed(2)} грн</BigValue>
        </StatRow>
        <StatRow>
          <StatLabel>Тон:</StatLabel>
          <span>{currentTons.toFixed(3)} т</span>
        </StatRow>
        <StatRow>
          <StatLabel>Шпуль:</StatLabel>
          <span>{currentCount} шт.</span>
        </StatRow>
      </CurrentBlock>

      {/* Збережені результати */}
      {results.length > 0 && (
        <>
          <SectionTitle as="h4" style={{ marginTop: '16px' }}>
            Збережені результати
          </SectionTitle>
          <ResultsList>
            {results.map((result, index) => (
              <ResultCard key={index}>
                <ResultRow>
                  <ResultLabel>Діаметр</ResultLabel>
                  <ResultValue>{result.diameter} мм</ResultValue>
                </ResultRow>
                <ResultRow>
                  <ResultLabel>Ціна за тону</ResultLabel>
                  <ResultValue>{result.price} грн</ResultValue>
                </ResultRow>
                <ResultRow>
                  <ResultLabel>Шпуль</ResultLabel>
                  <ResultValue>{result.countSpool} шт.</ResultValue>
                </ResultRow>
                <ResultRow>
                  <ResultLabel>Тон</ResultLabel>
                  <ResultValue>{result.totalTons.toFixed(3)} т</ResultValue>
                </ResultRow>
                <ResultRow>
                  <ResultLabel>Заробив</ResultLabel>
                  <ResultValue $accent>{result.totalMoney.toFixed(2)} грн</ResultValue>
                </ResultRow>
                <details>
                  <summary style={{ cursor: 'pointer', color: '#78909c', fontSize: '12px', marginTop: '6px' }}>
                    Деталі шпуль
                  </summary>
                  <SpoolDetails>
                    {result.spools.map((s, i) => (
                      <SpoolBadge key={i}>#{i + 1}: {s.massa} кг</SpoolBadge>
                    ))}
                  </SpoolDetails>
                </details>
              </ResultCard>
            ))}
          </ResultsList>
        </>
      )}

      {/* Підсумок */}
      <Divider />
      <TotalBlock>
        <TotalTitle>📊 Всього за зміну</TotalTitle>
        <TotalRow>
          <StatLabel>Заробив усього:</StatLabel>
          <GrandValue>{grandTotalMoney.toFixed(2)} грн</GrandValue>
        </TotalRow>
        <TotalRow>
          <StatLabel>Тон усього:</StatLabel>
          <span>{grandTotalTons.toFixed(3)} т</span>
        </TotalRow>
      </TotalBlock>
    </Section>
  );
}
