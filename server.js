const express = require('express');
const app = express();
app.use(express.json());

const API_KEY = process.env.API_KEY || 'ruta-2026';
const cuentas = {
  '104528': { titular: 'Laura Gómez', saldo: 186400, fecha_limite: '2026-11-15', estado: 'al_dia' },
  '220871': { titular: 'Andrés Rincón', saldo: 412950, fecha_limite: '2026-11-05', estado: 'vencida' },
  '337016': { titular: 'Marta Lucía Ospina', saldo: 0, fecha_limite: null, estado: 'pagada' },
  '459903': { titular: 'Carlos Peña', saldo: 98300, fecha_limite: '2026-11-20', estado: 'suspendida' },
};

// 1. Seguridad: toda petición debe traer el header x-api-key
app.use((req, res, next) =>
  req.get('x-api-key') === API_KEY ? next() : res.status(401).json({ error: 'no_autorizado' }));

// 2. Consultar cuenta
app.get('/cuentas/:numero', (req, res) => {
  const c = cuentas[req.params.numero];
  if (!c) return res.status(404).json({ error: 'cuenta_no_encontrada' });
  res.json({ cuenta: req.params.numero, ...c });
});

// 3. Registrar falla
app.post('/fallas', (req, res) => {
  const { cuenta, alcance } = req.body;
  if (!cuentas[cuenta]) return res.status(404).json({ error: 'cuenta_no_encontrada' });
  const radicado = `RF-2026-${Math.floor(10000 + Math.random() * 90000)}`;
  res.status(201).json({ radicado, tiempo_estimado_horas: alcance === 'sector' ? 6 : 3 });
});

app.listen(process.env.PORT || 3000, () => console.log('API de Ruta Energía lista'));