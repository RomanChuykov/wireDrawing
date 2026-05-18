import styled from 'styled-components';

export const Section = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
`;

export const SectionTitle = styled.h3`
  margin: 0 0 14px 0;
  font-size: 1rem;
  font-weight: 700;
  color: #37474f;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 8px;
`;

export const CurrentBlock = styled.div`
  background: linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%);
  border: 1px solid #a5d6a7;
  border-radius: 10px;
  padding: 12px 14px;
`;

export const CurrentTitle = styled.h4`
  margin: 0 0 10px 0;
  color: #2e7d32;
  font-size: 0.9rem;
`;

export const StatRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 5px;
  font-size: 0.9rem;
  color: #37474f;
`;

export const StatLabel = styled.span`
  color: #78909c;
  font-size: 0.82rem;
  min-width: 80px;
`;

export const BigValue = styled.span`
  font-size: 1.3em;
  font-weight: 700;
  color: #2e7d32;
`;

export const ResultsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const ResultCard = styled.div`
  background: #fafafa;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 10px 12px;
`;

export const ResultRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-size: 0.85rem;
  margin-bottom: 3px;
  color: #455a64;
`;

export const ResultLabel = styled.span`
  color: #90a4ae;
`;

export const ResultValue = styled.span`
  font-weight: ${({ $accent }) => $accent ? '700' : '500'};
  color: ${({ $accent }) => $accent ? '#1976d2' : '#263238'};
`;

export const SpoolDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 6px;
`;

export const SpoolBadge = styled.span`
  padding: 2px 8px;
  background: #dde8ff;
  border-radius: 4px;
  font-size: 12px;
  color: #3949ab;
`;

export const Divider = styled.hr`
  border: none;
  border-top: 2px solid #e0e0e0;
  margin: 16px 0;
`;

export const TotalBlock = styled.div`
  background: linear-gradient(135deg, #e3f2fd 0%, #ede7f6 100%);
  border: 1px solid #90caf9;
  border-radius: 10px;
  padding: 12px 14px;
`;

export const TotalTitle = styled.h4`
  margin: 0 0 10px 0;
  color: #1565c0;
  font-size: 0.9rem;
`;

export const TotalRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 5px;
  font-size: 0.9rem;
  color: #37474f;
`;

export const GrandValue = styled.span`
  font-size: 1.4em;
  font-weight: 800;
  color: #1565c0;
`;
