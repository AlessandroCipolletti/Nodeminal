export const files = {
  'index.js': {
    file: {
      contents: `
// 'npm run start' to run this file
// cmd+s or ctrl+s  to save and update

import express from 'express';

const app = express();
const port = 3111;

app.get('/', (req, res) => {
  res.send(' "/" app route');
});

app.listen(port, () => {
  console.log('Express app is running!');
});

`,
    },
  },

  'package.json': {
    file: {
      contents: `
{
  "name": "example-app",
  "type": "module",
  "dependencies": {
    "express": "latest",
    "nodemon": "latest"
  },
  "scripts": {
    "start": "npm i && nodemon --watch './' index.js"
  }
}`,
    },
  },
}