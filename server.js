const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// PostgreSQL connection setup


const db = new Pool({
  connectionString: 'postgresql://postgres.pjljdredabkszotdbgfv:altruisty555T@aws-0-ap-south-1.pooler.supabase.com:5432/postgres',
  ssl: {
    rejectUnauthorized: false,
  },
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to PostgreSQL:', err);
    process.exit(1);
  }
  console.log('Connected to Supabase PostgreSQL database');
});




// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to add payment_id
app.post('/add-payment', (req, res) => {
  const { payment_id } = req.body;
  if (!payment_id) {
    return res.status(400).json({ error: 'payment_id is required' });
  }
  const query = 'INSERT INTO payments (payment_id) VALUES (?)';
  db.query(query, [payment_id], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'payment_id already exists' });
      }
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ message: 'payment_id added successfully' });
  });
});

// Endpoint to check if payment_id exists
app.get('/check-payment', (req, res) => {
  const payment_id = req.query.payment_id;
  if (!payment_id) {
    return res.status(400).json({ error: 'payment_id query parameter is required' });
  }
  const query = 'SELECT * FROM payments WHERE payment_id = ?';
  db.query(query, [payment_id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length > 0) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
