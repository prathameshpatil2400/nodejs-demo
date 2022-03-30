const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const APIError = require('../utils/APIError');

const PRODUCT = require('../models/product.model');

exports.show = {
  params: Joi.object({
    id: Joi.objectId().required(),
  })
};

exports.create = {
  body: Joi.object({
    name: Joi.string().required().trim().replace(/\s\s+/g, ' '),
    price: Joi.number().required(),
  })
}

exports.update = {
  params: Joi.object({
    id: Joi.objectId().required(),
  }),
  body: Joi.object({
    name: Joi.string().optional().trim().replace(/\s\s+/g, ' '),
    price: Joi.number().optional().min(1),
  }).required().not({})
}

exports.destroy = {
  params: Joi.object({
    id: Joi.objectId().required(),
  })
};

exports.isExists = async (req, res, next) => {
  try {
    const _id = req.params.id;
    const count = await PRODUCT.countDocuments({ _id, isDeleted: false });
    if (count === 0) throw new APIError({ status: 404, message: `No record were found for given id` });
    next();
  }
  catch (err) { next(err); }
}