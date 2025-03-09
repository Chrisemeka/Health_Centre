require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const patientRoutes = require('./routes/patientRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { swaggerDocs, swaggerUi } = require('./swagger');

const app = express();
app.use(express.json());

app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

mongoose.connect(process.env.MONGO_URI);

app.listen(5000, () => console.log('Server running on port 5000'));
