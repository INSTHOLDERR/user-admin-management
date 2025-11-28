const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const adminRoutes =require('./routes/adminRoutes')
const cors = require('cors');



dotenv.config();
connectDB();

const app = express();
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}));


app.use(express.json());




app.use('/admin',adminRoutes);
app.use('/users', userRoutes);

app.listen(5001, () => console.log('Server running on port 5001'));
