import "./style.scss"
import { ReactComponent as Logo } from "../../assets/icons/login-logo.svg"
import { useState } from "react"
import Element from "./Element"

const Dashboard = () => {
  // const [elements, setElements] = useState([
  //   { id: Math.random(), name: 'aaa' },
  //   { id: Math.random(), name: 'bbb' },
  //   { id: Math.random(), name: 'ccc' },
  // ])

  // const [counter, setCounter] = useState(0)


  return (
    <div className="DashboardPage" >
      <Logo width={500} height={500} />
{/* 
      <h1>{ counter }</h1>
      <button onClick={() => setCounter(prev => prev + 1)} >SET COUNTER</button>


      {
        elements.map(element => (
          <Element key={element.id} element={element} />
        ))
      } */}


    </div>
  )
}

export default Dashboard
