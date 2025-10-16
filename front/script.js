// Datos mock (luego se reemplazan por fetch a backend)
const ingresos = [
  { id: 1, diagnostico: 'F32', fecha: '2025-01-01', hospital: 'Hospital A' },
  { id: 2, diagnostico: 'F20', fecha: '2025-02-15', hospital: 'Hospital B' },
  { id: 3, diagnostico: 'F32', fecha: '2025-03-10', hospital: 'Hospital C' },
  { id: 4, diagnostico: 'F10', fecha: '2025-04-05', hospital: 'Hospital A' }
];

// Render inicial
renderTabla(ingresos);
renderChart(ingresos);

function renderTabla(data) {
  const tbody = document.querySelector("#tablaIngresos tbody");
  tbody.innerHTML = "";
  data.forEach(r => {
    const row = `<tr>
      <td>${r.id}</td>
      <td>${r.diagnostico}</td>
      <td>${r.fecha}</td>
      <td>${r.hospital}</td>
    </tr>`;
    tbody.innerHTML += row;
  });
}

function renderChart(data) {
  const ctx = document.getElementById('chartDiagnosticos').getContext('2d');
  const counts = {};
  data.forEach(r => {
    counts[r.diagnostico] = (counts[r.diagnostico] || 0) + 1;
  });

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(counts),
      datasets: [{
        label: 'Ingresos',
        data: Object.values(counts),
        backgroundColor: 'rgba(75, 192, 192, 0.6)'
      }]
    }
  });
}

function aplicarFiltros() {
  const diag = document.getElementById("diagnostico").value.trim();
  const inicio = document.getElementById("fechaInicio").value;
  const fin = document.getElementById("fechaFin").value;

  let filtrados = ingresos;

  if (diag) {
    filtrados = filtrados.filter(r => r.diagnostico.includes(diag));
  }
  if (inicio) {
    filtrados = filtrados.filter(r => r.fecha >= inicio);
  }
  if (fin) {
    filtrados = filtrados.filter(r => r.fecha <= fin);
  }

  renderTabla(filtrados);
  renderChart(filtrados);
}
