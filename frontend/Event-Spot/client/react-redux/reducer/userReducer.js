const userInitialState  = [{_id:1,username:"i am user"}]
const userReducer = (state=userInitialState,action)=>{
    switch(action.type){
        
        case "GET_USER_BY_API":{
            return [...action.payload]
        }
        default:{
            return [...state]
        }
    }
}


export default userReducer