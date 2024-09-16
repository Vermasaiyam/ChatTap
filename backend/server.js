const dotenv = require('dotenv');
const express = require('express');
const colors = require('colors');
const { chats } = require('./data/data');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const { errorHandler, notFound } = require('./middlewares/errorMiddleware');

dotenv.config();
connectDB();
const PORT = process.env.PORT || 5000;
const app = express();

// middlewares
app.use(express.json());

app.get('/', (req,res)=>{
    res.send('API is running');
})

app.use('/api/user', userRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, console.log(`App started on PORT: ${PORT}`.yellow.bold));
