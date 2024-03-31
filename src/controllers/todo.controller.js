import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import  { User} from '../models/user.model.js'
import {Todo} from "../models/todo.model.js";
export const addTodo = asyncHandler(async (req, res) => {
    const { title ,userid
    } =  req.body;
    if(!(title && userid))

        throw new  ApiError("all fields are required",400)

        var existing = await User.findById(userid
        )
        if(!existing)
          {
            throw new ApiError(400,"Recheck email")
          }
        
         
            const todos = new Todo({title , userid:existing._id })
          
           existing.todo.push(todos)
         
         
       res.status(200).json({
            success:true,
            todos,
            existing,
            message:"Todo added Sucessfully"
        })
})

 export const updateTodo=  asyncHandler(async (req, res) => {
    const { title ,id
    } =  req.body;
    if(!(title ))

    throw new ApiError(500, "Something went wrong!!");


        const existing = await User.findById(
        id
        )
        if(!existing)
          {
            throw new ApiError(500, "Something went wrong!!");

          }
        
          const todo= await Todo.findByIdAndUpdate(req.params.id,{title})
        return  todo.save().then(()=> res.status(200).json({
            success:true,
            message:"Todo updated"
        }))
         
       
})


export const deleteTodo=  asyncHandler(async (req, res) => {
   c
   


        const existing = await User.findById(req.params.id)
       
        if(!existing)
          {
            throw new ApiError(500, "Something went wrong!!");

          }
        else
         {
          const todo= await Todo.findByIdAndDelete(req.params.id)
           todo.save().then(()=> res.status(200).json({
            success:true,
            message:"Todo Deleted"
        }))
         }
       
})

export const getTodo = asyncHandler(async(req,res)=>{
    const todo = await Todo.find({userid:req.params.id}).sort({createdAt:-1})
    response.status(200).json(todo)
})
