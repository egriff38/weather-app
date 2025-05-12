# Weather Worker
This directory contains the source code for the weather worker. The module sets up a hono router that validates requests, and forwards them to the OpenWeather API. It also exports the router and types to allow safe RPC method calling from the frontend (see packages/weather-client).

## Scripts

- `build`: Bundles the application using esbuild for Node.js platform targeting Node 20 ESM
- `zip`: Creates a zip file containing the bundled application for AWS Lambda deployment
- `update`: Updates the AWS Lambda function code with the latest zip file (must have 1Password CLI set up and configured with valid AWS access key)
- `clean`: Removes the build artifacts
- `deploy`: Runs the full deployment pipeline (clean, build, zip, and update)
- `dev`: Starts the development server with hot reloading using tsx
- `interactive`: Starts a Node REPL with environment variables loaded and library functions exposed in the global scope.


## A note on patches/openweather-api-node[...].patch
The openweather-api-node package dynamically requires http or https node builtin packages, which is unfortunately not compatible with bundling to ESM for the worker. To solve this, I created a patch for the package that is applied when `pnpm install` is run, that simply replaces the dynamic import with a native fetch call.