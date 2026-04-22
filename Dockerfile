# Build stage
FROM node:20-slim AS builder
WORKDIR /app
COPY gintama-genius-web/package.json gintama-genius-web/package-lock.json ./
RUN npm install
COPY gintama-genius-web/ .
RUN npm run build

# Final stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
