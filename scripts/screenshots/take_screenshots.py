#!/usr/bin/env python3
import os, re
from datetime import datetime
from urllib.parse import urlparse

OUTDIR=os.getenv("OUT_SCREENS","outputs/screens")

def _slug(s): return re.sub(r'[^a-z0-9]+','-', s.lower()).strip('-')

def take(url):
    try:
        import asyncio
        from playwright.async_api import async_playwright
    except Exception:
        return None  # sin playwright: sin screenshot
    async def _run():
        os.makedirs(OUTDIR, exist_ok=True)
        async with async_playwright() as p:
            browser=await p.chromium.launch()
            page=await browser.new_page(viewport={"width":1366,"height":768})
            await page.goto(url, timeout=25000)
            ts=datetime.utcnow().strftime("%Y%m%d_%H%M%S")
            parsed=urlparse(url)
            name=f"{ts}_{_slug(parsed.netloc+parsed.path)}.png"
            path=os.path.join(OUTDIR,name)
            await page.screenshot(path=path, full_page=True)
            await browser.close()
            return path
    import asyncio
    return asyncio.run(_run())
