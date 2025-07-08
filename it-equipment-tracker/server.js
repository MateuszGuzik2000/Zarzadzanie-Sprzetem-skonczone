// server.js
// Backend: Express.js + SQLite for IT Equipment Tracker
// Run: npm install express sqlite3 body-parser cors

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Initialize SQLite database
const db = new sqlite3.Database('./db.sqlite3', (err) => {
  if (err) console.error('Could not connect to database', err);
  else console.log('Connected to SQLite database');
});

// Create tables
const initSql = `
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS locations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  city TEXT,
  address TEXT,
  type TEXT
);

CREATE TABLE IF NOT EXISTS equipment (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  barcode TEXT UNIQUE,
  name TEXT NOT NULL,
  model TEXT,
  serial_number TEXT,
  purchase_date TEXT,
  location_id INTEGER,
  status TEXT DEFAULT 'aktywny',
  FOREIGN KEY(location_id) REFERENCES locations(id)
);


CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  equipment_id INTEGER,
  timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
  event_type TEXT,
  notes TEXT,
  location_id INTEGER,
  FOREIGN KEY(equipment_id) REFERENCES equipment(id),
  FOREIGN KEY(location_id) REFERENCES locations(id)
);
`;

db.exec(initSql, (err) => {
  if (err) console.error('Failed to initialize tables', err);
  else console.log('Tables ensured');
});

// // Seed initial data: multiple locations
const seedLocations = `
INSERT OR IGNORE INTO locations(id, name, city, address, type) VALUES
 (1, 'Centrala', 'Warszawa', 'ul. Centralna 1', 'centrala'),
 (2, 'Rzeszów', 'Rzeszów', 'ul. Rzeszowska 10', 'oddział'),
 (3, 'Mielec', 'Mielec', 'ul. Lotnicza 5', 'oddział'),
 (4, 'Sanok', 'Sanok', 'ul. Przemyska 2', 'oddział'),
 (5, 'Krosno', 'Krosno', 'ul. Bieszczadzka 7', 'oddział'),
 (6, 'Tarnobrzeg', 'Tarnobrzeg', 'ul. Sandomierska 4', 'oddział'),
 (7, 'Nowa Dęba', 'Nowa Dęba', 'ul. Fabryczna 3', 'oddział'),
 (8, 'Jasło', 'Jasło', 'ul. Słowackiego 1', 'oddział'),
 (9, 'Stalowa Wola', 'Stalowa Wola', 'ul. Hutnicza 6', 'oddział'),
 (10,'Tyczyn', 'Tyczyn', 'ul. Rynek 8', 'oddział');
`;
db.run(seedLocations, (err) => { if (err) console.error('Seed locations error', err); });
;
db.run(seedLocations, (err) => { if (err) console.error('Seed locations error', err); });



// Get all equipment
app.get('/api/equipment', (req, res) => {
  const sql = `
    SELECT e.*, l.name AS location_name
    FROM equipment e
    LEFT JOIN locations l ON e.location_id = l.id
  `;
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});


// Create equipment
app.post('/api/equipment', (req, res) => {
 const { barcode, name, model, serial_number, purchase_date, location_id, status } = req.body;
const sql = `INSERT INTO equipment (barcode,name,model,serial_number,purchase_date,location_id,status) VALUES (?,?,?,?,?,?,?)`;
db.run(sql, [barcode, name, model, serial_number, purchase_date, location_id, status || 'aktywny'], function(err) {

    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

// Get equipment detail + events
app.get('/api/equipment/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM equipment WHERE id = ?', [id], (err, equipment) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!equipment) return res.status(404).json({ error: 'Not found' });
    db.all('SELECT * FROM events WHERE equipment_id = ? ORDER BY timestamp', [id], (err, events) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ equipment, events });
    });
  });
});

// Add event
app.post('/api/equipment/:id/event', (req, res) => {
  const eid = req.params.id;
  const { event_type, notes, location_id } = req.body;
  db.run('INSERT INTO events (equipment_id,event_type,notes,location_id) VALUES (?,?,?,?)', [eid, event_type, notes, location_id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

// Get locations and equipment count
app.get('/api/locations', (req, res) => {
  const sql = `SELECT l.id,l.name, (SELECT COUNT(*) FROM equipment e WHERE e.location_id = l.id) AS equipment_count FROM locations l`;
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});


app.delete('/api/locations/:id', (req, res) => {
  const id = req.params.id;


  db.run('UPDATE equipment SET location_id = NULL WHERE location_id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: 'Failed to clear equipment location: ' + err.message });

   
    db.run('DELETE FROM locations WHERE id = ?', [id], function(err) {
      if (err) return res.status(500).json({ error: 'Failed to delete location: ' + err.message });
      res.json({ message: 'Location deleted', changes: this.changes });
    });
  });
});


// Create location
app.post('/api/locations', (req, res) => {
  const { name, city, address, type } = req.body;
  const sql = `INSERT INTO locations (name, city, address, type) VALUES (?,?,?,?)`;
  db.run(sql, [name, city, address, type], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

// Delete location
app.delete('/api/locations/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM locations WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Deleted', changes: this.changes });
  });
});

app.put('/api/equipment/:id/location', (req, res) => {
  const id = req.params.id;
  const { location_id } = req.body;
  db.run('UPDATE equipment SET location_id = ? WHERE id = ?', [location_id, id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Location updated', changes: this.changes });
  });
});
app.put('/api/equipment/:id/status', (req, res) => {
  const id = req.params.id;
  const { status } = req.body;
  if (!status) return res.status(400).json({ error: 'Missing status' });

  db.run('UPDATE equipment SET status = ? WHERE id = ?', [status, id], function(err) {
    if (err) {
      console.error('Update status failed:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Status updated', changes: this.changes });
  });
});
// Delete equipment
app.delete('/api/equipment/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM equipment WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Equipment deleted', changes: this.changes });
  });
});


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
