FROM node:12-buster-slim

LABEL maintainer="dev@togglecorp.com"

RUN apt update -y \
    && apt install -y  \
        git \
        # node-sass
        python build-essential

WORKDIR /code

COPY ./package.json /code/package.json
RUN yarn install --network-concurrency 3

COPY . /code/
