# Build stage
FROM node:26-alpine AS builder
WORKDIR /app
COPY gintama-genius-web/package.json gintama-genius-web/pnpm-lock.yaml ./
RUN npm install -g pnpm@9 && pnpm install --frozen-lockfile
COPY gintama-genius-web/ .
RUN pnpm run build

# Production stage
# Imagem oficial sem privilégio: roda como usuário nginx (101), escuta em 8080 e grava pid/cache em /tmp
FROM nginxinc/nginx-unprivileged:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY gintama-genius-web/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1
# executa app sem privilegio (DS-0002)
USER 101
CMD ["nginx", "-g", "daemon off;"]
