#!/usr/bin/env python3
import os, zipfile
from pathlib import Path

def make_zip(folder_path: str) -> str:
    folder = Path(folder_path)
    zip_name = folder.parent / f"{folder.name}.zip"
    with zipfile.ZipFile(zip_name, "w", zipfile.ZIP_DEFLATED) as z:
        for root, _, files in os.walk(folder):
            for f in files:
                p = Path(root) / f
                arc = p.relative_to(folder)
                z.write(p, arcname=str(arc))
    return str(zip_name)
