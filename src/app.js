import express from 'express';
import https from 'https';
import fs from 'fs';

import configExpress from './config/express.js';
import routes from './routes.js';

const app = express();
const port = process.env.PORT || 8080;

// Setup Express
configExpress(app);

// Setup Routes
routes(app);

// Read the SSL certificate and private key files from the container's path
const sslOptions = {
  key: fs.readFileSync('/app/ssl/private.key'),
  cert: fs.readFileSync('/app/ssl/certificate.crt'),
  ca: fs.readFileSync('/app/ssl/ca_bundle.crt')
};

// Create an HTTPS server
const server = https.createServer(sslOptions, app);

server.listen(port, () => {
  console.log("🚀 ~ file: app.js:23 ~ server.listen ~ port:", port);
});
