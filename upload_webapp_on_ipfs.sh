#!/bin/sh
npm run build && echo "http://localhost:8080/ipfs/$(ipfs add -r -q webapp/dist | tail -n1)"
