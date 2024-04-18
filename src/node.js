const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();

// MySQL connection configuration
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'password123',
  database: 'feedback_database'
});

// Connect to MySQL
connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// POST route to handle feedback submission
app.post('/submit-feedback', (req, res) => {
  const feedbackText = req.body.feedback;
  const currentDate = new Date().toLocaleString();

  const query = 'INSERT INTO feedback (text, date) VALUES (?, ?)';
  connection.query(query, [feedbackText, currentDate], (err, result) => {
    if (err) {
      console.error('Error saving feedback to database:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    console.log('Feedback saved to database');
    res.status(200).send('Feedback submitted successfully');
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
