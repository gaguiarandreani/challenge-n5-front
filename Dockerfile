FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --force

COPY . .

COPY .env .env

ARG REACT_APP_API='http://localhost:5001'
ENV REACT_APP_API='http://localhost:5001'

RUN sed -i -e 's|REACT_APP_API=.*|REACT_APP_API='"$REACT_APP_API"'|' .env

RUN npm run build

ENV NODE_ENV production

EXPOSE 3000

CMD [ "npx", "serve", "build" ]