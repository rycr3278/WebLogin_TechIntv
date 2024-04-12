const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const collection = require('./config');

// Import required modules

// Initialize express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: false }));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Serve static files from the "public" directory
app.use(express.static("public"));

// Route for the home page
app.get('/', (req, res) => {
    res.render('login');
});

// Route for the signup page
app.get('/signup', (req, res) => {
    res.render('signup');
});

// Route to handle user registration
app.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    // Check if email and password are provided
    if (!email || !password) {
        return res.status(400).send('Both email and password are required.');
    }
    
    // Check if user already exists
    const existingUser = await collection.findOne({email: email});

    if (existingUser) {
        res.send('User already exists. Please choose a different username.');
    } else {
        try {
            // Hash the password using bcrypt
            const saltRounds = 10; // number of salt round for bcrypt
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            
            // Create the user
            const userdata = await collection.create({ email, password: hashedPassword });
            console.log(userdata);
            res.send('User registered successfully');
        } catch (error) {
            console.error(error);
            res.status(500).send('An error occurred during registration');
        }
    }
});

// Route to handle user login
app.post('/login', async (req, res) => {
    try{
        const { email, password } = req.body;
        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).send('Both email and password are required.');
        }

        // Check if user exists
        const user = await collection.findOne({ email: email });

        if (!user) {
            return res.status(400).send('User does not exist.');
        }

        // Check if password is correct
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(400).send('Invalid password.');
        }

        // Redirect to home page
        res.render('home');
    } catch 
    (error) {
        console.error(error);
        res.status(500).send('An error occurred during login');}
    });

// Set up server to listen on specified port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
