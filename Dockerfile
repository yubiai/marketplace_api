FROM node:16

WORKDIR /dist

COPY package.json /dist

RUN npm install

COPY ./ /dist

## docker build -t yb/api-test:latest .

## docker build -t test:latest .
## docker build -t prepro:latest .

## docker build -t yb/api-0.5.0 .
## docker build -t test:latest .
## git tag v0.5.0 -m "New version"
## git tag
## git push --tags