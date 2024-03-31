import mongoose ,{Mongoose, Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
import validator from 'validator'
const  userSchema = new Schema({
    username:{
        type:String,
        required : true,
        unique : true,
        lowercase:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        required : true,
        unique : true,
        lowercase:true,
        trim:true,
        validate:[validator.isEmail,"Please provide valid email"]
    },
    fullname:{
        type:String,
        required : true,
        trim:true,
        index:true
    },
  
 
    password:{
        type:String,
        required: [true , 'Password is required'],
    },
    todo:[
        {
            type: Schema.Types.ObjectId,
            ref : "Todo"
          
        },
    ],
    refreshToken:{
        type:String
    }
   
},{timestamps:true})

userSchema.pre("save",async function(next){
    if(!this.isModified("password"))
       return next()
    this.password= await bcrypt.hash(this.password,10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}
userSchema.methods.generateAccessToken = function(){
      return jwt.sign(
        {
            _id: this._id,
            email : this.email,
            username:this.username,
            fullname:this.fullname
        },
        process.env.ACESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACESS_TOKEN_EXPIRY
        }
       )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email : this.email,
            username:this.username,
            fullname:this.fullname
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
       )
}
export const User =mongoose.model("User",userSchema)