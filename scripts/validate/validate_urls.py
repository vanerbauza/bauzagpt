#!/usr/bin/env python3
import requests, re, time
UA="Mozilla/5.0 (X11; Linux x86_64) BauzaValidator/1.0"
HEADERS={"User-Agent":UA}

def validate(url, timeout=15, check_content=None):
    out={"url":url,"status":None,"final_url":None,"ok":False,"reason":None,"response_time":None,"content_matches":False}
    t0=time.time()
    try:
        r = requests.head(url, headers=HEADERS, timeout=timeout, allow_redirects=True)
        out.update(status=r.status_code, final_url=r.url, response_time=round(time.time()-t0,3))
        if r.status_code>=400 or (check_content and r.status_code==200):
            t0=time.time()
            r = requests.get(url, headers=HEADERS, timeout=timeout, allow_redirects=True)
            out.update(status=r.status_code, final_url=r.url, response_time=round(time.time()-t0,3))
        if check_content and r.status_code==200:
            out["content_matches"]=bool(re.search(check_content.lower(), r.text.lower()))
        out["ok"]=(200<=out["status"]<400) and (not check_content or out["content_matches"])
    except Exception as e:
        out["reason"]=str(e)
    return out
