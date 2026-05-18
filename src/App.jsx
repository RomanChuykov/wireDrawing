import './App.css';
import { ShiftProvider } from './context/ShiftContext.jsx';
import { BurgerMenu }    from './Components/burgerMenu/burgerMenu.jsx';
import { DataInput }     from './Components/DataInput/DataInput.jsx';
import { SpoolManager }  from './Components/SpoolManager/SpoolManager.jsx';
import { EarningsPanel } from './Components/EarningsPanel/EarningsPanel.jsx';
import { AppWrapper, AppTitle, AppSubtitle } from './App.styled.js';

function App() {
  return (
    <ShiftProvider>
      <AppWrapper>
        <BurgerMenu />
        <AppTitle>Помічник</AppTitle>
        <AppSubtitle>Волочільника дроту</AppSubtitle>

        <DataInput />
        <SpoolManager />
        <EarningsPanel />
      </AppWrapper>
    </ShiftProvider>
  );
}

export default App;
