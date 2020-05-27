'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const http = require('http');

if(! process.env.JWT_ACCESS_TOKEN_SECRET || ! process.env.JWT_REFRESH_TOKEN_SECRET){
    console.error('\x1b[31m%s\x1b[0m', 'Jwt tokens are not initialized. Please run install.sh.');
    return process.exit(255);
}

// App
const PORT = 3000;
const app = express();
const ACCESS_TOKEN_EXPIRATION = 20;
app.use(bodyParser.json());


let refreshTokens = [];

app.listen(PORT, () => {
    console.log(`Service-connexion started and listen to port ${PORT}`);
});

// Génère deux token :
    // access-token : token qui sera vérifié et validé par les services pour déterminer accès , etc
    // refresh-token : token permettant de régénérer accesstoken

app.post('/login', (req, res) => {
    const username = req.body.user;
    const pwd = req.body.password;
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
                        id: responseString._id,
                        expiresIn: ACCESS_TOKEN_EXPIRATION
                    },
                    process.env.JWT_ACCESS_TOKEN_SECRET,
                    {expiresIn: ACCESS_TOKEN_EXPIRATION+'m'}
                );

                const refreshToken = jwt.sign(
                    {
                        username: username,
                        role: responseString.statut,
                        id: responseString._id },
                    process.env.JWT_REFRESH_TOKEN_SECRET,
                    {expiresIn: '120m'}
                );

                refreshTokens.push(refreshToken);
                console.log(JSON.stringify(refreshTokens));

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
    const refreshToken = req.body.token;

    if (!refreshToken) {
        return res.sendStatus(401);
    }

    if (!refreshTokens.includes(refreshToken)) {
        return res.sendStatus(403);
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET, (err, payload) => {
        if (err) {
            return res.sendStatus(403);
        }

        const accessToken = jwt.sign(
            {
                username: payload.username,
                role: payload.role,
                id: payload.id,
                expiresIn: ACCESS_TOKEN_EXPIRATION
            },
            process.env.JWT_ACCESS_TOKEN_SECRET,
            {expiresIn: ACCESS_TOKEN_EXPIRATION+'m'}
        );

        res.json({
            accessToken
        });
    });
});

// Au logout -> refresh supprimé.
app.post('/logout', (req, res) => {
    const token = req.body.token;
    const success = {
        success_message: "Logout successful"
    }
    if(refreshTokens.indexOf(token) > -1){
        console.log("Token found");
        refreshTokens = refreshTokens.filter(t => t !== token);
        res.status(200).send(JSON.stringify(success));
    }else{
        console.log("Token not found");
        res.status(404).send("Token not found".json);
    }
});
