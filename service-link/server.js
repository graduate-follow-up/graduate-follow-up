'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const axios = require('axios');

// Constant
const SERVICE_ACCESS_TOKEN = jwt.sign({username: 'link',role: 'service', id: 'link'},process.env.JWT_ACCESS_TOKEN_SECRET,{});
axios.defaults.headers.common['Authorization'] = 'Bearer ' + SERVICE_ACCESS_TOKEN;

const ROLE = {
  USER: 'prof',
  RESPO: 'respo-option',
  ADMIN: 'administrateur',
  SERVICE: 'service'
};

// App
const PORT = 80;
const app = express();
app.use(bodyParser.json());

// Token verification
app.use(expressJwt({ secret: process.env.JWT_ACCESS_TOKEN_SECRET }))
app.use((err, _req, res, _next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('invalid token');
  }
});

app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
});

function log(logType, {id: actorId, role: actorRole}, subjectId) {
    axios.post('http://service_logs/', {
        "logType": logType,
        "actorId": actorId,
        "actorRole":  actorRole,
        "subjectId": subjectId
    }).catch(error => console.error(error.message));
}

function buildUpdateLink(token) {
    return [process.env.PROXY_URL, 'login', token].join('/');
}

const idsListRegex = /^([a-f\d]{24}(,[a-f\d]{24})*)$/i;
app.post('/send-update-mail', (req, res) => {
    if (![ROLE.RESPO, ROLE.ADMIN].includes(req.user.role)) return res.sendStatus(401);

    const idList = req.body.join(',');

    if(!idList.match(idsListRegex)) {
        res.sendStatus(400);
        return;
    }

    const alumnisPromise = axios.get(`http://service_alumni/infos/${idList}`);
    const tokensPromise = axios.get(`http://service_connexion/alumni-token/${idList}`);

    Promise.all([alumnisPromise, tokensPromise])
        .then(([{data: alumnis}, {data: tokens}]) => {
            const alumnisWithLinks = alumnis.map(alumni => {
                if(!(alumni._id in tokens)) {
                    throw new Error('Alumni token not found');
                }
                
                alumni['url'] = buildUpdateLink(tokens[alumni._id]);
                return alumni;
            });

        // We use the original sender's auth token
        axios.post('http://service_mail/mailmaj', alumnisWithLinks, {
            headers: {
                'Authorization': req.headers['authorization']
            }
        }).then(() => {
            res.sendStatus(200);
            alumnis.forEach(alumni => log("UpdateMailSent", req.user, alumni._id));
        }).catch(error => res.status(error.status | 500).send(error.message));
    }).catch(error => res.status(error.status | 500).send(error.message))
});
