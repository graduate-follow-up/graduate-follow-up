'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const axios = require('axios');

// App
const PORT = 80;
const app = express();
app.use(bodyParser.json());

app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
});

function buildUpdateLink(token) {
    return [process.env.PROXY_URL, 'login', token].join('/');
}

const idsListRegex = /^([a-f\d]{24}(,[a-f\d]{24})*)$/i;
app.post('/send-update-mail', (req, res) => {
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

        axios.post('http://service_mail/mailmaj', alumnisWithLinks).then(() => {
            res.sendStatus(200);
        }).catch(error => res.status(error.status | 500).send(error.message));
    }).catch(error => res.status(error.status | 500).send(error.message))
});
