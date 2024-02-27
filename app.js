import dotenv from 'dotenv'
dotenv.config()
import express from 'express';
import userRoutes from './routes/userRoutes.js'
import cors from 'cors';
import connectDB from './config/connectDB.js';


const app = express();
const PORT = process.env.PORT || 8000;
const DATABASEURL = process.env.DATABASE_URL 

connectDB(DATABASEURL)

app.use(cors());
app.use(express.json())
app.use('/api/user', userRoutes)


app.listen(PORT , ()=>{
    console.log(`Server is running on port ${PORT}`);
})