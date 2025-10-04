#!/usr/bin/env bash
set -euo pipefail

# Configuración
GITHUB_USER="BauzaGPT-AI"
REPO="bauzagpt.com"
GITHUB_TOKEN=""

# Validar token
echo "== 🔑 Verificando token GitHub =="
login=$(curl -s -H "Authorization: token ${GITHUB_TOKEN}" https://api.github.com/user | jq -r '.login // empty')
if [[ "$login" != "$GITHUB_USER" ]]; then
  echo "❌ Token inválido o no corresponde al usuario $GITHUB_USER (obtenido: $login)"
  exit 1
fi
echo "✔ Token válido para $login"

# Build del proyecto
echo "== 🔨 Construyendo proyecto con Vite =="
rm -rf dist
npm run build

# Push a GitHub Pages
echo "== 📤 Subiendo a GitHub =="
git add -A
git commit -m "🚀 Deploy automático $(date +'%Y-%m-%d %H:%M:%S')" || true
git branch -M main
git remote remove origin 2>/dev/null || true
git remote add origin "https://x-access-token:${GITHUB_TOKEN}@github.com/${GITHUB_USER}/${REPO}.git"
git push -f origin main

# Confirmar estado de Pages
echo "== 🔍 Verificando Pages =="
curl -s -H "Authorization: token ${GITHUB_TOKEN}" \
  "https://api.github.com/repos/${GITHUB_USER}/${REPO}/pages" | jq

echo "== ✅ Deploy completado. Espera 1-2 minutos y revisa https://www.bauzagpt.com =="
