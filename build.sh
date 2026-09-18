#!/bin/sh
# Rebuild index.html from the pieces in src/, then run the test suite.
# Usage:  sh build.sh
set -e
D="$(cd "$(dirname "$0")" && pwd)"
cat "$D/src/01-head.html" \
    "$D/src/02-data-org-chem.js" \
    "$D/src/03-data-cell-gene.js" \
    "$D/src/04-data-tissue-skin.js" \
    "$D/src/05-data-bone-joint.js" \
    "$D/src/06-data-muscle.js" \
    "$D/src/07-data-nerve-sense.js" \
    "$D/src/08-data-diagrams.js" \
    "$D/src/08b-data-plates.js" \
    "$D/src/08c-data-match.js" \
    "$D/src/09-engine.js" \
    "$D/src/10-tail.html" > "$D/index.html"
echo "built index.html: $(wc -c < "$D/index.html") bytes"
node "$D/src/test.js"
