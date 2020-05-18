'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');


// App


const PORT = 3000;
const app = express();
app.use(bodyParser.json());
app.set('trust proxy', 1);

// TODO : store secret in volume / as var env / docker secret 
const accessTokenSecret = 'youraccesstokensecret';
const refreshTokenSecret = 'yourrefreshtokensecrethere';
let refreshTokens = [];


// FAKE USERS TO TEST AUTHENTIFICATION , later on use service-user
// TODO : get users from service-user
const users = [
    {
        username: 'john',
        password: 'password123admin',
        role: 'admin'
    }, {
        username: 'anna',
        password: 'password123member',
        role: 'member'
    }
];


app.listen(PORT, () => {
    console.log(`Service-connexion started and listen to port ${PORT}`);
});

// Génère deux token :
    // access-token : token qui sera vérifié et validé par les services pour déterminer accès , etc
    // refresh-token : token permettant de régénérer accesstoken
app.post('/login', (req, res) => {
    // read username and password from request body
    const username = req.body.username;
    const pwd = req.body.password;

    // filter user from the users array by username and password
    // TODO Implement request to service-user
    const user = users.find(
        u => {
            return u.username === username && u.password === pwd
        }
    );

    if (user) {
        // generate an access token
        const accessToken = jwt.sign(
            {username: user.username, role: user.role},
            accessTokenSecret,
            {expiresIn: '20m'}
        );

        const refreshToken = jwt.sign(
            {username: user.username, role: user.role},
            refreshTokenSecret
        );

        refreshTokens.push(refreshToken);

        res.json({
            accessToken,
            refreshToken
        });
    } else {
        res.send('Username or password incorrect');
    }
});

app.post('/active-refresh', (req,res) => {
   res.status(200).send(JSON.stringify(refreshTokens))
});


app.post('/token', (req, res) => {
    const {token} = req.body;

    if (!token) {
        return res.sendStatus(401);
    }

    if (!refreshTokens.includes(token)) {
        return res.sendStatus(403);
    }

    jwt.verify(token, refreshTokenSecret, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }

        const accessToken = jwt.sign(
            {username: user.username, role: user.role},
            accessTokenSecret,
            {expiresIn: '20m'}
        );

        res.json({
            accessToken
        });
    });
});

app.post('/logout', (req, res) => {
    const {token} = req.body;
    refreshTokens = refreshTokens.filter(t => t !== token);

    res.send("Logout successful");
});

app.post('/', (req, res) => {
    res.status(200).send('Hello world!');
});
