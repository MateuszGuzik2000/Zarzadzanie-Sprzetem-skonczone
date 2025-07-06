
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div>
        <NavBar />
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<EquipmentList />} />
            <Route path="/equipment/add" element={<AddEquipment />} />
            <Route path="/equipment/:id" element={<EquipmentDetail />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

function NavBar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">IT Tracker</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/">Sprzęt</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/equipment/add">Dodaj sprzęt</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

// Equipment list page
function EquipmentList() {
  // Placeholder state
  const [items, setItems] = React.useState([
    { id: 1, name: 'Drukarka HP', location: 'Centrala', status: 'Aktywne' },
    { id: 2, name: 'Monitor Dell', location: 'Oddział Warszawa', status: 'W serwisie' }
  ]);

  const navigate = useNavigate();

  return (
    <div>
      <h2>Lista sprzętu</h2>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>#</th>
            <th>Nazwa</th>
            <th>Lokalizacja</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id} onClick={() => navigate(`/equipment/${item.id}`)} style={{ cursor: 'pointer' }}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.location}</td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Add equipment page
function AddEquipment() {
  const navigate = useNavigate();
  const [form, setForm] = React.useState({ name: '', model: '', serial: '', purchaseDate: '', location: '' });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = e => {
    e.preventDefault();
    // TODO: wysłać dane do backendu
    console.log('Submit', form);
    navigate('/');
  };

  return (
    <div>
      <h2>Dodaj nowy sprzęt</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nazwa</label>
          <input name="name" value={form.name} onChange={handleChange} className="form-control" required />
        </div>
        <div className="mb-3">
          <label className="form-label">Model</label>
          <input name="model" value={form.model} onChange={handleChange} className="form-control" required />
        </div>
        <div className="mb-3">
          <label className="form-label">Numer seryjny</label>
          <input name="serial" value={form.serial} onChange={handleChange} className="form-control" required />
        </div>
        <div className="mb-3">
          <label className="form-label">Data zakupu</label>
          <input type="date" name="purchaseDate" value={form.purchaseDate} onChange={handleChange} className="form-control" required />
        </div>
        <div className="mb-3">
          <label className="form-label">Lokalizacja</label>
          <input name="location" value={form.location} onChange={handleChange} className="form-control" placeholder="np. Centrala" required />
        </div>
        <button type="submit" className="btn btn-primary">Zapisz</button>
      </form>
    </div>
  );
}

// Equipment detail page
function EquipmentDetail() {
  // Placeholder data
  const [item, setItem] = React.useState({ id: 1, name: 'Drukarka HP', model: 'HP1234', serial: 'SN123456', location: 'Centrala', purchaseDate: '2024-01-10' });
  const [history, setHistory] = React.useState([
    { id: 1, date: '2024-01-10', event: 'Zakup' },
    { id: 2, date: '2024-06-15', event: 'Wysłanie do oddziału' },
    { id: 3, date: '2024-09-01', event: 'Wysłanie do serwisu' }
  ]);

  return (
    <div>
      <h2>Szczegóły sprzętu</h2>
      <ul className="list-group mb-4">
        <li className="list-group-item"><strong>ID:</strong> {item.id}</li>
        <li className="list-group-item"><strong>Nazwa:</strong> {item.name}</li>
        <li className="list-group-item"><strong>Model:</strong> {item.model}</li>
        <li className="list-group-item"><strong>S/N:</strong> {item.serial}</li>
        <li className="list-group-item"><strong>Zakup:</strong> {item.purchaseDate}</li>
        <li className="list-group-item"><strong>Lokalizacja:</strong> {item.location}</li>
      </ul>

      <h3>Historia zdarzeń</h3>
      <ul className="list-group">
        {history.map(h => (
          <li key={h.id} className="list-group-item">
            {h.date} - {h.event}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;