const mongoose = require('mongoose');
const { DB_CONN, DB_USER, DB_PW } = process.env;

mongoose
   .connect(
      DB_CONN,
      { auth: { user: DB_USER, password: DB_PW }, useUnifiedTopology: true, useNewUrlParser: true }
   )
   .then(() => console.log('Successfully connected to the DB through the power of memes...'))
   .catch(console.error); 
