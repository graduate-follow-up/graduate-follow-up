'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const axios = require('axios');


if(! process.env.JWT_ACCESS_TOKEN_SECRET || ! process.env.JWT_REFRESH_TOKEN_SECRET){
    console.error('\x1b[31m%s\x1b[0m', 'Jwt tokens are not initialized. Please run install.sh.');
    return process.exit(255);
}

// App
const PORT = 80;
const app = express();

const SERVICE_ACCESS_TOKEN = jwt.sign({username: 'connexion',role: 'service',id: 'connexion'}, process.env.JWT_ACCESS_TOKEN_SECRET, {});
axios.defaults.headers.common['Authorization'] = 'Bearer ' + SERVICE_ACCESS_TOKEN;

// App
const ACCESS_TOKEN_EXPIRATION = 20;
app.use(bodyParser.json());

// jwt
app.use(expressJwt({ secret: process.env.JWT_ACCESS_TOKEN_SECRET }).unless({path: ['/login', '/token', '/logout']}))
app.use((err, _req, res, _next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('invalid token');
  }
});

const ROLE = {
    SERVICE: 'service'
};

let refreshTokens = [];

function log(logType, {id: actorId, role: actorRole}) {
    axios.post('http://service_logs/', {
        "logType": logType,
        "actorId": actorId,
        "actorRole":  actorRole
    }).catch(error => console.error(error.message));
}

app.listen(PORT, () => {
    console.log(`Service-connexion started and listen to port ${PORT}`);
});

// Génère deux token :
    // access-token : token qui sera vérifié et validé par les services pour déterminer accès , etc
    // refresh-token : token permettant de régénérer accesstoken

app.post('/login', (req, res) => {
    const {user: username, password: pwd} = req.body;
    const expiration =  {expiresIn: ACCESS_TOKEN_EXPIRATION };
    axios.post('http://service_user/check-user', {
        user : username,
        password: pwd
    }).then(result => { 
        const {username, role: role, _id: id} = result.data;
        const payload = {username, role, id, expiration};

        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_TOKEN_SECRET, {expiresIn: ACCESS_TOKEN_EXPIRATION+'m'});
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_TOKEN_SECRET, {expiresIn: '120m'});

        refreshTokens.push(refreshToken);

        res.json({accessToken,refreshToken});
        log('LoggedIn', payload);
    }).catch(error => {
        if(error.response && error.response.status === 404) {
            res.status(401).send('Username or password incorrect');
        } else {
            res.sendStatus(500);
        }
    });
});

const idsListRegex = /^([a-f\d]{24}(,[a-f\d]{24})*)$/i;
// /login-token/5ebbfc19fc13ae528a000065,5ebbfc19fc13ae528a000066
app.get('/alumni-token/:ids', (req,res) => {
    if (!(req.user.role == ROLE.SERVICE && req.user.id == 'link')) return res.sendStatus(401);

    if(!req.params.ids.match(idsListRegex)) {
        res.status(400).send('Ids list required');
        return;
    }

    let signedTokens = {};
    req.params.ids.split(',').forEach(id => {
        let payload = {
            username: "", 
            role: "alumni",
            id,
            expiration: {
                expiresIn: 24*60
            }
        }
        signedTokens[id] = jwt.sign(, process.env.JWT_ACCESS_TOKEN_SECRET, {expiresIn: '120m'});
    });

    res.status(200).send(signedTokens);
});


app.post('/token', (req, res) => {
    const refreshToken = req.body.token;
    const expiration =  {expiresIn: ACCESS_TOKEN_EXPIRATION };

    if (!refreshToken) {
        return res.sendStatus(400);
    }

    if (!refreshTokens.includes(refreshToken)) {
        return res.sendStatus(403);
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET, (err, {username, role, id}) => {
        if (err) {
            return res.sendStatus(403);
        }

        const newPayload = {username, role, id, expiration};
        const accessToken = jwt.sign(newPayload, process.env.JWT_ACCESS_TOKEN_SECRET, {expiresIn: '20m'});

        res.json({
            accessToken
        });

        log('TokenRefreshed', newPayload);
    });
});

// Au logout -> refresh supprimé.
app.post('/logout', (req, res) => {
    const token = req.body.token;
    const success = { success_message: "Logout successful" }

    if(refreshTokens.includes(token)){
        refreshTokens = refreshTokens.filter(t => t !== token);
        jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET, (err, payload) => {
            if (err) {
                return res.sendStatus(400);
            }
            log('LoggedOut', payload);
            res.status(200).send(success);
        });
    } else {
        return res.sendStatus(400);
    }
});
