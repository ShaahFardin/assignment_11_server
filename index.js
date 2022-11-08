const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
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
    const services = await servicesCollection.find({}).toArray();

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


app.get('/', (req, res) => {
    res.send("Server is up and running");
});
app.listen(port, () => {
    console.log(`Assignment-11-server is running on port ${port}`);
})