#!/usr/bin/env python3
import os, json, re
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# carga .env (keys de SERPAPI/BING y OUT_SCREENS si existen)
load_dotenv()

from scripts.search.search_providers import search
from scripts.validate.validate_urls import validate
from scripts.screenshots.take_screenshots import take
from scripts.utils.zip_outputs import make_zip

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
OUT_BASE = os.path.join(BASE_DIR, "outputs")
os.makedirs(OUT_BASE, exist_ok=True)

app = Flask(__name__)
CORS(app)

def _safe_int(v, default):
    try:
        v = int(v)
        return max(1, min(200, v))
    except:
        return default

@app.get("/api/health")
def health():
    return jsonify({"ok": True, "time": datetime.utcnow().isoformat()})

@app.get("/api/last")
def last_run():
    """Devuelve el último lote (si existe) y paths relativos."""
    if not os.path.isdir(OUT_BASE):
        return jsonify({"ok": True, "last": None})
    # busca carpeta con nombre tipo YYYYmmdd_HHMMSS
    dirs = sorted([d for d in os.listdir(OUT_BASE) if re.match(r"^\d{8}_\d{6}$", d)], reverse=True)
    if not dirs:
        return jsonify({"ok": True, "last": None})
    last = dirs[0]
    return jsonify({"ok": True, "last": last, "folder": f"outputs/{last}"})

@app.post("/api/run")
def run_pipeline():
    """
    Body JSON:
    {
      "dork": "site:github.com bauzagpt",
      "provider": "serpapi" | "bing" | "duckduckgo",
      "max": 25,
      "check": "regex opcional"
    }
    """
    data = request.get_json(force=True, silent=True) or {}
    dork = data.get("dork")
    if not dork or not isinstance(dork, str) or len(dork.strip()) < 2:
        return jsonify({"ok": False, "error": "dork inválido"}), 400

    provider = (data.get("provider") or "serpapi").lower().strip()
    maxres = _safe_int(data.get("max", 20), 20)
    check = data.get("check")

    ts = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    outdir = os.path.join(OUT_BASE, ts)
    for sub in ("json","csv","reports","screens"):
        os.makedirs(os.path.join(outdir, sub), exist_ok=True)

    # 1) Search
    try:
        results = search(dork, provider=provider, num=maxres)
    except Exception as e:
        # si SERPAPI/BING fallan, deja caer a DDG
        try:
            results = search(dork, provider="duckduckgo", num=maxres)
            provider = "duckduckgo"
        except Exception as e2:
            return jsonify({"ok": False, "error": f"search failed: {e2}"}), 500

    # 2) Validate + optional screenshot
    final = []
    for r in results:
        url = r.get("url")
        if not url: 
            continue
        v = validate(url, check_content=check)
        v.update(title=r.get("title"), snippet=r.get("snippet"))
        # screenshot best-effort
        if v.get("ok"):
            try:
                spath = take(v.get("final_url") or url)
                if spath: v["screenshot"] = os.path.relpath(spath, BASE_DIR)
            except Exception as se:
                v["screenshot_error"] = str(se)
        final.append(v)

    # 3) Save JSON/CSV y crear ZIP del lote
    import csv
    json_path = os.path.join(outdir, "json", f"result_{ts}.json")
    csv_path  = os.path.join(outdir, "csv",  f"result_{ts}.csv")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(final, f, indent=2, ensure_ascii=False)
    if final:
        with open(csv_path, "w", newline="", encoding="utf-8") as f:
            w = csv.DictWriter(f, fieldnames=sorted(final[0].keys()))
            w.writeheader(); w.writerows(final)
    zip_path = make_zip(outdir)

    # 4) Respuesta
    rel_folder = os.path.relpath(outdir, BASE_DIR)
    rel_zip = os.path.relpath(zip_path, BASE_DIR)
    return jsonify({
        "ok": True,
        "dork": dork,
        "provider_used": provider,
        "count": len(final),
        "out_folder": rel_folder,
        "zip": rel_zip,
        "results": final[:50]  # limitar payload
    })
    
if __name__ == "__main__":
    # dev server (para pruebas locales)
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", "8000")), debug=True)
