const express = require('express')
const { MongoClient, ServerApiVersion, ConnectionCheckedInEvent } = require('mongodb');
const ObjectId=require('mongodb').ObjectId;
const cors=require('cors');
require('dotenv').config()

const app = express();
const port = process.env.PORT||5000;
// middle wear
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iwcqk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
console.log(uri);

async function run(){
  try{
    await client.connect();
    const database = client.db("volunteer");
    const eventCollection = database.collection("events");
    const registerCollection=database.collection("register_event")

  //  api get
  app.get('/events',async(req,res)=>{
      const cursor=eventCollection.find({});
      const events=await cursor.toArray();
      res.send(events);
  });
  
  // load event data

  // api load
  app.post('/events',async(req,res)=>{
    const event= req.body;
    console.log(event)
    const result=await registerCollection.insertOne(event)
    console.log(result)
    res.json(result);
  })

  // volunteer list
  app.get('/event',async(req,res)=>{
    console.log(req.body)
    const cursor=await registerCollection.find({});
    const result=await cursor.toArray();
    res.send(result);
  })


  // load api by id
  app.get('/events/:id',async(req,res)=>{
    const id=req.params.id;
    const query={_id:ObjectId(id)}
    const event=await eventCollection.findOne(query);
    res.json(event);
});


  


  }
  finally{
      // await client .close();
  }
}
run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})