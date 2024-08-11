FROM node:22.6.0

WORKDIR /usr/src/app

COPY package* .

RUN npm ci

COPY . .

RUN chmod +x entrypoint.sh

ENTRYPOINT ["/bin/sh", "entrypoint.sh"]
