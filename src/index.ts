import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import http from 'http';
import { configDotenv } from 'dotenv';
import connectToDb from './config/db.config';
import routers from './routes';

const whitelist = ['http://localhost:3000','http://localhost:5000']
const corsOptions = {
  origin: ['http://localhost:3000','http://localhost:5000'],
   credentials: true,
}


const app = express();
app.use(cors(corsOptions))
// app.use(cors({origin:"*",credentials:true}))
app.use(express.json())
app.use(cookieParser())
// config env file 
configDotenv()
// database connection
connectToDb()


// Define a route
app.get('/',(req: Request, res: Response) => {
    res.json("hii");
});
app.use('/api', routers);

// Create and start the HTTP server
http.createServer(app).listen(process.env.PORT ||  4000, (err?: Error) => {
    if (err) {
        console.log(err);
    } else {
        console.log(`Server running on port ${process.env.PORT}`);
    }
});
