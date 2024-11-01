const output = document.getElementById("output");
const select = document.getElementById("selectorMoneda");
const ctx = document.getElementById("myChart").getContext("2d");
let dolar, euro, bitcoin;
let chart;

async function getMonedas() {
  const res = await fetch("https://mindicador.cl/api/");
  const monedas = await res.json();
  return monedas;
}

async function renderMonedas() {
  const monedas = await getMonedas();
  dolar = monedas.dolar.valor;
  euro = monedas.euro.valor;
  bitcoin = monedas.bitcoin.valor;
}

renderMonedas();

async function getHistoricalData(currency) {
  const res = await fetch(`https://mindicador.cl/api/${currency}`);
  const data = await res.json();
  return data.serie.slice(-10);
}

async function renderChart(data) {
  const labels = data.map((entry) => entry.fecha.slice(0, 10));
  const prices = data.map((entry) => entry.valor);

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: `Precio en ${
            select.value.charAt(0).toUpperCase() + select.value.slice(1)
          }`,
          data: prices,
          borderColor: "rgba(75, 192, 192, 1)",
          fill: false,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: false,
        },
      },
    },
  });
}

async function conversor() {
  const inputMoneda = parseFloat(document.getElementById("inputMoneda").value);
  let cambio;

  if (select.value === "dolar") {
    cambio = inputMoneda / dolar;
    output.innerHTML = `${cambio.toFixed(2)} $`;
    await renderChart(await getHistoricalData("dolar"));
  } else if (select.value === "euro") {
    cambio = inputMoneda / euro;
    output.innerHTML = `${cambio.toFixed(2)} €`;
    await renderChart(await getHistoricalData("euro"));
  } else if (select.value === "bitcoin") {
    cambio = inputMoneda / bitcoin;
    output.innerHTML = `${cambio.toFixed(8)} BTC`;
    await renderChart(await getHistoricalData("bitcoin"));
  } else {
    output.innerHTML = "Seleccione una moneda válida.";
  }
}

document.getElementById("btnBuscar").addEventListener("click", conversor);
