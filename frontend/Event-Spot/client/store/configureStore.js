import {applyMiddleware,createStore,combineReducers} from "redux"
import {thunk} from "redux-thunk"
import userReducer from "../react-redux/reducer/userReducer"

const configureStore = ()=>{
    const store  = createStore(combineReducers({
        user:userReducer
    }),applyMiddleware(thunk))
    console.log(thunk)
    return store
}

export default configureStore