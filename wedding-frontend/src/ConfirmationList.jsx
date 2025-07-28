import { useState } from 'react';

export default function AdminLogin() {
  const [key, setKey] = useState('');
  const [access, setAccess] = useState(false);
  const [confirmations, setConfirmations] = useState([]);
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/auth-admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key }),
      });

      if (res.ok) {
        setAccess(true);
        setMessage('');
        const data = await fetch(`${process.env.REACT_APP_API_URL}/confirmations`).then(r => r.json());
        setConfirmations(data);
      } else {
        setMessage('Clave incorrecta');
      }
    } catch {
      setMessage('Error conectando al servidor');
    }
  };

  if (!access) {
    return (
      <div>
        <h2>Acceso administrador</h2>
        <input
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Clave secreta"
        />
        <button onClick={handleLogin}>Entrar</button>
        {message && <p>{message}</p>}
      </div>
    );
  }

  return (
    <div>
      <h2>Lista de Confirmaciones</h2>
      <ul>
        {confirmations.map((c, i) => (
          <li key={i}>
            Invitado: {c.guestId} - Asistirá: {c.attending ? 'Sí' : 'No'}
          </li>
        ))}
      </ul>
    </div>
  );
}
