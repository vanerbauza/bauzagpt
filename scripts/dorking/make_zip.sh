#!/bin/bash
set -e
OUTDIR="$1"
if [ -z "$OUTDIR" ]; then
  echo "Usage: $0 <outputs-dir>"
  exit 1
fi
ts=$(date +%Y%m%d_%H%M%S)
zipname="dork_results_${ts}.zip"
cd "$OUTDIR"
zip -r "../$zipname" .
echo "ZIP creado: ../$zipname"
