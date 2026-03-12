FROM node:22-alpine AS builder
RUN apk add --no-cache python3 make g++
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY tsconfig.json ./
COPY src/ src/
COPY data/ data/
COPY scripts/ scripts/
RUN npm run build && npm run build:db

FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN apk add --no-cache python3 make g++ && \
    npm ci --omit=dev && \
    apk del python3 make g++ && \
    npm cache clean --force
COPY --from=builder /app/dist dist/
COPY --from=builder /app/data data/
ENV PORT=3000
EXPOSE 3000
USER node
CMD ["node", "dist/http-server.js"]
