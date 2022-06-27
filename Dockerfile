FROM node:16

WORKDIR /dist

COPY package.json /dist

RUN npm install

COPY ./ /dist

## docker build -t yb/api-test:latest .
## git tag v0.3 -m "Primera versión"
## git tag
## git push --tags