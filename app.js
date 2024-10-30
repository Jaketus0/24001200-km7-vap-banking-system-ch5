require('dotenv').config();
const express = require("express");
const bodyParser = require('body-parser');
const morgan = require('morgan');
const flash = require("express-flash");
const authRoutes = require('./routes/authRoute');
const userRoutes = require('./routes/userRoute');
const profileRoutes = require('./routes/profileRoute');
const accountRoutes = require('./routes/accountRoute');
const transactionRoutes = require('./routes/transactionRoute');
const swaggerJSON = require('./docs/swagger.json');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = 3000;

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerJSON));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(bodyParser.json());



app.use(morgan("dev"));
app.use(flash());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/accounts', accountRoutes);
app.use('/api/v1/transactions', transactionRoutes);


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
module.exports = app;