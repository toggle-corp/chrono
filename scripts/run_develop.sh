#!/bin/bash -x

# server or client
PROG_TYPE=$1

# /code/scripts/
BASE_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
# /code/
ROOT_DIR=$(dirname "$BASE_DIR")

cd $ROOT_DIR

if [ "${PROG_TYPE}" == "server" ]; then
    . /venv/bin/activate
    cd server
    pip3 install -r requirements.txt
    python manage.py migrate --no-input
    python manage.py runserver 0.0.0.0:8000
fi

if [ "${PROG_TYPE}" == "client" ]; then
    cd client
    yarn add --force node-sass
    yarn start
fi
