FROM node:18.7.0

WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm install
#RUN npm ci --only=production
# RUN npm install
ENV NODE_ENV production
RUN rm -rf /usr/src/app/server
CMD ["npm", "run", "server"]
