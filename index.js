const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT ||5000



console.log(process.env.S3_BUCKET) // remove this after you've confirmed it is working


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = `mongodb+srv://${process.env.S3_BUCKET}:${process.env.SECRET_KEY}@cluster0.ig6ro.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect()
    // Send a ping to confirm a successful connection
    const coffedata = client.db("coffeDB").collection("coffe");
    
    app.post('/api/coffe',async(req,res)=>{
      const newcoffe = req.body
      console.log(newcoffe)
      const result = await coffedata.insertOne(newcoffe)
      res.send(result)
    })
    app.get('/api/coffe', async(req,res)=>{
      const cursor = coffedata.find()
      const result = await cursor.toArray();
      res.send(result)

    })
    app.get('/api/coffe/:id',async(req,res)=>{
      const id = req.params.id
      const quary =  {_id: new ObjectId(id)}
      const result = await coffedata.findOne(quary)
      res.send(result)
    })
    app.delete('/api/coffe/:id',async(req,res)=>{
      const id = req.params.id
      const quary = {_id: new ObjectId(id)}
      const result = await coffedata.deleteOne(quary)
      res.send(result)
    })
    app.put('/api/coffe/:id',async(req,res)=>{
      const id = req.params.id
      const filter = {_id: new ObjectId(id)}
      const options = { upsert: true };
      const updatedcoffee = req.body
      const coffee = {
        $set:{
          name:updatedcoffee.name,
          chef:updatedcoffee.chef,
          supplier:updatedcoffee.supplier,
          category:updatedcoffee.category,
          details:updatedcoffee.details,
          taste:updatedcoffee.taste,
          photo:updatedcoffee.photo,

        }
      }
      const result = await coffedata.updateOne(filter,coffee,options)
      res.send(result)
    })
    
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.get('/user',(req,res)=>{
    res.send("this is coffee shop server")
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})