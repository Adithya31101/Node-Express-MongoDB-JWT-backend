const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const morgan = require('morgan');


//Routes Import
const authRoutes = require('./routes/auth');

require('dotenv').config();

const app = express();

//MiddleWares

app.use(express.json());
app.use(morgan('tiny'));

//Routes

app.use('/api/auth', authRoutes);

//verify Token

// const verifyToken = (req, res, next) => {
//     const bearer = req.headers['authorization'];
//     if(typeof bearer !== "undefined"){
//         //split
//         const token = bearer.split(' ')[1];
//         jwt.verify(token, 'secretkey', (err, authData) => {
//             if(err){
//                 req.user = null;
//             } else {
//                 req.user = authData;

//             }
//         });
//     } else {
//         res.status(403);
//     }
//     next();
// }


// app.get('/', (req, res) => {
//     res.json({
//         message: "Welcome to the api",
//     });
// });

// app.post('/api/posts',verifyToken , (req, res) => {
//     res.json({
//         message: "Created a post",
//         user: req.user 
//     });
// });

// app.post('/api/login', (req, res) => {
//     //Mock User
//     const user = {
//         id: 1,
//         username: "Adithya", 
//         email: "adithya@gmail.com"
//     };

//     jwt.sign({ user }, 'secretkey', {expiresIn: '30s'} , (err, token) => {
//         res.json({
//             token
//         });
//     });
// });

app.listen(5000, () => {
    console.log("server on localhost:5000");
    mongoose.connect(process.env.DB_CONNECT, {
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        useCreateIndex: true 
    }, () => {
        console.log("Connected to MongoDB");
    });
})