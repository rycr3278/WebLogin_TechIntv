const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const collection = require('./config');

const app = express();

// convert data into json format
app.use(express.json());

app.use(express.urlencoded({ extended: false }));


// use EJS as the view engine
app.set('view engine', 'ejs');

// static file
app.use(express.static("public"));


app.get('/', (req, res) => {
    res.render('login');
    });

app.get('/signup', (req, res) => {
    res.render('signup');
    });
 
// register user
app.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send('Both email and password are required.');
    }
    
    const existingUser = await collection.findOne({email: email});

    if (existingUser) {
        res.send('User already exists. Please choose a different username.');
    } else {
        try {
            // Hash the password using bcrypt
            const saltRounds = 10; // number of salt round for bcrypt
            const hashedPassword = await bcrypt.hash(password, saltRounds); // changed from data.password to password
            
            // Proceed with creating the user
            const userdata = await collection.create({ email, password: hashedPassword }); // use hashed password here
            console.log(userdata);
            res.send('User registered successfully');
        } catch (error) {
            console.error(error);
            res.status(500).send('An error occurred during registration');
        }
    }
});

// login user
app.post('/login', async (req, res) => {
    try{
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send('Both email and password are required.');
        }

        const user = await collection.findOne({ email: email });

        if (!user) {
            return res.status(400).send('User does not exist.');
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(400).send('Invalid password.');
        }

        // Redirect to home.js
        res.render('home');
    } catch 
    (error) {
        console.error(error);
        res.status(500).send('An error occurred during login');}
    });


// local port setup
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
