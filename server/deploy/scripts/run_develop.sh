#!/bin/bash -x

# /code/deploy/scripts/
BASE_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
# /code/
ROOT_DIR=$(dirname $(dirname "$BASE_DIR"))

cd server
python $ROOT_DIR/manage.py migrate --no-input
python $ROOT_DIR/manage.py runserver 0.0.0.0:8010
