const express = require('express')
const app = express();
//const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
const port = process.env.PORT || 5000;
require('dotenv').config();


app.use(cors());
app.use(express.json());

console.log(process.env.DB_USER)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.mar6xi9.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
    try{
       const categories = client.db('resale-server').collection('products-categories');
       const products = client.db('resale-server').collection('products');
       const orders = client.db('resale-server').collection('ordersCollection');
       const userColl = client.db('resale-server').collection('userCollection'); 

       app.get('/categories', async(req, res) =>{
        const query = {};
        const cats = await categories.find(query).toArray();
        res.send(cats);
       }),

       app.get('/categories/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const cat = await categories.findOne(query);
        res.send(cat);
        });

        app.post('/products', async(req, res)=>{
            const pro = req.body;
            const result = await products.insertOne(pro);
            res.send(result);
        })

        app.get('/products', async(req, res)=>{
            let query ={};
            if(req.query.brand){
                query={
                    brand: req.query.brand
                }
            }
            const cursor = products.find(query)
            const proList = await cursor.toArray();
            res.send(proList);
        })

        app.get('/myproducts', async(req, res)=>{
            let query ={};
            if(req.query.email){
                query={
                    email: req.query.email
                }
            }
            const cursor = products.find(query)
            const proList = await cursor.toArray();
            res.send(proList);
        })

        //Users Orders
        app.post('/myorders', async(req, res)=>{
            const mord = req.body;
            const result = await orders.insertOne(mord);
            res.send(result);
        })

        app.get('/myorders', async(req, res)=>{
            let query ={};
            if(req.query.email){
                query={
                    email: req.query.email
                }
            }
            const cursor = orders.find(query)
            const orList = await cursor.toArray();
            res.send(orList);
        })

        app.delete('/myorders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orders.deleteOne(query);
            res.send(result);
        });

        //User Collection
        app.post('/users', async(req, res)=>{
            const users = req.body;
            const result = await userColl.insertOne(users);
            res.send(result);
        })
    }
    finally{

    }
}

run().catch(err => console.error(err));


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log('Example app listening on port', port)
})