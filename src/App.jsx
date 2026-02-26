import { useState } from 'react'
import {span} from "./App.styled.js"
import './App.css'

function App() {
  const [count, setCount] = useState(0);
  const [diameter, setDiameter] = useState(0);
  const [massaSpool, setMassaSpool] = useState(0);
  const [price, setPrice] = useState(0);
  
 
  const today = new Date();
  const totalMassa = count * massaSpool;
  const totalEarnings=totalMassa/1000*price;
  /*useEffect(() => {
   totalMassa=totalMassa+massaSpool;
  }, [count]);*/
    

  return (
    <>
      <div>
       <h1>Волочіння дроту</h1>
    
        <div>
          <span>сьогодні</span>
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
        <button onClick={() => setCount(count + 1)}>▲</button>
        <button onClick={() => setCount(count - 1)}>▼</button>
      </div>
      <div>
        <p>всього тон {totalMassa}</p>
        <p>всього заробив - {totalEarnings}</p>
      </div>      
      </div>
     
    </>
  )
}


export default App;
