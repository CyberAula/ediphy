#!/bin/bash
yarn
yarn build
rm -r docker/vish/resources
cd docker || exit
docker-compose down -t 10
cd vish || exit
mkdir resources
cd resources || exit
cp -r ../../../dist ./ediphy
docker-compose up
