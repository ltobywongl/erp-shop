require('dotenv').config();
const shell = require('shelljs');

const {
  SSH_USER,
  SSH_HOST,
  SSH_KEY,
  LOCAL_PORT,
  REMOTE_HOST,
  REMOTE_PORT
} = process.env;

const command = `ssh -N -L ${LOCAL_PORT}:${REMOTE_HOST}:${REMOTE_PORT} ${SSH_USER}@${SSH_HOST} -i "${SSH_KEY}"`;

console.log('Executing command: ' + command);
shell.exec(command);
