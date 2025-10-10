// Config: apunta a tu backend (Node/Express)
const API_BASE = "https://TU-BACKEND.render.com"; // <-- cámbialo cuando esté listo

const searchForm = document.getElementById('searchForm');
if (searchForm) {
  searchForm.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const q = document.getElementById('q').value.trim();
    const plan = document.getElementById('plan').value;

    if (!q) { alert('Escribe un criterio de búsqueda.'); return; }

    // 1) crea una "orden" preliminar (sin WhatsApp)
    try {
      const res = await fetch(`${API_BASE}/api/orders/init`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ query: q, plan })
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data?.error || 'No se pudo iniciar la orden');

      // 2) redirige al checkout del plan
      //    Tu backend decide el método (BBVA Spin / Nu / Oxxo a cuenta / Bitso / PayPal)
      //    y da instrucciones. Tras pago, volverá a /checkout.html?order=...
      window.location.href = `./checkout.html?order=${encodeURIComponent(data.order_id)}&plan=${encodeURIComponent(plan)}`;
    } catch (e) {
      alert('Error: ' + e.message);
    }
  });
}
