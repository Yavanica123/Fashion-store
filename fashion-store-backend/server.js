const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/fashionstore', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected successfully"))
.catch(err => console.log(err));

// Order Schema
const OrderSchema = new mongoose.Schema({
    username: String,
    products: [
        {
            name: String,
            price: Number,
            quantity: Number
        }
    ],
    totalBill: Number,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Order = mongoose.model('Order', OrderSchema);

// Route to save order
app.post('/api/saveOrder', async (req, res) => {
    try {
        const { username, cartItems, totalBill } = req.body;

        const newOrder = new Order({
            username: username,
            products: cartItems,
            totalBill: totalBill
        });

        await newOrder.save();
        res.status(200).json({ message: "Order saved successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error while saving order" });
    }
});

// Route to get orders for a user
app.get('/api/orders/:username', async (req, res) => {
    try {
        const username = req.params.username;
        const orders = await Order.find({ username }).sort({ createdAt: -1 });

        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error while fetching orders" });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
