require('dotenv').config();

module.exports = {
    port: process.env.PORT || 8000,
    dbUrl: process.env.DB_URL,
    swageerOptions: {
        swaggerOptions: {
          defaultModelsExpandDepth: 0,
        },
      }
};