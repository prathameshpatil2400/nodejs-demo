const swaggerUi = require('swagger-ui-express');
const { validate } = require('express-validation');
const { ProductController } = require('../controllers');
const swaggerDoc = require('../docs/swaggerDoc.json');
const { swageerOptions } = require('../config/appConfig');
const { isExists, create, show, update, destroy } = require('../validations/product.validation');

function initRoutes(app) {

    app
        .route('/')
        .get((req, res, next) => {
            res.render('product_page');
        });

    app
        .route('/flickr')
        .get((req, res, next) => {
            res.render('flickr');
        });

    app
        .use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc, swageerOptions));

    app
        .route('/product')
        .get(ProductController.listProducts)
        .post(validate(create), ProductController.createProduct);

    app
        .route('/product/:id')
        .get(validate(show), isExists, ProductController.getProductById)
        .put(validate(update), isExists, ProductController.updateProduct)
        .delete(validate(destroy), isExists, ProductController.deleteProduct);
};

module.exports = initRoutes;