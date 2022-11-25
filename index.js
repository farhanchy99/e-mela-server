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
        

        //add products
        // app.get('/products', async(req, res) =>{
        //     const query = {};
        //     const pros = await products.find(query).toArray();
        //     res.send(pros);
        //    }),

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

        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const proId = await categories.findOne(query);
            res.send(proId);
        });

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