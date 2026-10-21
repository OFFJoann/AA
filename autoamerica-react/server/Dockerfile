FROM node:24-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY src ./src
COPY seed ./seed

ENV DATABASE_PATH=/data/app.db
VOLUME ["/data"]
EXPOSE 3000

HEALTHCHECK --interval=10s --timeout=3s --start-period=8s --retries=5 \
  CMD wget -q --tries=1 --spider http://127.0.0.1:3000/api/health || exit 1

CMD ["node", "src/index.js"]
