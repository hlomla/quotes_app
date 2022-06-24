require('dotenv').config()
const express = require('express');
const app = express();
const PgPromise = require("pg-promise")
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator')
const API = require('./api');

const DATABASE_URL = process.env.DATABASE_URL;
const pgp = PgPromise({});
const config = {
	connectionString: DATABASE_URL ,
	max: 30,
	ssl:{ rejectUnauthorized : false}
 };
 
 const db = pgp(config);

API(app, db);
app.use(express.json());

const users = [
    {
        email: "hlomla.tapuko@gmail.com",
        password: 'paSSwo$d12'
    },
    {
        email: "okuhle.tapuko@gmail.com",
        password: 'paSSwo$d12'
    }
]
app.get('/api/test', function (req, res) {
    res.json({
        name: 'joe'
    });
});

app.get('/api/users', (req, res) => {
    console.log(req.body.user);
    res.json(users.filter(post => post.email === req.body.user.name))
})


app.post('/api/register', [
    check('email', 'Please enter a valid email address').isEmail(),
    check('password', 'Please enter a strong password that has a symbol, numerics and uppercase letters').isStrongPassword({
        min: 6,
        max: 10,
        lowercase: 2,
        uppercase: 2,
        numeric: 2,
        symbol: 2
    })
], async (req, res) => {
    const { password, email } = req.body;

    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(req.body.password, salt)
    console.log(salt)
    console.log(hashedPassword)
  
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            })
        }
        //Validate if user already exists
        const user = users.find((user) => {
            return user.email === email
        })
         
        if (user) {
            res.status(400).json({
                "errors": [
                    {
                        "msg": "This user already exists",
                    }
                ]
            })
            return;
        }

        users.push({ password, email })

        console.log(hashedPassword, email);
        res.send('Validation has passed')
    } catch (error) {
        console.log(error);
    }


})

app.post('/api/login', async (req, res) => {
    const user = req.body
    try {
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        console.log(salt)
        console.log(hashedPassword)
        users.push(user)
        req.user = user;
        console.log(req.user);

        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
        res.status(201).json({"errors": [
            {
                "msg": "You have logged in",
                accessToken: accessToken
            }
        ]})
    } catch (err) {
        res.json(err)
    }


})

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token === null) return res.sendStatus(401);

    try {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        next()
    } catch (err) {
        console.log(err);
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    }
}

app.listen(4017, function () {
    console.log('App running on port: 4017')
})
