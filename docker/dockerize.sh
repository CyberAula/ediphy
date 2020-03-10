#!/bin/bash


yarn
yarn build
rm -r docker/vish/resources
cd docker || exit
cd vish || exit
mkdir resources
cd resources || exit
cp -r ../../../dist ./ediphy

docker-compose build
docker-compose up
