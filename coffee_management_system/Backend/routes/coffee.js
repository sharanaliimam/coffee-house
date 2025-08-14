const express = require('express');
const router = express.Router();

const Coffee = require('../models/Coffee');  // Import the Coffee model

// Create new coffee (POST /api/coffees)
router.post('/', async (req, res) => {
  try {
    const coffee = new Coffee(req.body);     // Take data from request
    const savedCoffee = await coffee.save(); // Save to database
    res.status(201).json(savedCoffee);       // Send back saved coffee
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all coffees (GET /api/coffees) with optional filtering and availability field
router.get('/', async (req, res) => {
  try {
    const filter = {};

    // Filter by category if provided, e.g., /api/coffees?category=Latte
    if (req.query.category) {
      filter.category = req.query.category;
    }

    // Filter by availability (stock > 0), e.g., /api/coffees?available=true
    if (req.query.available === 'true') {
      filter.stock = { $gt: 0 };
    }

    let coffees = await Coffee.find(filter);

    // Add availability field based on stock
    coffees = coffees.map(coffee => {
      return {
        ...coffee.toObject(),
        availability: coffee.stock > 0 ? 'Available' : 'Sold Out'
      };
    });

    res.json(coffees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get one coffee by ID (GET /api/coffees/:id)
router.get('/:id', async (req, res) => {
  try {
    const coffee = await Coffee.findById(req.params.id);
    if (!coffee) return res.status(404).json({ error: 'Coffee not found' });
    res.json(coffee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update coffee by ID (PUT /api/coffees/:id)
router.put('/:id', async (req, res) => {
  try {
    const updatedCoffee = await Coffee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCoffee) return res.status(404).json({ error: 'Coffee not found' });
    res.json(updatedCoffee);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete coffee by ID (DELETE /api/coffees/:id)
router.delete('/:id', async (req, res) => {
  try {
    const deletedCoffee = await Coffee.findByIdAndDelete(req.params.id);
    if (!deletedCoffee) return res.status(404).json({ error: 'Coffee not found' });
    res.json({ message: 'Coffee deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
