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

    const services = await cursor.skip(page * size).limit(size).toArray();

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


app.get('/service/:id', async (req, res) => {

    const id = req.params;
    const service = await servicesCollection.findOne({ _id: ObjectId(id) });

    try {
        res.send({
            success: true,
            message: "Got the id specific data",
            data: service
        })
    } catch (error) {
        console.log(error.name.error.message, error.stack);
        res.send({
            success: false,
            error: error.message
        })
    }
})


//collection: event-photoshoot-review

// event photoshoot user review
app.get('/eventReview', async (req, res) => {

    const eventReview = await client.db('Photography').collection('event-photoshoot-review').find({}).toArray();
    try {
        res.send({
            success: true,
            data: eventReview
        })
    } catch (error) {
        res.send({
            success: false,
            error: error.message
        })
    }
})


// user review

app.post('/userReviews', async (req, res) => {
    const userReviews = await client.db('Photography').collection('userReviews').insertOne(req.body);
    try {
        if (userReviews.insertedId) {
            res.send({
                success: true,
                message: "Reviews added to the database succesfully"
            })
        } else {
            res.send({
                success: false,
                message: "Could not insert the review to the database"
            })
        }
    } catch (error) {
        console.log(error.name, error.message, error.stack);
        res.send({
            success: false,
            error: error.message
        })
    }
})

// specific service related  review
app.get('/userReviews', async (req, res) => {
    const query = {
        service_id: req.query.service_id
    }
    const specificReview = await client.db('Photography').collection('userReviews').find(query).toArray();
    try {
        res.send({
            success: true,
            data: specificReview
        })
    } catch (error) {
        res.send({
            success: false,
            error: error.message
        })
    }
})

app.get('/myReviews', async (req, res) => {

    const query = {
        email: req.query.email
    }
    const myReviews =await client.db('Photography').collection('userReviews').find(query).toArray();

    try {
        res.send({
            success:true,
            data:myReviews 
        })
    } catch (error) {
        res.send({
            success: false,
            error: error.message
        })
    }
})


app.delete('/myReviews/:id', async (req, res) => {

    const { id } = req.params;
    try {

        const id = req.params;
        const reviewCollectioin = client.db('Photography').collection('userReviews')
        const reviews = await reviewCollectioin.findOne({ _id: ObjectId(id) });
        if (!reviews._id) {
            res.send({
                success: false,
                error: "Review does not exist"
            });
            return;
        }
        const result = await reviewCollectioin.deleteOne({ _id: ObjectId(id) });
        if (result.deletedCount) {
            res.send({
                success: true,
                message: `Successfully deleted the reviews ${reviews}`
            })
        } else {

        }

    } catch (error) {
        res.send({
            success: false,
            message: error.message
        })
    }
})


app.patch('/update/:id', async (req, res) => {
    const { id } = req.params
    try {
        const reviewCollectioin = client.db('Photography').collection('userReviews')
        const result = await reviewCollectioin.updateOne({ _id: ObjectId(id) }, { $set: req.body })
        console.log(result);
        if (result.modifiedCount) {
            res.send({
                success: true,
                message: `Successfully updated the review`
            })
        } else {
            res.send({
                success: false,
                message: "Could not update the review"
            })
        }
    } catch (error) {
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