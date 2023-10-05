const fs = require('fs');
const crypto = require('crypto');

// Generate a random secret key
const secretKey = crypto.randomBytes(64).toString('hex');

// Create an object to store your environment variables
const envVariables = {
  TOKEN_SECRET: secretKey,
};

// Convert the object to a string
const envString = Object.keys(envVariables)
  .map((key) => `${key}=${envVariables[key]}`)
  .join('\n');

// Write the string to the .env file
fs.writeFileSync('.env', envString);

console.log('Token generated and saved to .env file.');
