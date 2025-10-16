import React, { useState } from 'react';
import axios from 'axios';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar, ResponsiveContainer } from 'recharts';

export default function App() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState([]);

  async function handleQuery(e) {
    e?.preventDefault();
    setLoading(true); setError(null);
    try {
      const resp = await axios.post('/api/query', { text: input, userId: 'user-123', userRole: 'doctor' });
      setRows(resp.data.rows || []);

      // Transform rows to chart-friendly structure: ejemplo si hay risk_score
      const data = (resp.data.rows || []).map((r, idx) => ({ name: r.NAME || r.name || `row${idx+1}`, value: r.RISK_SCORE || r.risk_score || r.score || 0 }));
      setChartData(data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.message || 'Error');
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <header className="max-w-6xl mx-auto bg-white rounded-2xl shadow p-6 mb-6 border-l-8 border-emerald-500">
        <div className="flex items-center gap-4">
          <div className="bg-emerald-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">H</div>
          <div>
            <h1 className="text-2xl font-semibold">Panel Clínico — Salud Mental</h1>
            <p className="text-sm text-slate-600">Herramienta segura para consultas y actualizaciones — interfaz hospitalaria</p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: agente y entrada */}
        <section className="col-span-1 lg:col-span-2 space-y-4">
          <div className="bg-white p-4 rounded-2xl shadow">
            <h2 className="text-lg font-medium mb-2">Agente de consultas (escriba en lenguaje natural)</h2>
            <form onSubmit={handleQuery} className="flex gap-2">
              <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Ej: 'Pacientes con riesgo >= 8 en los últimos 30 días'" className="flex-1 border rounded px-3 py-2" />
              <button type="submit" className="bg-emerald-600 text-white px-4 rounded">{loading ? 'Consultando...' : 'Consultar'}</button>
            </form>
            {error && <div className="mt-2 text-red-600">{error}</div>}
          </div>

          <div className="bg-white p-4 rounded-2xl shadow">
            <h3 className="font-medium mb-2">Resultados (tabla)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-sm text-slate-500">
                    {rows[0] && Object.keys(rows[0]).map(col=> <th key={col} className="p-2 border-b">{col}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i)=> (
                    <tr key={i} className="hover:bg-slate-50">
                      {Object.values(r).map((v, j)=> <td key={j} className="p-2 border-b align-top">{String(v)}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
              {rows.length===0 && <div className="text-slate-500 py-4">No hay resultados aún.</div>}
            </div>
          </div>
        </section>

        {/* Right: panel de graficas y acciones */}
        <aside className="space-y-4">
          <div className="bg-white p-4 rounded-2xl shadow">
            <h3 className="font-medium mb-2">Gráfica de riesgo</h3>
            <div style={{width:'100%',height:240}}>
              <ResponsiveContainer>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow">
            <h3 className="font-medium mb-2">Acciones rápidas</h3>
            <button className="w-full mb-2 bg-emerald-600 text-white py-2 rounded">Nuevo registro de paciente</button>
            <button className="w-full mb-2 border py-2 rounded">Actualizar paciente seleccionado</button>
            <button className="w-full border py-2 rounded">Ver auditoría (admin)</button>
          </div>
        </aside>
      </main>

      <footer className="max-w-6xl mx-auto mt-6 text-sm text-slate-500">© Hospital — Interfaz demo. Asegure control de acceso y logs antes de su uso clínico.</footer>
    </div>
  );
}
