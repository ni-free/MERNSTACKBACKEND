import mongoose ,{Mongoose, Schema} from "mongoose";

const  todoSchema = new Schema({
    title:{
        type:String,
        required : true,
        
        lowercase:true,
        trim:true,
        index:true
    },
    userid:{
        type:Schema.Types.ObjectId,
        ref:"User"
        
      
    } ,
    status:{
        type:String,
        enum:["Pending","Completed"],
        default:"Pending"
    }
 
   
   
},{timestamps:true})




export const Todo = mongoose.model("Todo",todoSchema)