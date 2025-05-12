# Weather UI
This directory contains the source code for the weather worker. The module sets up a Vue.js SPA that requests and renders location and weather-related content from the weather worker. It utilizes a type-safe RPC wrapper (see packages/weather-client) to make calls to the API server.

## Scripts
- `clean`: Removes the build artifacts (dist directory)
- `dev`: Starts the Vite development server with hot module replacement
- `build`: Compiles TypeScript and builds the production bundle using Vite
- `preview`: Serves the production build locally for preview
- `update`: Deploys the built files to the S3 bucket for use with CloudFront (must have 1Password CLI set up and configured with valid AWS access key)
- `deploy`: Runs the full deployment pipeline (clean, build, and update)
