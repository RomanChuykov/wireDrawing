import { useState } from 'react'
import {Today} from "./App.styled.js"
import './App.css'

function App() {
  const [count, setCount] = useState(0);
  const [diameter, setDiameter] = useState(3.00);
  const [massaSpool, setMassaSpool] = useState(800);
  const [price, setPrice] = useState(100.00);
  const [totalMoney,setTotalMoney]=useState(0);
  const [totalTons,setTotalTons]=useState(0);
  const [results, setResults] = useState([]);

  const today = new Date();
  
     
 
  //    functions
 
  const handleIncrement=()=>{
    const tons=massaSpool/1000;
    const earningPerSpool=(tons*price);
    setCount(prev=>prev+1);
    setTotalMoney(prev=>prev+earningPerSpool)
    setTotalTons(prev=>prev+tons)
  }

  const handleDecrement=() =>{
    if (count<=0)return
     const tons=massaSpool/1000;
    const earningPerSpool=(tons*price);
     setCount(prev=>prev-1);
     setTotalMoney(prev=>prev-earningPerSpool)
      setTotalTons(prev=>prev-tons)
  }

  const handleNewDiameter = () => {
    if (count === 0) {
      alert('Спочатку введіть кількість шпуль');
      return;
    }
    
    // Зберігаємо результати
    setResults([...results, {
      diameter,
      price,
      countSpool: count,
      totalMoney,
      totalTons
    }]);
    
    // Обнуляємо поля для нового діаметру та ціни
    setDiameter(3.00);
    setPrice(100.00);
    setCount(0);
    setTotalMoney(0);
    setTotalTons(0);
    setMassaSpool(800); // Можна залишити попереднє значення
  }

  return (
    <>
      <div>
       <h1>Волочіння дроту</h1>
    
        <div>
          <Today>сьогодні</Today>
          {today.toLocaleDateString()}
        </div>

        <div>
          <span>Діаметр дроту</span>
          <input  id='diameter' 
                  type="number"
                  step="0.01"
                  inputMode="decimal"
                  value={diameter}
                  onChange={(e) => {
                    const value = e.target.value.replace(',', '.');
                    setDiameter(Number(value));}}></input>
        </div>
      <div>
        <span>Кілограм на шпулі</span>
        <input  id='massaSpool' 
                type='number' 
                value={massaSpool}
                onChange={(e)=> setMassaSpool(Number(e.target.value))}></input>
      </div>
       <div>
        <span>ціна за тону</span>
        <input  id='price' 
                type="number"
                step="0.01"
                inputMode="decimal"
                value={price}
                onChange={(e)=> setPrice(e.target.value)}></input>
      </div>
      <div>
        <span>кількість шпуль</span>
        <input id='countSpool' 
               type='number' 
               value={count}
               onChange={(e)=> setCount(Number(e.target.value))}></input>
        <button onClick={handleIncrement}>▲</button>
        <button onClick={handleDecrement}>▼</button>
      </div>
      <button onClick={handleNewDiameter}>Новий діаметр</button>
      <div>
        <p>всього заробив - {totalMoney.toFixed(2)}</p>
        <p>всього тон за сесію - {totalTons.toFixed(2)}</p>
      </div>

      {results.length > 0 && (
        <div style={{marginTop: '20px', borderTop: '2px solid #ccc', paddingTop: '20px'}}>
          <h3>Збережені результати</h3>
          {results.map((result, index) => (
            <div key={index} style={{marginBottom: '10px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '5px'}}>
              <p><strong>Діаметр:</strong> {result.diameter} мм</p>
              <p><strong>Ціна за тону:</strong> {result.price} грн</p>
              <p><strong>Кількість шпуль:</strong> {result.countSpool}</p>
              <p><strong>Тон:</strong> {result.totalTons.toFixed(2)}</p>
              <p><strong>Заробив:</strong> {result.totalMoney.toFixed(2)} грн</p>
            </div>
          ))}
        </div>
      )}
      </div>
     
    </>
  )
}


export default App;
