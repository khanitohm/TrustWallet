# --- builder stage ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# --- runtime stage ---
FROM node:20-alpine
RUN apk add --no-cache git
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
ENTRYPOINT ["npx","hardhat"]
