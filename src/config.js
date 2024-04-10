const mongoose = require('mongoose');
const connect = mongoose.connect('mongodb://localhost:27017/login-tut');

// check if connection to database is successful
connect.then(() => {
    console.log('Database connected successfully');
})
.catch(() => {
    console.log('Error connecting to database')
});

// create a schema
const LoginSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

// collection within the database
const collection = new mongoose.model('users', LoginSchema);

module.exports = collection;