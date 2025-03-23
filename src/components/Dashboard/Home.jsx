import React, { useContext } from 'react'
import { UserContext } from '../../Context/UserContext'
import { useNavigate } from 'react-router-dom'

const Home = () => {

  const{logout} = useContext(UserContext)
  const navigate = useNavigate()

  const handlelogout = ()=>{
    logout()
    navigate("/login")
  }

  return (
    <div>
      <h1 className="text-white">Hello this is home page</h1>
      <button onClick={handlelogout}>Logout</button>
    </div>
  )
}

export default Home
