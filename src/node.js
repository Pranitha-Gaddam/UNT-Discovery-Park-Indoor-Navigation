const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = 3000;

// Create connection pool to MySQL database
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'username',
    password: 'password',
    database: 'feedback_db'
});

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Route to handle feedback submission
app.post('/submit-feedback', (req, res) => {
    const { feedback, date } = req.body;

    // Insert feedback into the database
    pool.query('INSERT INTO feedback (feedback_text, creation_date) VALUES (?, ?)', [feedback, date], (error, results, fields) => {
        if (error) {
            console.error('Error inserting feedback:', error);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            console.log('Feedback inserted successfully');
            res.status(200).json({ message: 'Feedback submitted successfully' });
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
