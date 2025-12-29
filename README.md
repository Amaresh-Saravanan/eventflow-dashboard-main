# EventFlow Dashboard

Full-stack event management system with React frontend and Node.js backend.

## Project Structure

- `frontend/` - React + TypeScript + Vite frontend
- `backend/` - Node.js + Express + PostgreSQL backend

## Quick Start

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
```

### Using Docker
```bash
docker-compose up -d
```

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui

### Backend
- Node.js
- Express
- PostgreSQL
- Prisma ORM
- JWT Authentication

## Development

Frontend runs on: http://localhost:5173
Backend runs on: http://localhost:5000

## License

MIT
EOF

# ==========================================
# Step 11: Create Docker Compose (Optional)
# ==========================================

cat > ../docker-compose.yml << 'EOF'
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: eventflow-db
    environment:
      POSTGRES_USER: eventflow
      POSTGRES_PASSWORD: eventflow123
      POSTGRES_DB: eventflow
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    container_name: eventflow-backend
    depends_on:
      - postgres
    environment:
      DATABASE_URL: postgresql://eventflow:eventflow123@postgres:5432/eventflow?schema=public
      JWT_SECRET: your-secret-key
      PORT: 5000
      CORS_ORIGIN: http://localhost:5173
    ports:
      - '5000:5000'
    volumes:
      - ./backend:/app
      - /app/node_modules
    command: npm run dev

  frontend:
    build: ./frontend
    container_name: eventflow-frontend
    depends_on:
      - backend
    environment:
      VITE_API_URL: http://localhost:5000/api
    ports:
      - '5173:5173'
    volumes:
      - ./frontend:/app
      - /app/node_modules
    command: npm run dev

volumes:
  postgres_data:
EOF