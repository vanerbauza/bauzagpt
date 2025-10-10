---
layout: home
title: BauzaGPT
hero:
  name: BauzaGPT
  text: NO BUSQUES LO QUE NO QUIERES ENCONTRAR
  tagline: Búsquedas OSINT legales con entrega segura (PDF/ZIP).
  actions:
    - theme: brand
      text: Búsqueda Sencilla
      link: /#busqueda
    - theme: alt
      text: Búsqueda Premium (20 MXN)
      link: /#premium
---

<div id="busqueda"></div>

<div style="margin: 24px 0; padding: 24px; border-radius: 14px; background: rgba(255,255,255,.05);">
  <p><strong>Target de Búsqueda</strong></p>
  <input id="target" placeholder="ejemplo.com, empresa, email..." style="padding:12px;border-radius:10px;width:min(560px,100%);">
  <div style="margin-top:12px; display:flex; gap:10px; flex-wrap: wrap;">
    <button id="btn-basic" style="padding:12px 16px;border-radius:10px;border:0;cursor:pointer;">Búsqueda Sencilla</button>
    <button id="btn-pro" style="padding:12px 16px;border-radius:10px;border:0;cursor:pointer;background:#cc2cf0;color:#fff;">Búsqueda Premium (20 MXN)</button>
  </div>
  <small>La búsqueda Premium generará un informe PDF descargable cuando confirmes tu pago.</small>
</div>

<script setup>
const API = 'https://TU-API.onrender.com' // cámbialo luego
const q = s => document.querySelector(s)

window.addEventListener('DOMContentLoaded', () => {
  q('#btn-basic')?.addEventListener('click', async () => {
    const target = q('#target').value.trim()
    if (!target) return alert('Escribe un target')
    console.log('Básica ->', target)
  })
  q('#btn-pro')?.addEventListener('click', async () => {
    const target = q('#target').value.trim()
    if (!target) return alert('Escribe un target')
    console.log('Premium ->', target)
  })
})
</script>
