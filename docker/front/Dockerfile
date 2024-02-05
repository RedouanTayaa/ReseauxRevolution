FROM node:18-alpine

WORKDIR /usr/src/app

RUN npm install -g @angular/cli

COPY package.json package-lock.json ./

RUN mkdir -p node_modules
RUN npm ci
COPY . .

EXPOSE 4200

CMD ["ng", "serve", "--host", "0.0.0.0"]