# Etapa 1: Dependencias
FROM node:24-alpine3.22 AS deps

WORKDIR /app

COPY package*.json ./

RUN npm ci

# Etapa 2: Build
FROM node:24-alpine3.22 AS builder

WORKDIR /app

COPY ./next.config.ts .

COPY --from=deps /app/node_modules ./node_modules

COPY . .

RUN npm run build

# Etapa 3: Producción
FROM node:24-alpine3.22 AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY ./next.config.ts .

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["npm", "run", "start"]
