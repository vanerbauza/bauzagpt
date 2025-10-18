#!/usr/bin/env python3
"""
dork_runner.py
Uso: python dork_runner.py --dork "site:example.com password" --outdir ../outputs
Descripción: Ejecuta una búsqueda sencilla en DuckDuckGo (HTML) y extrae resultados,
guarda JSON y CSV y genera un PDF resumen.
NOTA: Esta implementación es simple y para uso ético/legal solo. Respeta robots.txt y términos.
"""
import argparse
import requests
from bs4 import BeautifulSoup
import json, os, csv
import pandas as pd
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from datetime import datetime

HEADERS = {"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) BauzaBot/1.0"}

def duckduck_search(query, max_results=20):
    url = "https://html.duckduckgo.com/html/"
    params = {"q": query}
    r = requests.post(url, data=params, headers=HEADERS, timeout=15)
    r.raise_for_status()
    soup = BeautifulSoup(r.text, "html.parser")
    results = []
    for a in soup.select("a.result__a")[:max_results]:
        title = a.get_text().strip()
        href = a.get("href")
        snippet_el = a.find_parent().select_one(".result__snippet")
        snippet = snippet_el.get_text().strip() if snippet_el else ""
        results.append({"title": title, "url": href, "snippet": snippet})
    return results

def save_json(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def save_csv(path, data):
    if not data:
        return
    keys = data[0].keys()
    with open(path, "w", newline='', encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=keys)
        writer.writeheader()
        writer.writerows(data)

def make_pdf(path, title, rows):
    c = canvas.Canvas(path, pagesize=letter)
    w, h = letter
    c.setFont("Helvetica-Bold", 14)
    c.drawString(40, h-50, title)
    c.setFont("Helvetica", 10)
    c.drawString(40, h-70, f"Fecha: {datetime.now().isoformat()}")
    y = h-100
    for i, r in enumerate(rows, 1):
        text = f"{i}. {r.get('title','')} — {r.get('url','')}"
        c.drawString(40, y, text[:120])
        y -= 14
        if y < 60:
            c.showPage()
            y = h-60
    c.save()

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--dork", required=True, help="Query / dork a ejecutar")
    p.add_argument("--outdir", default="../outputs", help="Carpeta de salida relativa a este script")
    p.add_argument("--max", type=int, default=20, help="Máx resultados")
    args = p.parse_args()

    outdir = os.path.abspath(args.outdir)
    os.makedirs(outdir, exist_ok=True)
    json_path = os.path.join(outdir, "json", f"dork_{int(datetime.now().timestamp())}.json")
    csv_path = os.path.join(outdir, "csv", f"dork_{int(datetime.now().timestamp())}.csv")
    pdf_path = os.path.join(outdir, "reports", f"dork_{int(datetime.now().timestamp())}.pdf")

    # ensure subdirs exist
    for sub in ("json","csv","reports"):
        os.makedirs(os.path.join(outdir, sub), exist_ok=True)

    print("[*] Ejecutando dork:", args.dork)
    rows = duckduck_search(args.dork, max_results=args.max)
    print(f"[+] {len(rows)} resultados obtenidos")

    save_json(json_path, rows)
    save_csv(csv_path, rows)
    make_pdf(pdf_path, f"Reporte Dork: {args.dork}", rows)

    print("[*] Guardado JSON:", json_path)
    print("[*] Guardado CSV:", csv_path)
    print("[*] Guardado PDF:", pdf_path)

if __name__ == "__main__":
    main()
