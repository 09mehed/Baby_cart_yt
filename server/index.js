const express = require('express')
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
dotenv.config()
const app = express()
const PORT = process.env.PORT || 5000;

connectDB();

app.use(express.json())

app.use('/api/users', authRoutes);

app.get("/api/products", (req, res) => {
    res.send("product route is working")
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(PORT, () => {
  console.log(`Server in running on port ${PORT}`)
})
