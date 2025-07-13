const express = require('express');
const router = express.Router();
const ClassRoutine = require('../models/ClassRoutine');

// Get all routines
router.get('/', async (req, res) => {
  try {
    const routines = await ClassRoutine.find();
    res.json(routines);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new routine
router.post('/', async (req, res) => {
  try {
    const routine = new ClassRoutine(req.body);
    await routine.save();
    res.status(201).json(routine);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a routine
router.delete('/:id', async (req, res) => {
  try {
    await ClassRoutine.findByIdAndDelete(req.params.id);
    res.json({ message: 'Routine deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a routine
router.put('/:id', async (req, res) => {
  try {
    const updated = await ClassRoutine.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router; 