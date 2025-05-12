# Weather App

This is a monorepo for a weather application built with Vue 3, TypeScript, and Vite.

🌐 [Live Demo](https://weather-forecast.eshin-griffith.com/)

## Project Structure

- `apps/weather-ui`: Frontend Vue 3 application ([README](./apps/weather-ui/README.md))
- `apps/weather-worker`: Backend worker service ([README](./apps/weather-worker/README.md))
- `packages/weather-client`: A small wrapper for `hono/client` that provides types from the hono router in the backend to provide type-safe fetching in the frontend.

## Getting Started

To get started with this project:

1. **Prerequisites**
   - Node.js (v18 or higher)
   - pnpm (v8 or higher)
   - You will need an [OpenWeather API Key](https://openweathermap.org/appid)
   - To Deploy, you will need to install the [1Password CLI](https://developer.1password.com/docs/cli/), the [AWS CLI](https://aws.amazon.com/cli/)

2. **Installation**
   ```bash
   # Install dependencies
   pnpm install

   # Generate environment files
   pnpm gen-env
   ```
   When finished, assign your Openweather key to `OPENWEATHER_API_KEY` in the `.env` file.

3. **Development**
   ```bash
   # Start the frontend development server
   pnpm --filter weather-ui dev

   # Start the backend worker
   pnpm --filter weather-worker dev

   # Or start both in parallel
   pnpm dev
   ```
   By default, the app is hosted at http://localhost:5173, and the worker is at http://localhost:3000.

4. **Building for Production**
   ```bash
   # Build all packages
   pnpm build

   # Build specific package
   pnpm --filter weather-ui build
   pnpm --filter weather-worker build
   ```


## Deployment
The application is deployed to AWS using the AWS CLI, with the connection configured using the [1Password AWS Shell Plugin](https://developer.1password.com/docs/cli/shell-plugins/aws/#reference).

### Setup
1. Create an access token that can upload to S3 and Lambda, save it in 1p
2. Create a bucket `s3://weather-ui-bucket-1` and cloudfront instance (make sure to set the default root path to index.html)
3. Create a Node 20 Lambda function called `weather-worker`
4. Link the AWS Access Key in the current directory using the Shell Plugin Docs linked in the description above.

### Deploy the Application
After following the above instructions, run any of the scripts below (note the `run` argument is required). You will be prompted to sign in to your 1Password. 
 ```bash
   # Build all packages
   pnpm run deploy

   # Build specific package
   pnpm run --filter weather-ui deploy
   pnpm run --filter weather-worker deploy
   ```


## Available Scripts

- `pnpm dev` - Start development servers for all packages
- `pnpm build` - Build all packages for production
- `pnpm test` - Run tests for all packages
- `pnpm lint` - Run linting for all packages
- `pnpm format` - Format code using Prettier
- `pnpm gen-env` - Generate environment files and symlinks
