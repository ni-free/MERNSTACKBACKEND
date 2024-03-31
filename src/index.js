import dotenv from "dotenv"
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    path:'./.env'
})
connectDB()
.then(()=>{
    app.listen(process.env.PORT || 6000,()=>{
        console.log(`Server is running at PORT : ${process.env.PORT}`);
    })
})
.catch((err)=>console.log("MongoDb connection failed!!!!",err))