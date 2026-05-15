# Cantinho do Leitor

> "Uma palavra nos liberta de todo o peso e da dor da vida. Essa palavra é amor." — Santo Agostinho

Aplicativo privado de gestão de leitura para a família. Acompanhe livros, registre sessões de leitura, faça anotações e veja o progresso de todos no dashboard.

---

## Acesso

| Usuário | E-mail | Senha |
|---------|--------|-------|
| Eduardo | `teamo@cantinho.app` | `1105` |
| Julia | `julia@cantinho.app` | `teamo` |

---

## Funcionalidades

- **Biblioteca** — adicione livros com status: Lendo, Lido, Quero Ler, Quero Comprar, Abandonado
- **Progresso** — barra de progresso por páginas lidas
- **Notas** — anotações e resumos com editor rich-text (Tiptap)
- **Arquivos** — upload de PDF do livro
- **Calendário** — registro de sessões de leitura com streak de dias consecutivos
- **Dashboard** — ranking de leitores, gráficos de gêneros e atividade recente

---

## Stack

**Frontend** — React + TypeScript + Vite, CSS Modules, Recharts, Tiptap, lucide-react

**Backend** — Node.js + Express + TypeScript, Prisma + SQLite, JWT, Multer

---

## Rodando localmente

### Backend

```bash
cd backend
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Sobe em `http://localhost:3001`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Sobe em `http://localhost:5173`

---

## Deploy

- **Frontend** → Vercel (`frontend/`)
- **Backend** → Railway (`backend/`) — variáveis necessárias: `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL`
