const mongoose = require('mongoose');

const FeeStructureSchema = new mongoose.Schema(
  {
    className: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      // e.g. S1, S2, S3, S4, S5, S6, S1-Holiday, S2-Holiday ...
    },
    label: {
      type: String,
      trim: true, // e.g. "Senior 1", "Senior 1 (Holiday)"
    },
    term: {
      type: String,
      enum: ['Term 1', 'Term 2', 'Term 3', 'Holiday', 'Full Year'],
      default: 'Term 1',
    },
    isHoliday: {
      type: Boolean,
      default: false,
    },
    // Fee breakdown
    tuition:   { type: Number, default: 0 },
    exam:      { type: Number, default: 0 },
    library:   { type: Number, default: 0 },
    sports:    { type: Number, default: 0 },
    transport: { type: Number, default: 0 },
    uniform:   { type: Number, default: 0 },
    other:     { type: Number, default: 0 },
    // Computed total (auto-calculated)
    totalFee:  { type: Number, default: 0 },
    notes:     { type: String, default: '' },
  },
  { timestamps: true }
);

// Auto-calculate totalFee before save
FeeStructureSchema.pre('save', function (next) {
  this.totalFee =
    (this.tuition || 0) +
    (this.exam || 0) +
    (this.library || 0) +
    (this.sports || 0) +
    (this.transport || 0) +
    (this.uniform || 0) +
    (this.other || 0);
  next();
});

module.exports = mongoose.model('FeeStructure', FeeStructureSchema);
