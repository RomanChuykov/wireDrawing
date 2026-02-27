import { useState } from 'react'
import {Today} from "./App.styled.js"
import './App.css'

function App() {
  const [count, setCount] = useState(0);
  const [diameter, setDiameter] = useState(3);
  const [massaSpool, setMassaSpool] = useState(800);
  const [price, setPrice] = useState(100);
  const [totalMoney,setTotalMoney]=useState(0);
  const [totalTons,setTotalTons]=useState(0);

  const today = new Date();
  const totalMassa = count * massaSpool;
  const totalEarnings=totalMassa/1000*price;
 
  //    functions
 
  const handleIncrement=()=>{
    const tons=massaSpool/1000;
    const earningPerSpool=(tons*price);
    setCount(prev=>prev+1);
    setTotalMoney(prev=>prev+earningPerSpool)
    setTotalTons(prev=>prev+tons)
  }

  const handleDecrement=() =>{
    if (count<0)return
     const tons=massaSpool/1000;
    const earningPerSpool=(tons*price);
     setCount(prev=>prev-1);
     setTotalMoney(prev=>prev-earningPerSpool)
      setTotalTons(prev=>prev-tons)
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
                  type ='number' 
                  value={diameter}
                  onChange={(e)=> setDiameter(e.target.value)}></input>
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
                type='number' 
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
      <div>
        <p>всього тон {totalMassa/1000}</p>
        <p>всього заробив - {totalMoney}</p>
      </div>      
      </div>
     
    </>
  )
}


export default App;
