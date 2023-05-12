FROM node:18.7.0-alpine3.15




WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm install
ENV NODE_ENV production
RUN npm run build
CMD ["npm", "run", "server"]