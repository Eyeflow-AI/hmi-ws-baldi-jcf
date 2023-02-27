FROM node:18.7.0-alpine3.15

WORKDIR /usr/src/app
COPY ./dist-server /usr/src/app
RUN npm ci --only=production
ENV NODE_ENV production
RUN apk add dumb-init
CMD ["dumb-init", "node", "bin/www"]