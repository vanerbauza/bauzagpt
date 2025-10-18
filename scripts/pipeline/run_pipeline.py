#!/usr/bin/env python3
import argparse, os, json, csv
from datetime import datetime
try:
    from dotenv import load_dotenv
    load_dotenv()
except Exception:
    pass

from scripts.search.search_providers import search
from scripts.validate.validate_urls import validate
from scripts.screenshots.take_screenshots import take

BASE_OUT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..","..","outputs"))

def save_json(p,d):
    with open(p,"w",encoding="utf-8") as f: json.dump(d,f,indent=2,ensure_ascii=False)

def save_csv(p,rows):
    if not rows: return
    keys=rows[0].keys()
    with open(p,"w",newline="",encoding="utf-8") as f:
        w=csv.DictWriter(f,fieldnames=keys); w.writeheader(); w.writerows(rows)

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("--dork", required=True)
    ap.add_argument("--provider", default="serpapi")  # serpapi | bing | duckduckgo
    ap.add_argument("--max", type=int, default=20)
    ap.add_argument("--check", default=None, help="regex para validar contenido (opcional)")
    args=ap.parse_args()

    ts=datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    outdir=os.path.join(BASE_OUT, ts)
    for sub in ("json","csv","reports","screens"): os.makedirs(os.path.join(outdir,sub), exist_ok=True)

    print("[*] Buscando:", args.dork, "| provider:", args.provider)
    results=search(args.dork, provider=args.provider, num=args.max)

    final=[]
    for r in results:
        v=validate(r["url"], check_content=args.check)
        v.update(title=r.get("title"), snippet=r.get("snippet"))
        if v.get("ok"):
            try: v["screenshot"]=take(v["final_url"] or v["url"])
            except Exception as e: v["screenshot_error"]=str(e)
        final.append(v)

    jp=os.path.join(outdir,"json",f"result_{ts}.json")
    cp=os.path.join(outdir,"csv", f"result_{ts}.csv")
    save_json(jp,final); save_csv(cp,final)
    print("[+] Guardados:", jp, "|", cp)
    print("[*] Listo. Carpeta:", outdir)

if __name__=="__main__":
    main()
