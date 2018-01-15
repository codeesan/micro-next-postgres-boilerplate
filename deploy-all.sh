#!/bin/sh

DOMAIN=my-app

[ -z "$NOW_TOKEN" ] && echo "Need to set NOW_TOKEN env var" && exit 1

# install

cd api && npm i &
cd ui && npm i &

wait

# test

cd api && npm test || { echo 'api tests failed'; exit 1; }
cd ../ui && npm test || { echo 'ui tests failed'; exit 1; }
cd ..

# now

cd api && now -t $NOW_TOKEN &
cd migrations && now -t $NOW_TOKEN &
cd ui && now -t $NOW_TOKEN &

wait

# now alias

cd api && now alias -t $NOW_TOKEN
cd ../migrations && now alias -t $NOW_TOKEN
cd ../ui && now alias -t $NOW_TOKEN

# rules alias

cd ..
now alias $DOMAIN -r rules.json -t $NOW_TOKEN

# done

echo 'All deployed'
