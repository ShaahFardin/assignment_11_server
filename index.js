const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.il5mbbt.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        console.log(`Database connected at , ${uri}`);
    } catch (err) {
        console.log(err.name, err.message, err.stack);
    }
}
run();

// db name : Photography

const servicesCollection = client.db('Photography').collection('services');

app.get('/services', async (req, res) => {
   
    const page = Number(req.query.page);
    const size = Number(req.query.size);
    const cursor = servicesCollection.find({});
    const services =await cursor.skip(page*size).limit(size).toArray();

    try {
        res.send({
            success: true,
            message: "Got the data successfully",
            data: services
        })
    } catch (error) {
        console.log(error.name, error.message, error.stack);
        res.send({
            success: false,
            error: error.message
        })
    }
})


app.get('/service/:id', async(req, res)=>{

    const id = req.params;
    const service = await servicesCollection.findOne({_id:ObjectId(id)});

    try {
        res.send({
            success: true,
            message: "Got the id specific data",
            data: service
        })
    } catch (error) {
        console.log(error.name. error.message, error.stack);
        res.send({
            success: false,
            error: error.message
        })
    }
})


app.get('/', (req, res) => {
    res.send("Server is up and running");
});
app.listen(port, () => {
    console.log(`Assignment-11-server is running on port ${port}`);
})