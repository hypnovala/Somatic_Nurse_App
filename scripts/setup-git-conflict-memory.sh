#!/usr/bin/env bash
set -euo pipefail

git rev-parse --is-inside-work-tree >/dev/null

git config --local rerere.enabled true
git config --local rerere.autoupdate true
git config --local merge.conflictstyle zdiff3
git config --local merge.ours.driver true

echo "Configured repo-local conflict memory for $(git rev-parse --show-toplevel)"
echo "- rerere.enabled=$(git config --local --get rerere.enabled)"
echo "- rerere.autoupdate=$(git config --local --get rerere.autoupdate)"
echo "- merge.conflictstyle=$(git config --local --get merge.conflictstyle)"
echo "- merge.ours.driver=$(git config --local --get merge.ours.driver)"
