const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors')
require('dotenv').config();

const app = express()
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lw2c4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
      await client.connect();
      const database = client.db("foodsense");
      const servicesCollection = database.collection("services");
     
      //  GET API
      app.get('/services', async(req, res)=>{
        const cursor = servicesCollection.find({});
        const services = await cursor.toArray();
        res.send(services);
    }) 

     //GET single service
     app.get('/services/:id', async(req, res)=>{
        const id = req.params.id;
        console.log('geting specific service', id)
        const query = {_id: ObjectId(id)};
        const service = await servicesCollection.findOne(query)
        res.json(service);
    }) 

    //   post API
        app.post('/services', async(req, res) =>{
        const service = req.body
        console.log('hit hook', service)

        const result = await servicesCollection.insertOne(service);
        console.log(result)
        res.json(result)
    })


    // update API
    app.put('/services/:id', async(req, res) =>{
      const id = req.params.id;
      const updatedUser = req.body;
      const filter = {_id: ObjectId(id)}
      const options = {upsert: true};
      const updateDoc = {
        $set: {
          name : updatedUser.name,
          descriiption : updatedUser.descriiption,
        },
      };
      const result = await servicesCollection.updateOne(filter, updateDoc, options)
      console.log('updating user', req)
      res.json(result)

    })

    // DELETE API
    app.delete('/services/:id', async(req,res)=>{
        const id = req.params.id;
        const query = {_id:ObjectId(id)};
        const result = await servicesCollection.deleteOne(query);
        res.json(result)
      })
     
    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('Hello World.....!')
})

app.listen(port, () => {
  console.log('connected server', port)
})