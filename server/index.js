import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';

import authRouter from './routes/authRouter';
import menuRouter from './routes/menuRouter';
// import ordersRouter from './routes/ordersRouter';

dotenv.config();
const app = express();

// Enable CORS 
app.use(cors());

// Enable the service of ui templates
app.use(express.static('ui'));


// Configure body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


// Auth routes
app.use('/api/v1/auth', authRouter);

// Menu routes 
app.use('/api/v1/menu', menuRouter);


// route to get uploaded food images
app.use('/uploads', express.static('uploads'));

app.all('*', (req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'not found'
    });
});

app.listen(process.env.PORT, () => {
    console.log('server started on port ', process.env.PORT, '...');
});

export default app;