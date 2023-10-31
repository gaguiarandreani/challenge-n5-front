FROM node:18-alpine

WORKDIR /app

COPY .env .env

RUN sed -i "s|REACT_APP_API=.*|REACT_APP_API=http://localhost:5001|" .env

COPY . .

RUN npm ci --force

RUN npm run build

ENV NODE_ENV production
#ENV REACT_APP_API=http://localhost:5001

EXPOSE 3000

CMD [ "npx", "serve", "build" ]