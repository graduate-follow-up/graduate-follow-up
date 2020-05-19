'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const http = require('http');



// App
const PORT = 3000;
const app = express();
app.use(bodyParser.json());


// TODO : store secret in volume / as var env / docker secret
//const accessTokenSecret = 'youraccesstokensecret';
const refreshTokenSecret = 'yourrefreshtokensecrethere';

let refreshTokens = [];

app.listen(PORT, () => {
    console.log(`Service-connexion started and listen to port ${PORT}`);
});

// Génère deux token :
    // access-token : token qui sera vérifié et validé par les services pour déterminer accès , etc
    // refresh-token : token permettant de régénérer accesstoken

app.post('/login', (req, res) => {
    // read username and password from request body
    const username = req.body.user;
    const pwd = req.body.password;
    console.log(username);
    console.log(pwd);

    const body_to_send = JSON.stringify({user : username, password: pwd})

    const options = {
        host: 'service_user',
        port: 3000,
        path: '/check-user',
        method: 'GET',
        family: 4,
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': body_to_send.length
        }
    }

    const request = http.request(options, result => {
        var responseString = "";

        result.on("data", function (data) {
            responseString += data;
        });
        result.on("end", function () {
            if (result.statusCode === 200){
                responseString = JSON.parse(responseString);
                const accessToken = jwt.sign(
                    {
                        username: username,
                        role: responseString.statut,
                        id: responseString._id
                    },
                    process.env.JWT_KEY,
                    {expiresIn: '20m'}
                );

                const refreshToken = jwt.sign(
                    {
                        username: username,
                        role: responseString.statut,
                        id: responseString._id },
                    process.env.JWT_KEY2,
                    {expiresIn: '120m'}
                );

                refreshTokens.push(refreshToken);

                res.json({
                    accessToken,
                    refreshToken
                });
            }else{
                res.status(404).send('Username or password incorrect');
            }
        });
    });


    request.on('error', error => {
        console.error(error);
    });
    request.write(body_to_send);
    request.end();

});

// A SUPPRIMER QUAND DEV FINI
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

    jwt.verify(token, process.env.JWT_KEY2, (err, payload) => {
        if (err) {
            return res.sendStatus(403);
        }

        const accessToken = jwt.sign(
            {
                username: payload.username,
                role: payload.role,
                id: payload.id
            },
            process.env.JWT_KEY,
            {expiresIn: '20m'}
        );

        res.json({
            accessToken
        });
    });
});

// Au logout -> refresh supprimé.
app.post('/logout', (req, res) => {
    const {token} = req.body;
    refreshTokens = refreshTokens.filter(t => t !== token);

    res.send("Logout successful");
});
