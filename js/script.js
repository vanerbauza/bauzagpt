const API_URL = "https://bauzagpt-backend.onrender.com";

async function enviarBusqueda() {
  const query = document.getElementById("input-busqueda").value.trim();
  const plan = "pro";

  if (!query) {
    alert("Escribe algo para buscar");
    return;
  }

  const response = await fetch(`${API_URL}/api/orders/init`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, plan }),
  });

  const data = await response.json();
  console.log("Respuesta del backend:", data);

  if (data.order_id) {
    document.getElementById("resultado").innerHTML = `
      <p>Orden creada correctamente ✅</p>
      <p>ID: <code>${data.order_id}</code></p>
    `;
  } else {
    document.getElementById("resultado").innerHTML = `<p>Error: ${data.error}</p>`;
  }
}
