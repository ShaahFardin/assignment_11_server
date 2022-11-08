const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


// DB_USER=photographyUser
// DB_PASSWORD=photographyUser123


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

app.get('/', (req, res) => {
    res.send("Server is up and running");
});
app.listen(port, () => {
    console.log(`Assignment-11-server is running on port ${port}`);
})