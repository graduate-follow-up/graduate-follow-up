'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const http = require('http');

// App
const PORT = 80;
const app = express();
app.use(bodyParser.json());

app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
});


app.post('/send-update-mail', (req, res) => {
    const listId = JSON.stringify(req.body);
    let alumniListObjects = [];
    let listToSend= [];

    function define_request_option(service, path, content) {
        return {
            host: 'service_'+service,
            port: 3000,
            path: path,
            method: 'POST',
            family: 4,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': content.length
            }
        }
    }

    let callback_mail = function (response){
        if(response.statusCode === 200){
            res.status(200).send('Email sent.');
        }else{
            res.status(500).send('Server error.');
        }
    };


    let callback_connexion = function (response){
        let str = [];
        response.on('data', function (chunk) {
            str.push(chunk)
        });
        response.on('end', function () {
            switch(response.statusCode) {
                case 200 :
                    listToSend = JSON.parse(Buffer.concat(str).toString('utf8'));
                    let result = []
                    listToSend.forEach(e1 => {
                       let e2 = JSON.parse(alumniListObjects).find(e => e._id = e1._id);
                        result.push({...e2, ...e1});
                    });
                    let request_mail = http.request(define_request_option('mail', '/mailmaj',result), callback_mail);
                    request_mail.write(result);
                    request_mail.end();
                    // res.status(200).send(result);
                    break
                default :
                    console.log('Failure: '+ response.statusCode);
            }
        });
    };

    let callback_alumni = function(response) {
        let str = [];
        response.on('data', function (chunk) {
            str.push(chunk);
        });
        response.on('end', function () {
            switch (response.statusCode) {
                case 200 :
                    alumniListObjects = Buffer.concat(str).toString('utf8');
                    if(JSON.parse(str).length < JSON.stringify(req.body.listId.length)){
                        console.log("not all id's found.");
                    }
                    let request_connexion = http.request(define_request_option("connexion","/",listId), callback_connexion)
                    request_connexion.write(listId);
                    request_connexion.end();
                    break
                case 404 :
                    res.status(404).send('No alumni found with those ids.');
                    break
                case 499 :
                    res.status(499).send('Problem with id format.');
                    break
                default :
                    console.log('default:' + response.statusCode);
                    console.log('response=' + response.data);
                    break
            }
        });
        response.on('error', function () {
           console.log('Oups, error!');
        });
    };
    let options = define_request_option("alumni", "/alumni-info", listId);
    let request_alumni = http.request(options, callback_alumni);
    request_alumni.write(listId);
    request_alumni.end();

});
