import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ConfirmAttendance from './ConfirmAttendance';
import AdminLogin from './AdminLogin';

function App() {
  return (
    <Router>
      <nav style={{ margin: '20px', textAlign: 'center' }}>
        <Link to="/" style={{ marginRight: '20px' }}>Confirmar asistencia</Link>
        <Link to="/lista">Panel administrador</Link>
      </nav>
      <Routes>
        <Route path="/" element={<ConfirmAttendance />} />
        <Route path="/lista" element={<AdminLogin />} />
      </Routes>
    </Router>
  );
}

export default App;
