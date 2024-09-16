# Cinebase

## Overview
This project is a web application built with Golang and React that allows users to register, log in, and view detailed information about movies.

## Screenshot

## Technologies

### Backend
- **Go**: A statically typed, compiled programming language designed for simplicity and efficiency.
- **Postgres**: A powerful, open-source object-relational database system with a strong reputation for reliability and performance.
- **Echo**: A high-performance, minimalist web framework for Go, designed for ease of use and scalability.
- **GraphQL**: A query language for your API, and a server-side runtime for executing queries by using a type system you define for your data.
- **github.com/golang-jwt/jwt**: A Go implementation of JSON Web Tokens (JWT) for secure authentication.
- **github.com/jackc/pgx/v4**: A PostgreSQL driver and toolkit for Go, providing efficient and feature-rich database interactions.

### Frontend
- **React**: A JavaScript library for building user interfaces, maintained by Facebook and a community of individual developers and companies.
- **TypeScript**: A strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.
- **React Router**: A collection of navigational components that compose declaratively with your application.
- **React (TanStack) Query**: Powerful asynchronous state management for TS/JS, React, Solid, Vue, Svelte and Angular.
- **Zod**: A TypeScript-first schema declaration and validation library.
- **Tailwind CSS**: A utility-first CSS framework for rapidly building custom user interfaces.
- **Radix UI**: A set of low-level primitives for building accessible, high-quality design systems and web apps.
- **shadcn/ui**: A collection of UI components built with Radix UI and Tailwind CSS.

## Getting Started

### Prerequisites
- Go 1.23.0 or later
- Node.js 14.x or later
- Postgres 12 or later

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/erkindilekci/cinebase.git
   cd cinebase
   ```

2. **Backend Setup:**
   ```sh
   cd server
   go mod download
   go build -o ./ims cmd/cinebaseapi/main.go
   ```

3. **Frontend Setup:**
   ```sh
   cd client
   npm install
   npm run dev
   ```

### Running the Application

1. **Start the Backend:**
   ```sh
   cd server
   ./ims
   ```

2. **Start the Frontend:**
   ```sh
   cd client
   npm run dev
   ```

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.