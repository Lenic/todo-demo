#!/bin/bash

echo "remove the node_modules directory from all projects"
find . -name "node_modules" -type d -exec rm -rf {} +

echo "remove the lock file"
rm -f pnpm-lock.yaml

echo "clear pnpm cache"
pnpm store prune
