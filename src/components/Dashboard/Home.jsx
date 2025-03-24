import React, { useContext } from 'react'
import { UserContext } from '../../Context/UserContext'
import { useNavigate } from 'react-router-dom'
import Navbar from './Navbar/Navbar'
import BettingInterface from './mini-components/BettingInterface'

const Home = () => {

  const{logout} = useContext(UserContext)
  const navigate = useNavigate()

  const handlelogout = ()=>{
    logout()
    navigate("/login")
  }

  return (
    <div>
      <Navbar/>
      <BettingInterface/>
      <button onClick={handlelogout}>logout</button>
    </div>
  )
}

export default Home
