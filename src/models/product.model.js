const mongoose = require('mongoose');
const APIError = require('../utils/APIError');

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 1 },
  isDeleted: { type: Boolean, default: false },
});

ProductSchema.pre('save', async function (next) {
  const isRecordExits = await mongoose.models['product'].findOne({
    _id: { $ne: this._id },
    name: new RegExp(this.name, 'i'),
    isDeleted: false,
  });
  if (isRecordExits) {
    throw new APIError({
      status: 400,
      message: 'Duplicate Product Entry denied.',
    });
  }
  next();
});

module.exports = mongoose.model('product', ProductSchema, 'products');
