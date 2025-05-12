# Weather App

This is a monorepo for a weather application built with Vue 3, TypeScript, and Vite.

## Project Structure

- `apps/weather-ui`: Frontend Vue 3 application
- `apps/weather-worker`: Backend worker service

## Getting Started

To get started with this project:

1. **Prerequisites**
   - Node.js (v18 or higher)
   - pnpm (v8 or higher)

2. **Installation**
   ```bash
   # Install dependencies
   pnpm install
   ```

3. **Development**
   ```bash
   # Start the frontend development server
   pnpm --filter weather-ui dev

   # Start the backend worker
   pnpm --filter weather-worker dev

   # Or start both in parallel
   pnpm dev
   ```

4. **Building for Production**
   ```bash
   # Build all packages
   pnpm build

   # Build specific package
   pnpm --filter weather-ui build
   pnpm --filter weather-worker build
   ```

5. **Testing**
   ```bash
   # Run tests for all packages
   pnpm test

   # Run tests for specific package
   pnpm --filter weather-ui test
   pnpm --filter weather-worker test
   ```

6. **Deployment**
   The application is deployed to AWS using the AWS CLI, with the connection configured using the [1Password AWS Shell Plugin](https://developer.1password.com/docs/cli/shell-plugins/aws/#reference).

## Available Scripts

- `pnpm dev` - Start development servers for all packages
- `pnpm build` - Build all packages for production
- `pnpm test` - Run tests for all packages
- `pnpm lint` - Run linting for all packages
- `pnpm format` - Format code using Prettier
