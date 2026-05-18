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

export const Row = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
`;

export const Label = styled.label`
  width: 140px;
  font-size: 0.85rem;
  color: #546e7a;
  font-weight: 500;
  flex-shrink: 0;
`;

export const StanSelect = styled.select`
  flex: 1;
  min-width: 180px;
  padding: 6px 8px;
  border: 1px solid #cfd8dc;
  border-radius: 6px;
  font-size: 0.85rem;
  background: #f9fafb;
  &:focus { outline: none; border-color: #42a5f5; }
`;

export const WideSelect = styled.select`
  flex: 1;
  min-width: 180px;
  padding: 6px 8px;
  border: 1px solid #cfd8dc;
  border-radius: 6px;
  font-size: 0.85rem;
  background: #f9fafb;
  &:focus { outline: none; border-color: #42a5f5; }
`;

export const SmallInput = styled.input`
  width: 70px;
  padding: 6px 8px;
  border: 1px solid #cfd8dc;
  border-radius: 6px;
  font-size: 0.9rem;
  text-align: center;
  background: #f9fafb;
  &:focus { outline: none; border-color: #42a5f5; }
`;

export const DateInput = styled.input`
  padding: 6px 8px;
  border: 1px solid #cfd8dc;
  border-radius: 6px;
  font-size: 0.85rem;
  background: #f9fafb;
  &:focus { outline: none; border-color: #42a5f5; }
`;

export const Buttons = styled.div`
  display:flex;
  padding:5px 14%;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 14px;
`;
export const SearchButton = styled.button`
  height:40px;
  padding: 8px 18px;
  background-color: #1565c0;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 700;
  font-size: 15px;
  transition: background 0.2s;

  &:hover {
    background-color: #0d47a1;
  }
`;

export const ActionButton = styled.button`
  flex: 1;
  padding: 8px 12px;
  background: ${({ $variant }) => $variant === 'save' ? '#2e7d32' : '#ef6c00'};
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
  &:hover { opacity: 0.88; }
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 10px;
`;

export const InfoCell = styled.div`
  background: #f0f4ff;
  border-radius: 8px;
  padding: 8px 10px;
`;

export const InfoLabel = styled.div`
  font-size: 0.75rem;
  color: #78909c;
  margin-bottom: 4px;
`;

export const InfoValue = styled.div`
  font-size: 1rem;
  font-weight: 700;
  color: #263238;
`;
