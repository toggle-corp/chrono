FROM python:3.7-slim-buster

LABEL maintainer="dev@togglecorp.com"

ENV PYTHONUNBUFFERED=1

# For i18n_patterns translation need to install gettext
RUN apt-get update \
    && apt-get install -y \
        gettext vim git gcc


WORKDIR /code

COPY ./requirements.txt /code/requirements.txt

RUN pip install --upgrade pip \
    && pip install -r requirements.txt

COPY . /code/

CMD ./deploy/scripts/run_prod.sh
