'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');

// Constants
const MONGODB_URI = 'mongodb://database_user:27017/users';
const DATABASE_NAME = 'users';
const COLLECTION_NAME = 'users';

const PORT = 3000;

// App
const app = express();
app.use(bodyParser.json());

var collection;

MongoClient.connect(MONGODB_URI, {useUnifiedTopology: true}, function(err, client) {
  if(err) throw err;

  let db = client.db(DATABASE_NAME);
  collection = db.collection(COLLECTION_NAME);

  app.listen(PORT);
  console.log(`Listening on port ${PORT}`);
});


app.get('/', (req, res) => {
  // TODO check permissions
  collection.find({}).toArray(function(err, docs) {
    if(err) {
      res.status(500).send(err);
    } else {
      res.send(docs);
    }
  });
});

// On login -> service connexion asks service user to check user & pwd :
//       - If user & pwd correct : sends user role
//       - If user or pwd incorrect : sends status code 404 .
app.get('/check-user',(req, res) => {

  const usr = req.body.user;
  const pwd = req.body.password;

  collection.find({login: usr, mdp: pwd }).project({ statut: 1 }).toArray(function (err, docs) {
    if(err) {
      res.status(500).send(err);
    } else {
      if(docs.length === 0){
        res.status(404).send();
      }else{
        res.status(200).send(docs[0]);
      }
    }
  });


});

app.get('/:userId', (req, res) => {
  collection.find({_id: ObjectId(req.params.userId)}).project({mdp:0}).toArray(function (err, docs) {
    if(err) {
      res.status(500).send(err);
    } else {
      if(docs.length === 0 ){
        res.status(404).send("Not found.");
      }else{
        res.status(200).send(docs[0]);
      }
    }
  });
});


app.post('/', (req, res) => {
  // TODO check permissions
  // TODO verify document format
  let document = req.body;

  collection.insertOne(document, (err, resMongo) => {
    if(err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(resMongo.insertedId);
    }
  });
})


app.put('/:userId', (req, res) => {
  // TODO check permissions
  // TODO verify update content

  let update = {$set : req.body};

  collection.updateOne({_id: ObjectId(req.params.userId)}, update, (err,resMongo) => {
    if(err) {
      res.status(400).send(err);
    } else {
      switch (resMongo.matchedCount) {
        case 0:
          res.status(404).send("No matching element found.");
          break;
        case 1:
          res.status(204).send('Element successfully updated');
          break;
      }
    }
  });
});


  app.delete('/:userId', (req, res) => {
  collection.deleteOne({"_id": ObjectId(req.params.userId)}, (err, resMongo) => {
    if(err) {
      res.status(500).send(err);
    } else {
      // Send a 404 if no document were deleted
      res.sendStatus(resMongo.deletedCount > 0 ? 204 : 404);
    }
  });
});