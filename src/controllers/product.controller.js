const { Product } = require('../models');
const _ = require('lodash');
const APIError = require('../utils/APIError');

/**
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {Array<Object>} List of products
 */
exports.listProducts = async (req, res, next) => {
    try {
        const products = await Product.find({ isDeleted: false }, { isDeleted: 0, __v: 0 }).sort({ _id: -1 }).lean();
        return res.status(200).json({ status: true, data: products });
    } catch (err) {
        console.log(err);
        next(err);
    }
};

/**
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {Object} Newly created product information
 */
exports.createProduct = async (req, res, next) => {
    try {
        const { name, price } = req.body;
        const product = await Product.create({ name, price });
        let data = _.omit(JSON.parse(JSON.stringify(product)), ['isDeleted', '__v']);
        return res.status(201).json({ status: true, data });
    } catch (err) {
        console.log(err);
        next(err);
    }
}


/**
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {Object} Product identified by Id
 */
exports.getProductById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const product = await Product.findOne({ _id: id, isDeleted: false }, '-isDeleted -__v');
        if (!product)
            throw new APIError({ status: 404, message: 'No such product exits with given id.' });
        return res.status(200).json({ status: true, data: product });
    } catch (err) {
        console.log(err);
        next(err);
    }
};

/**
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {Object} Updated info of product
 */
exports.updateProduct = async (req, res, next) => {
    try {
        const id = req.params.id;
        const updatePayload = req.body;

        const productInfo = await Product.findOne({ _id: id, isDeleted: false });
        if (!productInfo)
            throw new APIError({ status: 404, message: 'No such product exits with given id.' });

        const isProductExitsWithName = await Product.find({
            _id: { $ne: id },
            name: new RegExp(`^${updatePayload.name}$`, 'i'),
            isDeleted: false,
        });

        if (isProductExitsWithName.length)
            throw new APIError({ status: 404, message: 'Product with given name already exists!.' });

        const product = await Product.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { $set: updatePayload },
            { new: true }
        );
        if (!product) {
            throw new APIError({ status: 404, message: 'No such product exits with given id.' });
        }
        return res.status(200).json({ status: false, data: _.omit(product, ['isDeleted', '__v']) });
    } catch (err) {
        console.log(err);
        next(err);
    }
};

/**
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @returns {string} Success message of product deletion.
 */
exports.deleteProduct = async (req, res, next) => {

    try {
        const id = req.params.id;
        const product = await Product.findOneAndUpdate(
            { _id: id, isDeleted: false },
            { isDeleted: true },
            { new: true });

        if (!product) {
            throw new APIError({ status: 404, message: 'No such product exits with given id.' });
        }
        return res.status(200).json({ status: true, message: 'Product is deleted' });
    } catch (err) {
        console.log(err);
        next(err);
    }
};