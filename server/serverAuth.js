require('dotenv').config()
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


app.use(express.json());

let refreshedTokens = []
app.post('/token', (req, res) => {
    const refreshToken =  req.body.token
    if(refreshToken === null)  return res.sendStatus(401);
    if(!refreshToken.includes(refreshedTokens))  return res.sendStatus(403)
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if(err) return res.sendStatus(403)
        const accessToken = generateAccessToken({ name: user.name})
        res.json({ accessToken: accessToken })
    });

})
app.post('/api/login', (req, res) => {
    const username = req.body.username
    const user = { name: username }
    req.user = user;
    console.log(req.user);

    const accessToken = generateAccessToken(user)
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
    res.json({ accessToken: accessToken, refreshToken: refreshToken })
})

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "45m"})
}

app.listen(4019)
