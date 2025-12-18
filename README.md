## 📌 Crypto Transaction Analyzer

### Overview

Crypto Transaction Analyzer is a full-stack web application that analyzes Ethereum wallet activity using on-chain data.
Users can input a wallet address and view transaction history, activity patterns, and behavioral insights through an interactive dashboard.

This project focuses on bridging Web2 application development with Web3 blockchain data, emphasizing data normalization, usability, and transparency.

### 🎯 Project Goals

- Understand and consume blockchain data from Ethereum mainnet

- Normalize raw on-chain transaction data into user-friendly formats

- Visualize wallet behavior (inflows, outflows, counterparties)

- Demonstrate practical Web3 usage from a frontend-focused perspective

### 🧠 Key Features (Planned)

- Ethereum wallet address input & validation

- Fetch transaction data via Alchemy API

- Summary metrics (total in/out, transaction count)

- Time-based activity visualization

- Top interacting addresses (counterparties)

### 🏗️ Tech Stack
#### Frontend

- React

- TypeScript

- Tailwind CSS

- Chart library (TBD)

#### Backend

- Node.js

- Express

- TypeScript

- Alchemy SDK (Ethereum mainnet)

#### Infrastructure

- Frontend: Netlify

- Backend: Heroku

- API data source: Alchemy (Ethereum mainnet)

### 🔐 Security Considerations

Alchemy API keys are never exposed to the client

Wallet address input is validated server-side

Basic rate limiting and caching planned to handle API limits

### 🚀 In Progress
Currently setting up repository structure and backend integration with Alchemy.

