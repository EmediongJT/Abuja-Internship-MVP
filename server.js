const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/pulsecheck')
  .then(() => console.log("MongoDB connected successfully! 🎉"))
  .catch((err) => console.error("Database connection error:", err));

// Expense Database Structure
const ExpenseSchema = new mongoose.Schema({
    amount: Number,
    date: { type: Date, default: Date.now }
});
const Expense = mongoose.model('Expense', ExpenseSchema);

// Water Database Structure
const WaterSchema = new mongoose.Schema({
    count: Number,
    date: { type: Date, default: Date.now }
});
const Water = mongoose.model('Water', WaterSchema);

// API Routes to Save and Get Data
app.post('/api/expenses', async (req, res) => {
    try {
        const newExpense = new Expense({ amount: req.body.amount });
        await newExpense.save();
        res.status(201).json(newExpense);
    } catch (error) {
        res.status(500).json({ error: "Failed to save expense" });
    }
});

app.get('/api/expenses', async (req, res) => {
    try {
        const expenses = await Expense.find();
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch expenses" });
    }
});

app.post('/api/water', async (req, res) => {
    try {
        const waterLog = new Water({ count: req.body.count });
        await waterLog.save();
        res.status(201).json(waterLog);
    } catch (error) {
        res.status(500).json({ error: "Failed to save water log" });
    }
});

app.get('/api/water', async (req, res) => {
    try {
        const waterData = await Water.findOne().sort({ date: -1 });
        res.status(200).json(waterData || { count: 0 });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch water data" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running beautifully on port ${PORT} 🚀`);
});