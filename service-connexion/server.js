'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const axios = require('axios');

if(! process.env.JWT_ACCESS_TOKEN_SECRET || ! process.env.JWT_REFRESH_TOKEN_SECRET){
    console.error('\x1b[31m%s\x1b[0m', 'Jwt tokens are not initialized. Please run install.sh.');
    return process.exit(255);
}

// App
const PORT = 3000;
const app = express();
app.use(bodyParser.json());


let refreshTokens = [];

app.listen(PORT, () => {
    console.log(`Service-connexion started and listen to port ${PORT}`);
});

// Génère deux token :
    // access-token : token qui sera vérifié et validé par les services pour déterminer accès , etc
    // refresh-token : token permettant de régénérer accesstoken

app.post('/login', (req, res) => {
    const {user: username, password: pwd} = req.body;

    axios.post('http://service_user:3000/check-user', {
        user : username,
        password: pwd
    }).then(result => {
        const {username, statut: role, _id: id} = result.data;
        
        const accessToken = jwt.sign(
            {
                username: username,
                role: role,
                id: id
            },
            process.env.JWT_ACCESS_TOKEN_SECRET,
            {expiresIn: '20m'}
        );

        const refreshToken = jwt.sign(
            {
                username: username,
                role: role,
                id: id },
            process.env.JWT_REFRESH_TOKEN_SECRET,
            {expiresIn: '120m'}
        );

        refreshTokens.push(refreshToken);

        res.json({
            accessToken,
            refreshToken
        });
    }).catch(error => {
        if(error.response && error.response.status == 404) {
            res.status(401).send('Username or password incorrect');
        } else {
            res.sendStatus(500);
        }
    });
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

    jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET, (err, payload) => {
        if (err) {
            return res.sendStatus(403);
        }

        const accessToken = jwt.sign(
            {
                username: payload.username,
                role: payload.role,
                id: payload.id
            },
            process.env.JWT_ACCESS_TOKEN_SECRET,
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
