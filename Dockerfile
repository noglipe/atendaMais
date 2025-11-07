# build
FROM node:20.9-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npm prune --production

# runtime
FROM node:20.9-alpine AS runner
WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public

RUN npm install --only=production

EXPOSE 3000

#CMD ["npm", "start"]
CMD ["npm", "run", "dev"]
