#! /bin/bash

echo "************************************************************";
echo "RC Branch=${CHRONO_RC_BRANCH}, Branch=${TRAVIS_BRANCH}, Pull request=${TRAVIS_PULL_REQUEST}"
echo "************************************************************";

if ! [ "${TRAVIS_PULL_REQUEST}" == "false" ]; then
    echo 'Pull Request Build... exiting....'
    exit
fi

if ! [ "${TRAVIS_BRANCH}" == "${CHRONO_RC_BRANCH}" ]; then
    echo 'Non RC Branch... exiting....'
    exit
fi

BASE_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR=$(dirname "$BASE_DIR")
CLIENT_DIR=${ROOT_DIR}/client

echo "::::: Configuring AWS :::::"
aws configure set aws_access_key_id ${AWS_ACCESS_KEY_ID}
aws configure set aws_secret_access_key ${AWS_SECRET_ACCESS_KEY}
aws configure set default.region ${DEPLOYMENT_REGION}
aws configure set metadata_service_timeout 1200
aws configure set metadata_service_num_attempts 3

printf "\n\n::::::::: Uploading Image to Docker Hub [Server] :::::::::::\n"
set -xe;
docker-compose -f production.yml build
docker-compose -f production.yml push
set +xe;

printf "\n\n::::::::: Deploying React to S3 [Client] :::::::::::\n"

    echo "::::::  >> Generating New Reacts Builds [Locally]"
    set -e;
    python -c "import fcntl; fcntl.fcntl(1, fcntl.F_SETFL, 0)"
    echo "
    REACT_APP_API_HTTPS=${CHRONO_HTTPS}
    REACT_APP_API_END=${CHRONO_API_END}
    " > ${CLIENT_DIR}/.env
    docker run -t -v ${CLIENT_DIR}/build:/code/client/build --env-file=${CLIENT_DIR}/.env \
        devtc/chrono:latest \
        bash -c 'cd /code/client && yarn install && CI=false yarn build'
    set +e;
    rm ${CLIENT_DIR}/.env

    echo "::::::  >> Removing Previous Builds Files [js, css] From S3 Bucket [$CHRONO_S3_BUCKET]"
    aws s3 rm s3://$CHRONO_S3_BUCKET/static/js --recursive
    aws s3 rm s3://$CHRONO_S3_BUCKET/static/css --recursive
    echo "::::::  >> Uploading New Builds Files To S3 Bucket [$CHRONO_S3_BUCKET]"
    aws s3 sync ${CLIENT_DIR}/build/ s3://$CHRONO_S3_BUCKET
    echo "::::::  >> Settings Configs for Bucket [$CHRONO_S3_BUCKET]"
    # disable index.html cache
    aws s3 cp ${CLIENT_DIR}/build/index.html s3://$CHRONO_S3_BUCKET/index.html \
        --metadata-directive REPLACE --cache-control max-age=0,no-cache,no-store,must-revalidate --content-type text/html --acl public-read
    # disable service-worker.js cache
    aws s3 cp ${CLIENT_DIR}/build/service-worker.js s3://$CHRONO_S3_BUCKET/service-worker.js \
        --metadata-directive REPLACE --cache-control max-age=0,no-cache,no-store,must-revalidate --content-type application/javascript --acl public-read
    # S3 website settings config
    aws s3 website s3://$CHRONO_S3_BUCKET --index-document index.html --error-document index.html
