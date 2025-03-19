require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const patientRoutes = require('./routes/patient');
const doctorRoutes = require('./routes/doctor');
const hospitalRoutes = require('./routes/hospital');
const adminRoutes = require('./routes/admin');
const superAdminRoutes = require('./routes/superAdmin');
const authRoutes = require('./routes/auth');
const { swaggerDocs, swaggerUi } = require('./swagger');
const cors = require('cors');


const app = express();
app.use(express.json());
app.use(cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));


app.use('/api/patient', patientRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/super', superAdminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

mongoose.connect(process.env.MONGO_URI);

app.listen(5000, () => console.log('Server running on port 5000'));
