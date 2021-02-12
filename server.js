import express from 'express';
import { readdirSync } from 'fs';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
const morgan = require('morgan');

const app = express();
dotenv.config();
// require('dotenv').config();
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

//database mongoose connect
mongoose.connect(process.env.DATABASE, { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true, useUnifiedTopology: true })
    .then(() => console.log('Database connected')).catch(err => console.log('Database Error: ', err));

//routes middleware
readdirSync('./routes').map((r) => app.use('/api', require(`./routes/${r}`)));
// app.use('/api', authRoute)


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server is runnung in port ${PORT}`));