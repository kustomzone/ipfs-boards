#!/bin/sh
gulp && echo "http://localhost:8080/ipfs/$(ipfs add -r -q webapp/dist | tail -n1)"
