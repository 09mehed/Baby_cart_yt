import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js';
import userRoute from './routes/userRoute.js';
import cors from 'cors'
dotenv.config()
const app = express()
const PORT = process.env.PORT || 5000;

connectDB();

const allowedOrigin = [process.env.ADMIN_URL].filter(Boolean);
app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true);
    if(process.env.NODE_ENV === "development"){
      return callback(null, true)
    }
  },
  credentials: true,
  methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-type", "Authorization"],
}))
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ limit: "10mb", extended: true }))

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoute)
app.get("/api/products", (req, res) => {
    res.send("product route is working")
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(PORT, () => {
  console.log(`Server in running on port ${PORT}`)
})
