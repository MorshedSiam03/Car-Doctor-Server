const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();

const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: "https://car-doctor-server-eosin-sigma.vercel.app/"
}));
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vkv4ktv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    client.connect();


    const serviceCollection = client.db("Car_Doctor_User").collection('Services');
    const orderCollection = client.db("Car_Doctor_User").collection('Orders');
    const productCollection = client.db("Car_Doctor_User").collection('products');
    const teamCollection = client.db("Car_Doctor_User").collection('team');
    const reviewCollection = client.db("Car_Doctor_User").collection('review');

    app.post('/services', async(req,res)=>{
      const services = req.body;
      console.log(services);
      const result = await serviceCollection.insertOne(services);
      res.send(result);
    })
    
    app.get('/services', async(req, res)=>{
        const cursor = serviceCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    app.get('/services/:id', async(req, res)=>{
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      // const options = {
      //   projection: { title: 1, price:1, }
      // }
      const result = await serviceCollection.findOne(query);
      res.send(result);
    })

    // Orders
    app.post('/orders', async(req,res)=>{
      const orders = req.body;
      console.log(orders);
      const result = await orderCollection.insertOne(orders);
      res.send(result);
    })

    app.get('/orders', async(req, res)=>{
      const result = await orderCollection.find().toArray();
      res.send(result);
    })

    //Team
    app.post('/teams', async(req,res)=>{
      const teams = req.body;
      console.log(teams);
      const result = await teamCollection.insertOne(teams);
      res.send(result);
    })

    app.get('/teams', async(req, res)=>{
      const result = await teamCollection.find().toArray();
      res.send(result);
    })

    //Review
    app.post('/reviews', async(req,res)=>{
      const reviews = req.body;
      console.log(reviews);
      const result = await reviewCollection.insertOne(reviews);
      res.send(result);
    })
    app.get('/reviews', async(req, res)=>{
      const result = await reviewCollection.find().toArray();
      res.send(result);
    })

    app.patch('/orders/:id', async(req, res)=>{
      const id = req.params.id;
      const filter = { _id: new ObjectId(id)};
      const updatedOrders = req.body;
      const updateDoc ={
        $set: {
          status: updatedOrders.status
        },
      };
      const result = await orderCollection.updateOne(filter, updateDoc);
      res.send(result);
    })

    app.delete('/orders/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await orderCollection.deleteOne(query);
      res.send(result);
    })


    //Products
    app.post('/products', async(req,res)=>{
      const products = req.body;
      console.log(products);
      const result = await productCollection.insertOne(products);
      res.send(result);
    })

    app.get('/products', async(req, res)=>{
      const result = await productCollection.find().toArray();
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req, res)=>{
    res.send("server is running");
})

app.listen(port, ()=>{
    console.log(`Car Doctor Server is Running on port ${port}`)
})