/**
 * Entry point for starting the Express server.
 *
 * Loads environment variables, starts the server on the configured port,
 * and defines a basic health check route.
 *
 * Dependencies:
 * - app: The Express application instance.
 * - dotenv: Loads environment variables from a .env file.
 *
 * Environment Variables:
 * - BACKEND_PORT: The port number for the server to listen on.
 */

import app from './app.mjs';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.BACKEND_PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Health check or welcome route
app.get('/', (req, res) => {
  console.log(req.body);
  res.send('Welcome');
});