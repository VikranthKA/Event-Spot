import React,{useState,useEffect} from 'react'
import axios from '../Api_Resources/axios'
function Create() {
    const [category,setCategory] = useState("")
    const [allCategory,setAllCategory] = useState([])

    const handleCreateCategory = async()=>{
        if(category) {
            try{

                const response  = await axios.post('/api/category',{name:category})
                console.log(response.data)
            }catch(err){
                console.log(err)
            }
        }
    }
    useEffect(()=>{
        (async function getAllCategories(){

            try{
                const response = await axios.get('/api/categoryall')
                setAllCategory(response.data)
            }catch(err){
    
            }
        })()
    },[category])

    const handleCategoryDelete = async(id)=>{
            try{
                const {data}  = await axios.delete(`/api/category/${id}`)
                if(data){
                    const deleteCategory = allCategory.filter((category)=>category._id !== id)
                    setAllCategory(deleteCategory)
                }else{
                    //add the not found page or semthing went page
                    console.log('Something Went Wrong')
                    
                }
            }catch(err){
                console.log(err)
            }

    }
    const handleCategoryEdit=(id)=>{

    }
  return (
    <div>
    <div>Create</div>
    <input type="text" value={category} onChange={(e)=>setCategory(e.target.value)}/>
    <button onClick={handleCreateCategory}>Create</button>
    <ul>
        {allCategory.map((category)=>{
            return(
                <div>
                    <li key={category._id}>{category.name}<button onClick={()=>{handleCategoryEdit(category._id)}}>Edit</button><button onClick={()=>handleCategoryDelete(category._id)}>Delete</button></li>
                </div>
            )
        })}
    </ul>
    </div>
    
    )
}

export default Create