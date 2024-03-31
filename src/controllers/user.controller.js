import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from '../models/user.model.js'
import { ApiResponse } from "../utils/ApiResponse.js";
import { Todo } from "../models/todo.model.js";
const generateAccessAndRefreshTokens = async(userId)=>{
    try{
     const user=   await User.findById(userId)
    const accessToken= user.generateAccessToken()
    const refreshToken =user.generateRefreshToken()
    user.refreshToken= refreshToken
   await  user.save({validateBeforeSave :false})

    return {accessToken ,refreshToken}
    }
    catch(error){
           throw new ApiError(500,"Sonthing went wrong!!")
    }
}
const registerUser = asyncHandler(async (req,res)=>{
    
 
    const {fullname ,email , username ,  password }=req.body
     
    //console.log("Email:",email);
    
    if([fullname,email,username,password].some((field)=>field?.trim()===""))
        throw new ApiError(400,"All fields are required")
  
           
 
 const existedUser= await User.findOne({
         $or:[{username},{email}]
     })   
 
     if(existedUser){
         throw new ApiError(409,"User with username or email exist")
     }
 
     
   
 
   const user =await  User.create({
     fullname,
    
     email ,
     password,
    username:  username ? username.toLowerCase() : 'user'
 
    })    
   
     const createdUser=await User.findById(user._id).select(
         "-password -refreshToken"
     )
 
    if(!createdUser)
      throw new ApiError(500,"Something went wrong while registering user")
 
     return res.status(201).json(
         new ApiResponse(200,createdUser,"User Registered Successfully")
         ) 
 })
 
 const loginUser = asyncHandler(async (req,res)=>{
  
    const {email , username , password } = req.body
    console.log("Request body:", req.body);

  console.log(email);
  
  if (!(email || username)) {
    throw new ApiError(400, "Username or email is required");
}


   const user = await  User.findOne({
        $or :[{username},{email}]
    })
    
    if(!user)
      throw new ApiError(404,'User doesnot exist please register first')

    const isPasswordValid= await user.isPasswordCorrect (password)

     
    if(!isPasswordValid){
        throw new ApiError(402,'Invalid user credentials!!')
    }
  const{accessToken,refreshToken}=  await generateAccessAndRefreshTokens(user._id)
   const loggedInUser = await User.findById(user._id).
   select("-password -refreshToken")

   const options={
    httpOnly :true,
    secure :true
   }
   return res
   .status(200)
   .cookie("accessToken",accessToken,options)
   .cookie("refreshToken",refreshToken,options)
   .json(
    new ApiResponse(
        200,
        {
            user : loggedInUser,accessToken,refreshToken
        },
        "User Logged in Successfully"
    )
   )
})

const logoutUser = asyncHandler(async(req,res)=>{
  await  User.findByIdAndUpdate(
        req.user._id,
        {
            $unset :{
                refreshToken:undefined
            }
        },{
            new:true
        }
    )
    const options={
        httpOnly :true,
        secure :true
       }
       return res
       .status(200)
       .clearCookie("accessToken",options)
       .clearCookie("refrehToken",options)
       .json(new ApiResponse(200,{},"User Logged Out"))
})
export const addTodo = asyncHandler(async (req, res) => {
    const { title ,userid
    } =  req.body;
    if(!(title && userid))

        throw new  ApiError("all fields are required",400)

        const existing = await User.findById(userid
        )
        if(!existing)
          {
            throw new ApiError(400,"Recheck email")
          }
        
         
            const todos = new Todo({title , userid:existing._id })
          
           existing.todo.push(todos)
             //console.log(existing);
         
     return  res.status(200).json({
            success:true,
            
            existing,
            message:"Todo added Sucessfully"
        })
})

 export {registerUser,generateAccessAndRefreshTokens,loginUser,logoutUser}
