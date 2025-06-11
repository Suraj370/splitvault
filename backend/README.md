
This is the backend server for the Savings Splitter full-stack application, built using:

- Node.js
- Express.js
- Prisma ORM (MongoDB provider)
- MongoDB Atlas (or self-hosted MongoDB)

---

## Setup Instructions

### 1. Clone the repository


```bash
git clone https://github.com/Suraj370/splitvault.git
cd backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file at the root:

```env
DATABASE_URL="mongodb+srv://<username>:<password>@cluster.mongodb.net/savings-splitter?retryWrites=true&w=majority"
PORT=5000
JWT_SECRET="your_jwt_secret_key"
```

### 4. Prisma Setup

Generate Prisma Client:

```bash
npx prisma generate
```

(Optional: Push initial schema if starting fresh)

```bash
npx prisma db push
```

### 5. Start the server

```bash
npm run dev
```

---

## Project Structure

```bash
/src
  /controllers
  /routes
  /models
  /middleware
  /services
  /utils
prisma/schema.prisma
.env
```

---

## Available Scripts

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Start dev server |
| `npx prisma studio` | Open Prisma Studio (DB UI) |
| `npm run lint` | Lint the code |

---

## API Endpoints

- `POST /api/auth/register` — User Registration
- `POST /api/auth/login` — User Login
- `GET /api/accounts` — Fetch Main Accounts
- `POST /api/accounts` — Create Main Account
- `POST /api/subaccounts` — Create Sub Account
- `POST /api/transactions` — Add Transaction

---

## Prisma Schema

See full schema inside: `prisma/schema.prisma`

---

## Contribution

1. Fork the repo
2. Create a branch: `git checkout -b feature/your-feature-name`
3. Commit your changes.
4. Submit PR.

---