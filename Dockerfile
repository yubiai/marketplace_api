FROM node:16

WORKDIR /dist

COPY package.json /dist

RUN npm install

COPY ./ /dist

## docker build -t yb/api-test:latest .
## docker build -t yb/api-0.4.0 .
## git tag v0.3 -m "Primera versión"
## git tag
## git push --tags