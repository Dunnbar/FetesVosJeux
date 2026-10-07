#!/bin/bash
# Contrôle que les « Media URL » du CSV sont bien téléchargeables, comme le
# fera Pinterest à l'import : requête anonyme, sans cookie, redirections suivies.
#
# À lancer APRÈS avoir déployé public/pins/. Tant que ce n'est pas fait, les
# URLs renvoient un 404 en text/html et l'import échoue ligne par ligne sur
# « URL de média manquante ».
#
# Usage : scripts/verify-pins.sh [chemin/vers/pins.csv]
#
# Le séparateur de curl est « | » et non l'espace : content_type vaut
# « image/jpeg; charset=utf-8 », dont l'espace décalerait les champs — un
# contrôle naïf validerait alors une page d'erreur HTML comme une image.
set -uo pipefail
CSV="${1:-pins/pins.csv}"
[ -f "$CSV" ] || { echo "CSV introuvable : $CSV" >&2; exit 1; }

ok=0; ko=0
printf "%-6s %-12s %9s  %s\n" "CODE" "TYPE" "TAILLE" "URL"
# Colonne 2 = Media URL. python3 pour un parsing CSV correct : les
# descriptions contiennent des virgules et des guillemets échappés.
while IFS= read -r u; do
  [ -z "$u" ] && continue
  IFS='|' read -r code type size <<< "$(curl -s -o /dev/null -L -m 30 \
    -w '%{http_code}|%{content_type}|%{size_download}' "$u")"
  type="${type%%;*}"; type="${type## }"
  if [ "$code" = "200" ] && [[ "$type" == image/* ]] && [ "${size:-0}" -gt 10000 ] 2>/dev/null; then
    ok=$((ok+1)); mark=""
  else
    ko=$((ko+1)); mark="  <-- PROBLÈME"
  fi
  printf "%-6s %-12s %9s  %s%s\n" "$code" "$type" "$size" "$u" "$mark"
done < <(python3 -c "
import csv, io, sys
for r in csv.DictReader(io.open(sys.argv[1], encoding='utf-8-sig', newline='')):
    print((r.get('Media URL') or '').strip())
" "$CSV")

echo ""
echo "accessibles : $ok / $((ok+ko))"
[ "$ko" -eq 0 ] || exit 1
