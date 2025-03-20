# 🚀 NeuralLift Chatbot

NeuralLift Chatbot is a powerful monorepo project designed to streamline and organize AI-driven chatbot functionalities. It encompasses both server-side and client-side applications, leveraging modern technologies like TypeScript, React, and Node.js to deliver a seamless user experience.

## 📂 Project Structure

The project is structured into two primary applications:

```
root/
├── apps/
│   └── web/                # Vite React application
│   └── server/             # Express application
├── packages/
│   ├── ui/                 # Shared UI components
│   ├── eslint-config/      # Shared ESLint configurations
│   └── typescript-config/  # Shared TypeScript configurations
└── README.md               # Project documentation
```

### 1. 🖥️ Server

- **Path**: `apps/server`
- **Description**: The backend services that power the chatbot, handling document processing, vector storage, and API endpoints.
- **Technologies**:
  - Node.js (Express.js)
  - TypeScript
  - Prisma
  - Pinecone
  - LangChain
- **Key Features**:
  - Efficient document storage and processing.
  - Robust conversational state management.
  - Advanced graph-based workflows for customer support and research.

### 2. 🌐 Web

- **Path**: `apps/web`
- **Description**: The frontend application for managing chatbot agents and knowledge bases.
- **Technologies**:
  - React
  - TypeScript
  - Vite
  - TailwindCSS
- **Key Features**:
  - Intuitive interface for adding and managing knowledge bases.
  - Comprehensive configuration options for chatbot agents.
  - User-friendly platform for AI training data management.

## 🛠️ Installation

### Prerequisites

- Node.js (>= 16.x)
- pnpm (install via `npm install -g pnpm`)
- Mongodb (for Prisma)

### Steps

1.  Clone the repository:

    ```bash
    git clone https://github.com/NeuralLift/chatbot.git
    cd chatbot
    ```

2.  Install pnpm if you don't have it already:

    ```bash
    npm install -g pnpm
    ```

3.  Install dependencies:

    ```bash
    pnpm install
    ```

4.  Set up environment variables:

    - Copy `.env.example` to `.env` in `apps/server` and configure the variables.

5.  Run database migrations:

    ```bash
    cd apps/server
    pnpm prisma migrate dev
    ```

6.  Start the development servers:

    - **Server**:

      ```bash
      cd apps/server
      pnpm dev
      ```

    - **Web**:

      ```bash
      cd apps/web
      pnpm dev
      ```

    - **Root (Turbo)**
      ```bash
      pnpm dev
      ```

## 📜 Scripts

### Server

- `pnpm dev`: Start the server in development mode.
- `pnpm build`: Build the server for production.
- `pnpm lint`: Run ESLint checks.

### Web

- `pnpm dev`: Start the web application in development mode.
- `pnpm build`: Build the web application for production.
- `pnpm lint`: Run ESLint checks.

## ✨ Features

### Server

- **Document Service**:
  - Process and store documents from URLs, files, or raw content.
  - Seamless integration with Pinecone for vector storage.
- **Graph Workflows**:
  - Customer support graph for efficient conversation management.
  - Research graph for advanced query generation and document retrieval.

### Web

- **Knowledge Base Management**:
  - Effortlessly add, edit, and delete knowledge sources (e.g., documents, articles, websites).
- **Agent Configuration**:
  - Create and configure chatbot agents with customizable system prompts and data sources.

## 🚀 Technologies Used

### Backend

- Node.js (Express.js)
- TypeScript
- Prisma
- Pinecone
- LangChain

### Frontend

- React
- TypeScript
- Vite
- TailwindCSS

## 🤝 Contributing

Contributions are warmly welcomed! Please adhere to the following steps:

1.  Fork the repository.
2.  Create a new branch:

    ```bash
    git checkout -b feature-name
    ```

3.  Commit your changes:

    ```bash
    git commit -m "feat: Add feature-name"
    ```

4.  Push to your branch:

    ```bash
    git push origin feature-name
    ```

5.  Open a pull request.

## 📄 License

This project is licensed under the ISC License.
[MIT](https://choosealicense.com/licenses/isc/)

## 🙏 Acknowledgments

- [LangChain](https://github.com/hwchase17/langchain)
- [Pinecone](https://www.pinecone.io/)
- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
