FROM devtc/ubuntu-django-react:0.1

MAINTAINER togglecorp info@togglecorp.com

RUN mkdir /code/server -p && mkdir /code/client -p
WORKDIR /code

RUN pip3 install virtualenv
RUN virtualenv /venv

COPY server/requirements.txt /code/server/
RUN . /venv/bin/activate && pip install -r server/requirements.txt

COPY client/package.json /code/client/
RUN cd client && yarn install

COPY . /code/
