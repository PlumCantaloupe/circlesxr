FROM node:22

WORKDIR /usr/src/app
COPY . .

RUN npm ci


EXPOSE "${SERVER_PORT}"
CMD ["npm", "run", "serve"]
