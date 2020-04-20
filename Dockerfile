FROM node:lts AS builder

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn

COPY . .

RUN yarn build:ssr

FROM alpine

COPY --from=builder /app/dist/browser /app/dist/browser