const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: "Doctor-Patient Management API",
            version: "1.0.0",
            description: "API Documentation for Doctor-Patient Management System"
        },
        servers: [{ url: "http://localhost:5000" }]
    },
    apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = { swaggerDocs, swaggerUi };
