#!/usr/bin/env python3
import os, time, requests
from urllib.parse import urlencode

UA = "Mozilla/5.0 (X11; Linux x86_64) BauzaBot/1.0"
HEADERS = {"User-Agent": UA}

def search_serpapi(query, num=10):
    key = os.getenv("SERPAPI_KEY")
    if not key: raise RuntimeError("SERPAPI_KEY missing")
    url = "https://serpapi.com/search.json?" + urlencode({"engine":"google","q":query,"num":num,"api_key":key})
    r = requests.get(url, timeout=20)
    r.raise_for_status()
    data = r.json()
    out=[]
    for it in data.get("organic_results", [])[:num]:
        out.append({"title": it.get("title"), "url": it.get("link"), "snippet": it.get("snippet","")})
    return out

def search_bing(query, num=10):
    key = os.getenv("BING_API_KEY")
    if not key: raise RuntimeError("BING_API_KEY missing")
    url = "https://api.bing.microsoft.com/v7.0/search"
    r = requests.get(url, headers={"Ocp-Apim-Subscription-Key": key, **HEADERS}, params={"q":query,"count":num}, timeout=20)
    r.raise_for_status()
    data = r.json()
    out=[]
    for it in data.get("webPages",{}).get("value", [])[:num]:
        out.append({"title": it.get("name"), "url": it.get("url"), "snippet": it.get("snippet","")})
    return out

def search_duckduckgo(query, num=10):
    url = "https://lite.duckduckgo.com/lite/"
    r = requests.get(url, params={"q":query}, headers=HEADERS, timeout=20)
    r.raise_for_status()
    from bs4 import BeautifulSoup
    soup = BeautifulSoup(r.text, "html.parser")
    out=[]
    for a in soup.select("a"):
        href=a.get("href")
        if not href or href.startswith("/"): continue
        out.append({"title": a.get_text().strip(), "url": href, "snippet": ""})
        if len(out)>=num: break
    time.sleep(1)
    return out

def search(query, provider="serpapi", num=10):
    # prioridad: SERPAPI > BING > DDG
    if provider=="serpapi":
        try: return search_serpapi(query,num)
        except Exception as e: print("[search] SerpAPI falló:",e)
        provider="bing" if os.getenv("BING_API_KEY") else "duckduckgo"
    if provider=="bing":
        try: return search_bing(query,num)
        except Exception as e: print("[search] Bing falló:",e)
    return search_duckduckgo(query,num)
