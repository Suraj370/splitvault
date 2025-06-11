
This is the frontend client for the Savings Splitter app built using:

- React.js
- TypeScript
- Axios
- React Query
- TailwindCSS

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/Suraj370/splitvault.git
cd frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file at the root:

```env
VITE_API_BASE_URL="http://localhost:5000/api"
```

### 4. Start the React app

```bash
npm run dev
```

---

## Project Structure

```bash
/src
  /components
    /common
    /account
    /subaccount
    /transactions
    /layout
  /pages or /routes
  /services
  /models
  /context
  /hooks
  /utils
  /styles
  /assets
App.jsx
index.jsx
```

---

## Data Models (Frontend TypeScript Interfaces)

- User
- MainAccount
- SubAccount
- Transaction

See `/models` folder for details.

---

## Contribution

1. Fork the repo
2. Create a branch: `git checkout -b feature/your-feature-name`
3. Commit your changes.
4. Submit PR.

---

## Notes

- This project uses REST API to communicate with backend.
- Axios is used to handle HTTP requests.
- React Query handles caching, data fetching and state management.
- TailwindCSS is used for rapid UI development.

