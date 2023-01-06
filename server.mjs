import express from 'express';
import path from 'path';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express()
const port = process.env.PORT || 5001;
const mongodbURI = process.env.mongodbURI || "mongodb+srv://abidi:abidi12345@cluster0.jeewzyd.mongodb.net/abcdatabase?retryWrites=true&w=majority";

app.use(cors());
app.use(express.json());


let products = []; // TODO: connect with mongodb instead


///mongoose schema

let productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: Number,
    description: String,
    createdOn: { type: Date, default: Date.now }
});
const productModel = mongoose.model('products', productSchema);



///mongoose schema


///Postreq connect db ///




app.post('/product', (req, res) => {

    const body = req.body;

    if ( // validation
        !body.name
        || !body.price
        || !body.description
    ) {
        res.status(400).send({
            message: "required parameters missing",
        });
        return;
    }

    console.log(body.name)
    console.log(body.price)
    console.log(body.description)

    // products.push({
    //     id: `${new Date().getTime()}`,
    //     name: body.name,
    //     price: body.price,
    //     description: body.description
    // });

    productModel.create({
        name: body.name,
        price: body.price,
        description: body.description,
    },
        (err, saved) => {
            if (!err) {
                console.log(saved);

                res.send({
                    message: "product added successfully"
                });
            } else {
                res.status(500).send({
                    message: "server error"
                })
            }
        })
})


///Postreq connect db ///


///getreq connect db ///



app.get('/products', (req, res) => {

    productModel.find({}, (err, data) => {
        if (!err) {
            res.send({
                message: "got all products successfully",
                data: data
            })
        } else {
            res.status(500).send({
                message: "server error"
            })
        }
    });
})

app.get('/product/:id', (req, res) => {

    const id = req.params.id;

    productModel.findOne({ _id: id }, (err, data) => {
        if (!err) {
            if (data) {
                res.send({
                    message: `get product by id: ${data._id} success`,
                    data: data
                });
            } else {
                res.status(404).send({
                    message: "product not found",
                })
            }
        } else {
            res.status(500).send({
                message: "server error"
            })
        }
    });
})



///getreq connect db ///


///deletereq connect db ///

app.delete('/product/:id', (req, res) => {
    const id = req.params.id;

    productModel.deleteOne({ _id: id }, (err, deletedData) => {
        console.log("deleted: ", deletedData);
        if (!err) {

            if (deletedData.deletedCount !== 0) {
                res.send({
                    message: "Product has been deleted successfully",
                })
            } else {
                res.status(404);
                res.send({
                    message: "No Product found with this id: " + id,
                });
            }
        } else {
            res.status(500).send({
                message: "server error"
            })
        }
    });




})


///deletereq connect db ///


///updatereq connect db ///

app.put('/product/:id', async (req, res) => {

    const body = req.body;
    const id = req.params.id;

    if (
        !body.name ||
        !body.price ||
        !body.description
    ) {
        res.status(400).send(` required parameter missing. example request body:
        {
            "name": "value",
            "price": "value",
            "description": "value"
        }`)
        return;
    }

    try {
        let data = await productModel.findByIdAndUpdate(id,
            {
                name: body.name,
                price: body.price,
                description: body.description
            },
            { new: true }
        ).exec();

        console.log('updated: ', data);

        res.send({
            message: "product modified successfully"
        });

    } catch (error) {
        res.status(500).send({
            message: "server error"
        })
    }
})


///updatereq connect db ///

///port connect code ///

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

///port connect code ///


///mongodb connect && disconnect code ///

/////////////////////////////////////////////////////////////////////////////////////////////////
mongoose.connect(mongodbURI);

////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on('connected', function () {//connected
    console.log("Mongoose is connected");
});

mongoose.connection.on('disconnected', function () {//disconnected
    console.log("Mongoose is disconnected");
    process.exit(1);
});

mongoose.connection.on('error', function (err) {//any error
    console.log('Mongoose connection error: ', err);
    process.exit(1);
});

process.on('SIGINT', function () {/////this function will run jst before app is closing
    console.log("app is terminating");
    mongoose.connection.close(function () {
        console.log('Mongoose default connection closed');
        process.exit(0);
    });
});



///mongodb connect && disconnect code ///
////////////////mongodb connected disconnected events///////////////////////////////////////////////