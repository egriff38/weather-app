import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Create .env file content
const envContent = `
# Local Development Environment Variables
WEB_ORIGIN=http://localhost:5173
VITE_API_URL=http://localhost:3000

# Weather App Environment Variables
# Add your OpenWeather API key below
OPENWEATHER_API_KEY=your_api_key_here
`.trimStart();

// Create .env file
fs.writeFileSync(path.join(__dirname, ".env"), envContent);

// Create app directory if it doesn't exist
const appDir = path.join(__dirname, "apps");
if (!fs.existsSync(appDir)) {
  fs.mkdirSync(appDir, { recursive: true });
}

// Create symlinks for both modules
const modules = ["weather-ui", "weather-worker"];
modules.forEach((module) => {
  const moduleDir = path.join(appDir, module);
  if (!fs.existsSync(moduleDir)) {
    fs.mkdirSync(moduleDir, { recursive: true });
  }

  const envPath = path.join(__dirname, ".env");
  const symlinkPath = path.join(moduleDir, ".env");

  // Remove existing symlink if it exists
  if (fs.existsSync(symlinkPath)) {
    fs.unlinkSync(symlinkPath);
  }

  // Create new symlink
  fs.symlinkSync(envPath, symlinkPath);
  console.log(`Created symlink for ${module} module`);
});

console.log("Environment setup complete!");
