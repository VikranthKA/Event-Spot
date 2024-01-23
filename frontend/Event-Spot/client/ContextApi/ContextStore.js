import {useState,useEffect} from 'react'
import axios from '../components/Api_Resources/axios'
import Context from './Context' 
import {useNavigate} from 'react-router-dom'
import {jwtDecode} from 'jwt-decode'

function ContextStore({children}) {
    const [isLogin,setIsLogin] = useState(false)

    const navigate = useNavigate()

    const handleLogin=()=>{
        setIsLogin(true)
        //navigate('/profile')
    }

    const handleLogout=()=>{
        setIsLogin(true)
        localStorage.removeItem('token')
        navigate('/login')
    }


    useEffect(()=>{
        const login = localStorage.getItem('token')
        if(login) setIsLogin(true)
    })
  return (
    <div>
        <Context.Provider

            value={{isLogin,handleLogin,handleLogout}}
        
        >

        {children}
        </Context.Provider>

    </div>
  )
}

export default ContextStore
