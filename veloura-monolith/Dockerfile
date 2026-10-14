# ---------- Stage 1: build the React (Vite) frontend ----------
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# ---------- Stage 2: Express backend that also serves the built frontend ----------
FROM node:20-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm install --omit=dev
COPY backend/ ./
COPY --from=frontend-builder /app/frontend/dist ./public
ENV PORT=5000
EXPOSE 5000
CMD ["npm", "start"]
