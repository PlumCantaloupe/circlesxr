const { spawn } = require('child_process');
const dotenv = require('dotenv');
const dotenvParseVariables = require('dotenv-parse-variables');

//check for .env file
let env = dotenv.config({})
if (env.error) {
  throw 'Missing environment config. Copy .env.dist to .env and make any adjustments needed from the defaults';
}

// Parse the dot configs so that things like false are boolean, not strings
env = dotenvParseVariables(env.parsed);

// Make the parsed environment config globally accessible
//global.env = env;

const cmd = spawn('mongod', ['--bind_ip', env.MONGO_IP, '--dbpath', env.MONGO_DB]);

cmd.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

cmd.stderr.on('data', (data) => {
  console.log(`stderr: ${data}`);
});

cmd.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});