import styled from 'styled-components';

export const TriggerBtn = styled.button`
  padding: 10px 22px;
  background-color: #1565c0;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 700;
  font-size: 15px;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  transition: background 0.15s;

  &:active {
    background-color: #0d47a1;
  }
`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 1000;

  @media (min-width: 600px) {
    align-items: center;
  }
`;

export const ModalWrap = styled.div`
  background: #fff;
  border-radius: 16px 16px 0 0;
  padding: 18px 14px 28px;
  width: 100%;
  max-height: 94vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  box-shadow: 0 -4px 32px rgba(0, 0, 0, 0.2);
  position: relative;

  @media (min-width: 600px) {
    border-radius: 14px;
    width: 480px;
    max-width: 96vw;
    max-height: 90vh;
    padding: 24px 22px 26px;
    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.25);
  }
`;

export const ModalTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 10px;
  padding-right: 32px;
`;

export const BtnClose = styled.button`
  position: absolute;
  top: 16px;
  right: 14px;
  width: 34px;
  height: 34px;
  background: #f3f4f6;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  cursor: pointer;
  color: #6b7280;
  line-height: 1;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;

  &:active {
    color: #111827;
    background: #e5e7eb;
  }
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: 12px 12px;
  border-radius: 8px;
  background: #e8eaf6;
  font-size: 14px;
  font-weight: 700;
  color: #283593;
  user-select: none;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;

  &:active {
    background: #c5cae9;
  }
`;

export const SectionChevron = styled.span`
  font-size: 16px;
  transition: transform 0.22s;
  transform: ${({ $open }) => ($open ? 'rotate(0deg)' : 'rotate(-90deg)')};
  display: inline-block;
`;

export const SectionBody = styled.div`
  overflow: hidden;
  max-height: ${({ $open }) => ($open ? '2600px' : '0')};
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  transition: max-height 0.3s ease, opacity 0.22s ease;
  padding-top: ${({ $open }) => ($open ? '14px' : '0')};
`;

export const SectionDivider = styled.hr`
  border: none;
  border-top: 2px solid #e5e7eb;
  margin: 16px 0;
`;

export const ParamGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
  margin-bottom: 14px;

  @media (min-width: 420px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const ParamField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export const ParamLabel = styled.label`
  font-size: 12px;
  color: #4b5563;
  font-weight: 700;
`;

export const NumInput = styled.input`
  padding: ${({ $compact }) => ($compact ? '8px 8px' : '11px 10px')};
  border: 1.5px solid #c5cae9;
  border-radius: 8px;
  font-size: ${({ $compact }) => ($compact ? '15px' : '16px')};
  outline: none;
  box-sizing: border-box;
  width: 100%;
  min-height: 42px;
  text-align: center;
  font-weight: ${({ $compact }) => ($compact ? '700' : '500')};
  -webkit-appearance: none;
  appearance: none;
  transition: border-color 0.15s, background 0.15s;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &[type='number'] {
    -moz-appearance: textfield;
  }

  &:focus {
    border-color: #3949ab;
    background: #f3f4ff;
  }
`;

export const InfoBar = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 14px;
  padding: 10px;
  background: #e8f5e9;
  border-radius: 8px;
  border-left: 3px solid #2e7d32;
`;

export const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  text-align: center;

  span {
    font-size: 10px;
    color: #4b5563;
    font-weight: 600;
  }

  strong {
    font-size: 13px;
    color: #1b5e20;
    font-weight: 800;
  }
`;

export const RouteList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const RouteItem = styled.div`
  display: grid;
  grid-template-columns: 76px 1fr;
  gap: 8px;
  align-items: stretch;
  padding: 8px;
  border: 1px solid ${({ $mismatch }) => ($mismatch ? '#ef9a9a' : '#e5e7eb')};
  border-radius: 8px;
  background: ${({ $mismatch, $isWire }) =>
    $mismatch ? '#ffebee' : $isWire ? '#fce4ec' : '#ffffff'};
`;

export const RouteName = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 58px;
  padding: 6px;
  border-radius: 7px;
  background: #e3f2fd;
  color: #0d47a1;
  font-size: 13px;
  font-weight: 800;
  text-align: center;
`;

export const RouteValues = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  min-width: 0;
`;

export const RouteInputCell = styled.label`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;

  span {
    color: #6b7280;
    font-size: 11px;
    font-weight: 700;
    text-align: center;
  }
`;

export const RouteValue = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  min-width: 0;
  min-height: 42px;
  padding: 6px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #f9fbe7;
  text-align: center;

  span {
    color: #6b7280;
    font-size: 11px;
    font-weight: 700;
  }

  strong {
    color: #33691e;
    font-size: 16px;
    font-weight: 800;
  }
`;

export const ErrorMsg = styled.div`
  color: #b71c1c;
  font-size: 12px;
  margin-top: 10px;
  padding: 9px 12px;
  background-color: #ffebee;
  border-radius: 8px;
  line-height: 1.4;
`;

export const BtnRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 18px;
`;

export const BtnSecondary = styled.button`
  width: 100%;
  padding: 12px 24px;
  background-color: #e8eaf6;
  color: #3949ab;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 800;
  font-size: 15px;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;

  &:active {
    background-color: #c5cae9;
  }
`;
