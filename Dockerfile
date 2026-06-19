FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests first so this layer is cached until deps change,
# regardless of TypeScript source changes.
COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build:minimal


FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json ./

COPY --from=builder /app/dist ./dist

USER node

EXPOSE 3000

CMD ["node", "dist/main"]
