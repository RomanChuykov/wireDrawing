import { useState, useEffect} from 'react'

import './App.css'

function App() {
  const [count, setCount] = useState(0);
  const [diameter, setDiameter] = useState(0);
  const [massaSpool, setmassaSpool] = useState(0);
  const [price, setPrice] = useState(0);
  
 
  const today = new Date();
  let totalMassa=0;
  let totalEarnings=0;
  useEffect(() => {
   totalMassa=totalMassa=massaSpool
    };
  }, [count])
    
  }
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
          <input  id='diameter' type='number' value={diameter}></input>
        </div>
      <div>
        <span>Кілограм на шпулі</span>
        <input  id='massaSpool' type='number' value={massaSpool}></input>
      </div>
       <div>
        <span>ціна за тону</span>
        <input  id='price' type='number' value={price}></input>
      </div>
      <div>
        <span>кількість шпуль</span>
        <input id='countSpool' type='number' value={count} step='1'></input>
        <button onClick={() => setCount(count + 1)}>▲</button>
        <button onClick={() => setCount(count - 1)}>▼</button>
      </div>
      <div>
        <p>всього тон</p>
        <p>всього заробив</p>
      </div>      
      </div>
     
    </>
  )
}

export default App
