const express = require('express');
const dotenv = require('dotenv')
const connectDB = require('./utils/dbs')
const authRouter = require('./routers/auth-router')


dotenv.config()
const app = express();
const PORT = 3000;
app.use(express.json());
app.use('/api/auth', authRouter)

connectDB();

app.listen(PORT, () => {
    console.log(`Server Running at PORT at Localhost: ${PORT}`);
})