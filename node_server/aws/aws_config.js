import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// retrieve environment variables
const dotenv = require('dotenv');
const dotenvParseVariables = require('dotenv-parse-variables');
let env = dotenv.config({});
if (env.error) {
    throw 'Missing environment config. Copy .env.dist to .env and make any adjustments needed from the defaults';
}
env = dotenvParseVariables(env.parsed);
console.log(env.AWS_ACCESS_TOKEN);
if (env.AWS_ACCESS_TOKEN == undefined || env.AWS_REGION == undefined || env.AWS_SECRET_KEY == undefined) {
    throw "Missing AWS credentials. Contact Aaron to retrieve the tokens and paste them in the .env file";
}

// configure aws s3 client using env variables
const aws = require('@aws-sdk/client-s3');
const s3 = new aws.S3Client({
    "region": env.AWS_REGION,
    "accessKeyId": env.AWS_ACCESS_KEY,
    "secretKeyAccess": env.AWS_SECRET_TOKEN,
});

const bucketName = 'circlesxr-objects';

export { s3, aws, bucketName };