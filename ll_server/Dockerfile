FROM node:18-alpine AS base

RUN corepack enable && corepack prepare pnpm@10.17.0 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm prisma generate


FROM base AS build

RUN pnpm run build

FROM node:18-alpine AS production

RUN corepack enable && corepack prepare pnpm@10.17.0 --activate

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile --prod

COPY --from=build --chown=nestjs:nodejs /app/dist ./dist
COPY --from=build --chown=nestjs:nodejs /app/prisma ./prisma

RUN pnpm prisma generate

USER nestjs

EXPOSE 3000

CMD ["node", "dist/src/main.js"]
