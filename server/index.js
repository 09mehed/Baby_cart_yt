const express = require('express')
const dotenv = dotenv()
.dotenv.config()
const app = express()
const PORT = process.env.PORT || 5000;



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(PORT, () => {
  console.log(`Server in running on port ${PORT}`)
})
