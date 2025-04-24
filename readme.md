# Kalos - Web System

This repository contains two separate projects:

- **`kalos_backend`** – A REST API built with Node.js, Typescript, Hono and Sqlite as Lightweight Database.

- **`kalos_frontend`** – A web application built with Next.js, Tailwind CSS.

## 📋 Requirements

- Node.js >= 18
- npm (or yarn/pnpm)
- SQLite

---

## 📦 Installation

### Clone the repository

```bash
git clone https://github.com/felixsuarez0727/kalos_realtime_sales.git
cd kalos
```


🔧Backend Setup


Navitate to the backend directory

```bash
cd kalos_backend
```
Install dependencies

```bash
npm install
```
Run the backend

```bash
npx tsx server.ts 
```

🧪 How to Run Unit Tests?

The tests were built using 'vitest'. These test evaluate endpoint /transactions to ensure the validation of requests.
The endpoint '/transactions/total' is evaluated to validate the succesful delivery of the total revenue.

```bash
npm test
```

💻Frontend Setup


Navitate to the frontend directory

```bash
cd ../kalos_frontend/frontend
```
Install dependencies

```bash
npm install
```
Run the frontend

```bash
npm run dev
```

🧪 How to Run Unit Tests?

The unit tests were buit using 'Jest' and the tests are run over UI components.

```bash
npm test
```

# 💻 How to deploy a demo

1. Download the repo.
2. Open CMD.
3. Run this command: `docker build -t my-app .`
4. Wait till the image is built.
5. Run this commnnd: `docker run -d  -p 3001:3001 -p 3000:3000 -p 8787:8787  my-app`
6. Open your browser at the URL: `http://localhost:3000`
7. Check this demo deployed on Docker: [http://104.131.113.126:3000/]('http://104.131.113.126:3000/')

# 💡 Technical Decisions

The project statement cited a suggested technology stack. The suggestion was taken as requirement and a nice challenge.

As developer I like learning new technologies. I found interesting the aproach of Hono. I did not know this option for backend.

I chose to develop using Sqlite because it is convinient for demo purposes.

For testing the backend was chosen the Vitest software. 

For testing the frontend was chosen the 'Jest', but the way to this decission was tricky. The frontend has 'turbopack' as bundler, this piece of software was not compatible with 'Babel' the first option to develop the unit tests. Nonetheless, this mistake was the opportunity to explore a second way for writing tests.

# 🚧  Limitations
Sqlite might not been suitable for production environment.

The endpoints might need load balancing.

# 🧠 During the review

I would appreciate if you could focus on a few key areas. First, the code structure 🧠. Second, the communication between the frontend and backend using tRPC 🔁. Third, I need feedback on the performance for showing data in real-time 📊⚡, this feature, I think is a specially remarkable. Finally, I'd love your feedback on the responsiveness and user experience of the UI built with Tailwind CSS 🎨.