FROM node:8.10.0

ENV INSTALL_PATH /app
RUN mkdir -p $INSTALL_PATH
RUN mkdir -p $INSTALL_PATH/client

RUN mkdir -p /root/.ssh
RUN chmod 0700 /root/.ssh
RUN ssh-keyscan github.com > /root/.ssh/known_hosts
COPY crypto-library.key /root/.ssh/gitkey
COPY crypto-library.ssh /root/.ssh/config
RUN chmod 600 /root/.ssh/*

WORKDIR $INSTALL_PATH
ARG CRYPTO_LIBRARY_BRANCH
RUN git clone git@github.com:cotitech-io/crypto-library.git --branch $CRYPTO_LIBRARY_BRANCH
RUN rm -fv /root/.ssh/gitkey

WORKDIR $INSTALL_PATH/client
COPY ./client/package.json .
RUN yarn install

WORKDIR $INSTALL_PATH
COPY ./package.json .
RUN yarn install

COPY . .
ARG REACT_APP_HOST
RUN echo "REACT_APP_HOST: $REACT_APP_HOST"
ENV REACT_APP_HOST $REACT_APP_HOST
RUN yarn build
CMD ["node","server.js"]

