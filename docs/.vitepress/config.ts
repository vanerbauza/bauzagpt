import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'BAUZA GPT — OSINT',
  description: 'Docs & blog de Bauza',
  base: '/',               // Con dominio propio (www.bauzagpt.com), base es '/'
  themeConfig: {
    nav: [{ text: 'Inicio', link: '/' }],
    sidebar: [{ text: 'Guía', items: [{ text: 'Empezar', link: '/' }] }]
  }
})
