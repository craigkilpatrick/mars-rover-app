# Stage 1: Dependencies
FROM node:20.19.2-alpine AS deps
WORKDIR /app

# Install build dependencies for canvas
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev

COPY package*.json ./
RUN npm ci

# Stage 2: Development
FROM node:20.19.2-alpine AS development
WORKDIR /app

# Install runtime dependencies for canvas and debugging tools
RUN apk add --no-cache \
    cairo \
    jpeg \
    pango \
    giflib \
    curl

# Install development dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Expose ports for development
EXPOSE 3000
EXPOSE 9229

CMD ["npm", "run", "dev"]

# Stage 3: Builder
FROM node:20.19.2-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 4: Production
FROM nginx:alpine AS production
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
