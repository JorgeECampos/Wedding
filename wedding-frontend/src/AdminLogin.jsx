import { useState, useRef } from 'react';

export default function AdminLogin() {
  const [key, setKey] = useState('');
  const [access, setAccess] = useState(false);
  const [confirmations, setConfirmations] = useState([]);
  const [message, setMessage] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const modalRef = useRef(null);

  const API_URL = process.env.REACT_APP_API_URL;

  const handleLogin = async () => {
    try {
      const res = await fetch(`${API_URL}/auth-admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key }),
      });

      if (res.ok) {
        setAccess(true);
        setMessage('');
        await fetchConfirmations();
      } else {
        setMessage('Clave incorrecta');
      }
    } catch {
      setMessage('Error conectando al servidor');
    }
  };

  const fetchConfirmations = async () => {
    const data = await fetch(`${API_URL}/confirmations`).then(r => r.json());
    setConfirmations(data);
  };

  const confirmDelete = (id) => {
    setSelectedId(id);
    const modal = new window.bootstrap.Modal(modalRef.current);
    modal.show();
  };

  const handleConfirmDelete = async () => {
    if (!selectedId) return;

    const res = await fetch(`${API_URL}/confirm/${selectedId}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      fetchConfirmations();
    } else {
      alert('Error eliminando al invitado');
    }

    const modal = window.bootstrap.Modal.getInstance(modalRef.current);
    modal.hide();
    setSelectedId(null);
  };

  const exportCSV = () => {
    const csvHeader = 'Invitado,Asistirá\n';
    const csvRows = confirmations.map(c =>
      `${c.guestId},${c.attending ? 'Sí' : 'No'}`
    );
    const csvData = csvHeader + csvRows.join('\n');
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'confirmaciones.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (!access) {
    return (
      <div className="container mt-5">
        <h2>Acceso administrador</h2>
        <input
          type="password"
          className="form-control my-2"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Clave secreta"
        />
        <button className="btn btn-primary" onClick={handleLogin}>Entrar</button>
        {message && <p className="text-danger mt-2">{message}</p>}
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2>Lista de Confirmaciones</h2>
      <button className="btn btn-success mb-3" onClick={exportCSV}>Exportar CSV</button>
      <ul className="list-group">
        {confirmations.map((c, i) => (
          <li key={i} className="list-group-item d-flex justify-content-between align-items-center">
            <span>
              Invitado: <strong>{c.guestId}</strong> - Asistirá: {c.attending ? 'Sí' : 'No'}
            </span>
            <button className="btn btn-danger btn-sm" onClick={() => confirmDelete(c._id)}>
              <i className="bi bi-trash"></i>
            </button>
          </li>
        ))}
      </ul>

      {/* Modal Bootstrap */}
      <div className="modal fade" tabIndex="-1" ref={modalRef}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Confirmar eliminación</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>
            <div className="modal-body">
              <p>¿Estás seguro de que deseas eliminar este invitado?</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button type="button" className="btn btn-danger" onClick={handleConfirmDelete}>Eliminar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
