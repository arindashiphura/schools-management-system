const FeeStructure = require('../models/FeeStructure');

// Get all fee structures
exports.getAllFeeStructures = async (req, res) => {
  try {
    const fees = await FeeStructure.find().sort({ className: 1 });
    res.status(200).json({ success: true, feeStructures: fees });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get fee structure by class name
exports.getFeeByClass = async (req, res) => {
  try {
    const fee = await FeeStructure.findOne({ className: req.params.className });
    if (!fee) return res.status(404).json({ success: false, message: 'Fee structure not found for this class' });
    res.status(200).json({ success: true, feeStructure: fee });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Create fee structure
exports.createFeeStructure = async (req, res) => {
  try {
    const { className, label, term, isHoliday, tuition, exam, library, sports, transport, uniform, other, notes } = req.body;
    if (!className) return res.status(400).json({ success: false, message: 'className is required' });

    const existing = await FeeStructure.findOne({ className });
    if (existing) return res.status(400).json({ success: false, message: `Fee structure for ${className} already exists. Use update instead.` });

    const fee = new FeeStructure({ className, label, term, isHoliday, tuition, exam, library, sports, transport, uniform, other, notes });
    await fee.save();
    res.status(201).json({ success: true, feeStructure: fee });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update fee structure
exports.updateFeeStructure = async (req, res) => {
  try {
    const fee = await FeeStructure.findById(req.params.id);
    if (!fee) return res.status(404).json({ success: false, message: 'Fee structure not found' });

    const fields = ['label', 'term', 'isHoliday', 'tuition', 'exam', 'library', 'sports', 'transport', 'uniform', 'other', 'notes'];
    fields.forEach(f => { if (req.body[f] !== undefined) fee[f] = req.body[f]; });

    await fee.save(); // triggers pre-save totalFee calculation
    res.status(200).json({ success: true, feeStructure: fee });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete fee structure
exports.deleteFeeStructure = async (req, res) => {
  try {
    const fee = await FeeStructure.findByIdAndDelete(req.params.id);
    if (!fee) return res.status(404).json({ success: false, message: 'Fee structure not found' });
    res.status(200).json({ success: true, message: 'Fee structure deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
