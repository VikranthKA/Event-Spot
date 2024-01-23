import {useState,useEffect} from "react"
import {useSelector,useDispatch} from 'react-redux'
import {startGetUser} from "../../react-redux/action/userAction"

const DisplayUser = () => {
    const userData  = useSelector((state)=>{
        return state.user
    })
    const dispatch  = useDispatch()
      return (
    <div>
      <button onClick={()=>{dispatch(startGetUser())}}>Get data</button>
      <ul>
        {userData?.map((ele)=>{
            return (
                <li key={ele._id}>
                  {ele.name}
                </li>
            )
        })}
        {console.log(userData)}
      </ul>
    </div>
  )
}

export default DisplayUser

