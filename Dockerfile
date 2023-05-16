FROM node:18.16.0-alpine3.17

WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm install
ENV NODE_ENV production
RUN npm run build
RUN rm -rf /usr/src/app/server
CMD ["npm", "run", "server"]
