FROM node:18.7.0-alpine3.15

WORKDIR /usr/src/app
COPY . /usr/src/app
#RUN npm ci --only=production
# RUN npm install
ENV NODE_ENV production
CMD ["npm", "run", "prod"]