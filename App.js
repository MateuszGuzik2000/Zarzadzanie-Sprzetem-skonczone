<<<<<<< HEAD

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
=======
/*
  Project: IT Equipment Tracker Frontend
  Stack: React + Bootstrap
  Updated: Integrated with Express+SQLite backend, dropdown for branches
*/
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import Barcode from 'react-barcode';
import { v4 as uuidv4 } from 'uuid';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function App() {
  return (
    <Router>
      <NavBar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<EquipmentList />} />
          <Route path="/equipment/add" element={<AddEquipment />} />
          <Route path="/equipment/:id" element={<EquipmentDetail />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/stats" element={<Stats />} />

          
        </Routes>
>>>>>>> 5e732449e5803058acdaf6378ae439db3bc7b6ed
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
<<<<<<< HEAD
            <li className="nav-item">
              <Link className="nav-link" to="/">Sprzęt</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/equipment/add">Dodaj sprzęt</Link>
            </li>
          </ul>
=======
            <li className="nav-item"><Link className="nav-link" to="/">Sprzęt</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/equipment/add">Dodaj sprzęt</Link></li>  
            <li className="nav-item"><Link className="nav-link" to="/locations">Oddziały</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/stats">Statystyki</Link></li>

          </ul>

>>>>>>> 5e732449e5803058acdaf6378ae439db3bc7b6ed
        </div>
      </div>
    </nav>
  );
}

<<<<<<< HEAD
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
=======
function EquipmentList() {
  const [items, setItems] = React.useState([]);
  const navigate = useNavigate();
  const handleDelete = (id) => {
  if (!window.confirm('Na pewno chcesz usunąć ten sprzęt?')) return;

  fetch(`${API_URL}/equipment/${id}`, { method: 'DELETE' })
    .then(res => res.json())
    .then(() => setItems(prev => prev.filter(item => item.id !== id)))
    .catch(err => console.error('Delete equipment failed:', err));
};

  React.useEffect(() => {
    fetch(`${API_URL}/equipment`)
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.error('Fetch equipment failed:', err));
  }, []);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Lista sprzętu</h2>
        <button className="btn btn-success" onClick={() => navigate('/equipment/add')}>Dodaj sprzęt</button>
      </div>
      <table className="table table-hover">
        <thead>
          <tr><th>#</th><th>Nazwa</th><th>Lokalizacja</th><th>Status</th><th>Akcje</th>
</tr>
>>>>>>> 5e732449e5803058acdaf6378ae439db3bc7b6ed
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id} onClick={() => navigate(`/equipment/${item.id}`)} style={{ cursor: 'pointer' }}>
              <td>{item.id}</td>
              <td>{item.name}</td>
<<<<<<< HEAD
              <td>{item.location}</td>
              <td>{item.status}</td>
=======
              <td>{item.location_id}</td>
              <td>{item.status || 'Brak danych'}</td>
              <td>
  <button className="btn btn-danger btn-sm" onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}>
    Usuń
  </button>
</td>

>>>>>>> 5e732449e5803058acdaf6378ae439db3bc7b6ed
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

<<<<<<< HEAD
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
=======
function AddEquipment() {
  const navigate = useNavigate();
  const [locations, setLocations] = React.useState([]);
  const [form, setForm] = React.useState({ name: '', model: '', serial_number: '', purchase_date: '', location_id: '', barcode: '' });

  React.useEffect(() => {
    setForm(prev => ({ ...prev, barcode: uuidv4() }));
    fetch(`${API_URL}/locations`)
      .then(res => res.json())
      .then(data => setLocations(data))
      .catch(err => console.error('Fetch locations failed:', err));
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    fetch(`${API_URL}/equipment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(() => navigate('/'))
      .catch(err => console.error('Create equipment failed:', err));
>>>>>>> 5e732449e5803058acdaf6378ae439db3bc7b6ed
  };

  return (
    <div>
      <h2>Dodaj nowy sprzęt</h2>
<<<<<<< HEAD
      <form onSubmit={handleSubmit}>
=======
      <div className="mb-4">
        <label className="form-label">Kod kreskowy:</label>
        {form.barcode && (
          <>
            <Barcode value={form.barcode} />
            <div className="mt-2"><code>{form.barcode}</code></div>
          </>
        )}
      </div>
      <form onSubmit={handleSubmit}>
        <input type="hidden" name="barcode" value={form.barcode} />
>>>>>>> 5e732449e5803058acdaf6378ae439db3bc7b6ed
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
<<<<<<< HEAD
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
=======
          <input name="serial_number" value={form.serial_number} onChange={handleChange} className="form-control" required />
        </div>
        <div className="mb-3">
          <label className="form-label">Data zakupu</label>
          <input type="date" name="purchase_date" value={form.purchase_date} onChange={handleChange} className="form-control" required />
        </div>
        <div className="mb-3">
          <label className="form-label">Oddział</label>
          <select name="location_id" value={form.location_id} onChange={handleChange} className="form-select" required>
            <option value="">– wybierz oddział –</option>
            {locations.map(loc => (
              <option key={loc.id} value={loc.id}>{loc.name}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Zapisz sprzęt</button>
>>>>>>> 5e732449e5803058acdaf6378ae439db3bc7b6ed
      </form>
    </div>
  );
}

<<<<<<< HEAD
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
=======
function EquipmentDetail() {
  const { id } = useParams();
  const [item, setItem] = React.useState(null);
  const [events, setEvents] = React.useState([]);
  const [showForm, setShowForm] = React.useState(false);
  const [newEvent, setNewEvent] = React.useState({ event_type: '', notes: '', location_id: '' });

  React.useEffect(() => {
    fetch(`${API_URL}/equipment/${id}`)
      .then(res => res.json())
      .then(data => { setItem(data.equipment); setEvents(data.events); })
      .catch(err => console.error('Fetch detail failed:', err));
  }, [id]);

  const handleChangeEvt = e => {
    const { name, value } = e.target;
    setNewEvent(prev => ({ ...prev, [name]: value }));
  };

  const handleAdd = e => {
    e.preventDefault();
    fetch(`${API_URL}/equipment/${id}/event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEvent)
    })
      .then(res => res.json())
      .then(evt => setEvents(prev => [...prev, { id: evt.id, timestamp: new Date().toISOString(), ...newEvent }]))
      .catch(err => console.error('Create event failed:', err));
  };

  if (!item) return <p>Ładowanie...</p>;

  return (
    <div>
      <h2>Szczegóły sprzętu #{item.id}</h2>
      <ul className="list-group mb-4">
        <li className="list-group-item"><strong>Kod kreskowy:</strong><br/><Barcode value={item.barcode} /><div className="mt-2"><code>{item.barcode}</code></div></li>
        <li className="list-group-item"><strong>Nazwa:</strong> {item.name}</li>
        <li className="list-group-item"><strong>Model:</strong> {item.model}</li>
        <li className="list-group-item"><strong>S/N:</strong> {item.serial_number}</li>
        <li className="list-group-item"><strong>Data zakupu:</strong> {item.purchase_date}</li>
        <li className="list-group-item"><strong>Oddział ID:</strong> {item.location_id}</li>
      </ul>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h3>Historia zdarzeń</h3>
        <button className="btn btn-outline-primary" onClick={() => setShowForm(!showForm)}>{showForm ? 'Anuluj' : 'Dodaj wpis'}</button>
      </div>
      {showForm && (
        <form onSubmit={handleAdd} className="mb-4 row g-2">
          <div className="col-auto">
            <input name="event_type" value={newEvent.event_type} onChange={handleChangeEvt} placeholder="Typ zdarzenia" className="form-control" required />
          </div>
          <div className="col-auto flex-fill">
            <input name="notes" value={newEvent.notes} onChange={handleChangeEvt} placeholder="Opis zdarzenia" className="form-control" required />
          </div>
          <div className="col-auto">
            <input name="location_id" value={newEvent.location_id} onChange={handleChangeEvt} placeholder="Oddział ID" className="form-control" required />
          </div>
          <div className="col-auto">
            <button type="submit" className="btn btn-primary">Zapisz wpis</button>
          </div>
        </form>
      )}
      <ul className="list-group">
        {events.map(evt => (
          <li key={evt.id} className="list-group-item">
            {new Date(evt.timestamp).toLocaleString()} – {evt.event_type} ({evt.notes})
>>>>>>> 5e732449e5803058acdaf6378ae439db3bc7b6ed
          </li>
        ))}
      </ul>
    </div>
  );
}

<<<<<<< HEAD
export default App;
=======
function Locations() {
  const [locations, setLocations] = React.useState([]);
  const [equipment, setEquipment] = React.useState([]);

  React.useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/locations`).then(res => res.json()),
      fetch(`${API_URL}/equipment`).then(res => res.json())
    ])
      .then(([locs, eqs]) => { setLocations(locs); setEquipment(eqs); })
      .catch(err => console.error('Fetch locations/equipment failed:', err));
  }, []);

  return (
    <div>
      <h2 className="mb-3">Oddziały i sprzęt</h2>
      {locations.map(loc => (
        <div key={loc.id} className="card mb-3">
          <div className="card-header">{loc.name} (ID: {loc.id})</div>
          <ul className="list-group list-group-flush">
            {equipment
              .filter(item => item.location_id === loc.id)
              .map(item => (
                <li key={item.id} className="list-group-item">
                  {item.name} (ID: {item.id})
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

// To jest do dorobienia takie zeby bylo
function Stats() {
  const data = {
    labels: ['Rzeszów', 'Krosno', 'Jasło',"WSIZ"],
    datasets: [{
      label: 'Ilość sprzętu',
      data: [5, 3, 2,12], // przykładowe ilości na oddziały
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56','#1775ff'],
      borderWidth: 1
    }]
  };

  return (
    <div >
      <h2>Statystyki sprzętu w oddziałach</h2>
      <div style={{ width: '900px', height: '900px' }}>
         <Pie data={data} />
         </div>
     
    </div>
  );
}



>>>>>>> 5e732449e5803058acdaf6378ae439db3bc7b6ed
