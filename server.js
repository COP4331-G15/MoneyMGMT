require('dotenv').config();
require('./server/db-conn');

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// mount routes
app.use('/api/thoughts/', require('./server/routes/thoughts-route'));
app.use('/fakeapi/', require('./server/routes/fakeapi.js'));

// React
app.use(express.static(path.join(__dirname, 'frontend/build')));
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'frontend/build/index.html'));
});



const { PORT } = process.env;
app.listen(PORT, () => console.log(`Wizardry happening on port ${PORT}`));