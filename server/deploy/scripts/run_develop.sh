#!/bin/bash -x

# /code/deploy/scripts/
BASE_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
# /code/
ROOT_DIR=$(dirname $(dirname "$BASE_DIR"))

. /venv/bin/activate

cd server
pip3 install -r requirements.txt
python $ROOT_DIR/manage.py migrate --no-input
python $ROOT_DIR/manage.py runserver 0.0.0.0:8010
