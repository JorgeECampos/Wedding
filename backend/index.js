const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function connectDB() {
  try {
    await client.connect();
    console.log('✅ Conectado a MongoDB');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
  }
}
connectDB();

const db = () => client.db('weddingDB');
const collection = () => db().collection('confirmations');

// Guardar confirmación
app.post('/confirm', async (req, res) => {
  try {
    const { guestId, attending } = req.body;
    if (!guestId || attending === undefined) {
      return res.status(400).json({ message: 'Datos incompletos' });
    }

    const existing = await collection().findOne({ guestId });
    if (existing && existing.attending !== undefined) {
      return res.status(400).json({ message: 'Ya has confirmado tu asistencia' });
    }

    const filter = { guestId };
    const update = { $set: { attending, timestamp: new Date() } };
    const options = { upsert: true };
    await collection().updateOne(filter, update, options);
    res.json({ message: 'Confirmación guardada' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno' });
  }
});

// Consultar confirmación
app.get('/confirmations', async (req, res) => {
  try {
    const all = await collection().find({}).toArray();
    res.json(all);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error obteniendo confirmaciones' });
  }
});

// Eliminar confirmación
app.delete('/confirm/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const result = await collection().deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No encontrado' });
    }
    res.json({ message: 'Eliminado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error eliminando' });
  }
});



app.listen(port, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${port}`);
});

app.post('/auth-admin', (req, res) => {
  const { key } = req.body;
  if (key === process.env.ADMIN_KEY) {
    return res.json({ access: true });
  }
  return res.status(401).json({ message: 'Clave incorrecta' });
});
