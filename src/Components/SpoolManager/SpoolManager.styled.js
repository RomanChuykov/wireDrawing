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

export const Controls = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 14px;
`;

export const MassLabel = styled.span`
  font-size: 0.85rem;
  color: #546e7a;
  font-weight: 500;
`;

export const MassInput = styled.input`
  width: 50px;
  padding: 6px 8px;
  border: 1px solid #cfd8dc;
  border-radius: 6px;
  font-size: 0.9rem;
  text-align: center;
  background: #f9fafb;
  &:focus { outline: none; border-color: #42a5f5; }
`;



export const AddButton = styled.button`
  width: 65px;
  padding: 5px 7px;
  background: #1976d2;
  color: #fff;
  border: none;
  border-radius: 7px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  &:hover { background: #1565c0; }
`;

export const RemoveButton = styled.button`
  width: 80px;
  padding: 5px 7px;
  background: #ef5350;
  color: #fff;
  border: none;
  border-radius: 7px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
  &:hover { opacity: 0.85; }
  &:disabled {
    background: #b0bec5;
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

export const SpoolGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

export const SpoolChip = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 5px 8px;
  background: #e8f0fe;
  border-radius: 8px;
  font-size: 13px;
  border: 1px solid #c5cae9;
`;

export const SpoolIndex = styled.span`
  color: #5c6bc0;
  font-weight: 700;
  font-size: 12px;
`;

export const SpoolMassInput = styled.input`
  width: 48px;
  font-size: 13px;
  padding: 2px 4px;
  border: 1px solid #c5cae9;
  border-radius: 4px;
  text-align: center;
  background: #fff;
  &:focus { outline: none; border-color: #5c6bc0; }
`;

export const SpoolUnit = styled.span`
  color: #78909c;
  font-size: 12px;
`;

export const RemoveChipBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #90a4ae;
  font-size: 12px;
  padding: 0 2px;
  line-height: 1;
  transition: color 0.15s;
  &:hover { color: #e53935; }
`;

export const EmptyNote = styled.p`
  color: #b0bec5;
  font-size: 0.85rem;
  text-align: center;
  margin: 8px 0 0;
  font-style: italic;
`;
