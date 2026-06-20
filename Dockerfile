# Build stage
FROM node:26-alpine AS builder
WORKDIR /app
COPY gintama-genius-web/package.json gintama-genius-web/pnpm-lock.yaml ./
RUN npm install -g pnpm@9 && pnpm install --frozen-lockfile
COPY gintama-genius-web/ .
RUN pnpm run build

# Production stage
FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html
COPY gintama-genius-web/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1
CMD ["nginx", "-g", "daemon off;"]