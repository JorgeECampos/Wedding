import { useState } from 'react';

export default function ConfirmAttendance() {
  const [guestId, setGuestId] = useState('');
  const [attending, setAttending] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!guestId || attending === null) {
      setError(true);
      setMessage('Por favor completa todos los campos.');
      return;
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guestId, attending }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('✅ ¡Confirmación enviada con éxito!');
        setError(false);
        setGuestId('');
        setAttending(null);
      } else {
        setMessage(data.message || '❌ Error enviando confirmación');
        setError(true);
      }
    } catch {
      setMessage('❌ Error conectando con el servidor');
      setError(true);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ maxWidth: '400px', width: '100%' }}>
        <h4 className="mb-3 text-center">Confirmar Asistencia</h4>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nombre del invitado</label>
            <input
              type="text"
              className="form-control"
              value={guestId}
              onChange={(e) => setGuestId(e.target.value)}
              placeholder="Ej. Jorge Pérez"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">¿Asistirás?</label>
            <div className="d-flex gap-2">
              <button
                type="button"
                className={`btn ${attending === true ? 'btn-success' : 'btn-outline-success'}`}
                onClick={() => setAttending(true)}
              >
                Sí
              </button>
              <button
                type="button"
                className={`btn ${attending === false ? 'btn-danger' : 'btn-outline-danger'}`}
                onClick={() => setAttending(false)}
              >
                No
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-100">Enviar Confirmación</button>
        </form>

        {message && (
          <div className={`alert mt-3 ${error ? 'alert-danger' : 'alert-success'}`} role="alert">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
