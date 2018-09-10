#!/bin/bash -x

# /code/scripts/
BASE_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
# /code/
ROOT_DIR=$(dirname "$BASE_DIR")

cd $ROOT_DIR

yarn install
yarn add --force node-sass
yarn start
