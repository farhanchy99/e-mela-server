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
       
       
//Categories DATA
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


//Products DATA
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

//Sell Add Products DATA
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

//Product Advertise DATA
        app.get("/advertisement", async (req, res) => {
            query = { advertise: "true" };
            const prod = await products.find(query).sort({
                time:-1
            }).toArray()
            
            res.send(prod);
          });

        app.patch('/product/ad/:id', async(req, res)=>{
            const id =req.params.id;
            const filter = { _id: ObjectId(id) };
            const option = {upsert : true};
            const UpdatedDoc ={
                $set: {
                    advertise: 'true'
                }
            };
            const result = await products.updateOne(
                filter,
                UpdatedDoc,
                option
            );
            res.send(result);
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

        //Delete User
        app.delete('/myorders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orders.deleteOne(query);
            res.send(result);
        });


//AllUser Collection
        app.get('/users', async(req, res) =>{
            const query = {};
            const users = await userColl.find(query).toArray();
            res.send(users);
        }),

        //delete User
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await userColl.deleteOne(query);
            res.send(result);
        });

        //Post User
        app.post('/users', async(req, res)=>{
            const user = req.body;
            const result = await userColl.insertOne(user);
            res.send(result);
        })

        // app.patch('/users/allsellers', async(req, res)=>{
        //     let query ={};
        //     if(req.query.role){
        //         query={
        //             role: req.query.role
        //         }
        //     }
        //     const cursor = userColl.find(query)
        //     const seller = await cursor.toArray();
        //     res.send(seller);
        // })

        //ADMIN
        app.get("/users/admin", async (req, res) => {
            query = { role: "Admin" };
            const admin = await userColl.find(query).toArray()
            res.send(admin);
        });

        app.get("/users/admin/:email", async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const user = await userColl.findOne(query);
            res.send({isAdmin: user?.role === 'Admin'});
        });

        //Sellers DATA
        app.get("/users/allsellers", async (req, res) => {
            query = { role: "Seller" };
            const seller = await userColl.find(query).sort({
                time:-1
            }).toArray()
            
            res.send(seller);
        });

        app.get("/users/allsellers/:email", async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const userSeller = await userColl.findOne(query);
            res.send({isSeller: userSeller?.role === 'Seller'});
        });

        app.patch("/seller/verify/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const option = { upsert: true };
            const UpdatedDoc = {
              $set: {
                Verify: "true",
              },
            };
            const result = await userColl.updateOne(
              filter,
              UpdatedDoc,
              option
            );
            res.send(result);
          });

        //Buyers DATA
        app.get("/users/allbuyers", async (req, res) => {
            query = { role: "Buyer" };
            const buyer = await userColl.find(query).sort({
                time:-1
            }).toArray()
            
            res.send(buyer);
        });

        // app.put('/users/sellers/:id', async(req, res)=>{
        //     const id =req.params.id;
        //     const filter = { _id: ObjectId(id) };
        //     const option = {upsert : true};
        //     const UpdatedDoc ={
        //         $set: {
        //             role: 'seller'
        //         }
        //     };
        //     const result = await userColl.updateOne(
        //         filter,
        //         UpdatedDoc,
        //         option
        //     );
        //     res.send(result);
        // })

        
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