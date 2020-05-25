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
    // req contains id list
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

    let callback_connexion = function (response){
        let str = [];
        response.on('data', function (chunk) {
            str.push(chunk)
        });
        response.on('end', function () {
            switch(response.statusCode) {
                case 200 :
                    listToSend = Buffer.concat(str).toString('utf8');
                    console.log(listToSend);
                    console.log('congrats');
                    res.status(200).send(JSON.parse(listToSend));
                    break
                default :
                    console.log('Failure: '+ response.statusCode);
            }
        });
    }



    let callback_alumni = function(response) {
        let str = [];
        response.on('data', function (chunk) {
            str.push(chunk);
        });
        response.on('end', function () {
            switch (response.statusCode) {
                case 200 :
                    alumniListObjects = Buffer.concat(str).toString('utf8');
                    console.log('Body to send to connexion request : '+ alumniListObjects);
                    if(JSON.parse(str).length < JSON.stringify(req.body.listId.length)){
                        console.log("not all id's found.");
                    }
                    console.log("request_alumni.statusCode= "+response.statusCode);
                    console.log("alumniListObjects= "+ alumniListObjects);
                    let request_connexion = http.request(define_request_option("connexion","/",alumniListObjects), callback_connexion)
                    request_connexion.write(alumniListObjects);
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
    }
    let options = define_request_option("alumni", "/alumni-info", listId);
    let request_alumni = http.request(options, callback_alumni);
    request_alumni.write(listId);
    request_alumni.end();

});
