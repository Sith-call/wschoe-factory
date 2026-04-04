#!/bin/bash
# Harness — Launch API + GUI servers
set -e

cd "$(dirname "$0")"

echo "Building..."
pnpm build

echo ""
echo "Starting Harness..."
echo "  API:  http://localhost:3777"
echo "  GUI:  http://localhost:3778"
echo ""

# Run both in parallel
pnpm dev
