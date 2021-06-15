FROM python:3.9-slim-buster

LABEL maintainer="dev@togglecorp.com"

ENV PYTHONUNBUFFERED=1

RUN apt-get update \
    && apt-get install -y gettext vim git gcc

WORKDIR /code

COPY ./Pipfile ./Pipfile.lock /code/

RUN pip install --upgrade pip pipenv --no-cache-dir \
    && pipenv install --system --deploy

COPY . /code/

CMD ./deploy/scripts/run_prod.sh
