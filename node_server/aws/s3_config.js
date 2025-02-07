// For Node version >= 14, `require()` is deprecated
// The following lines enable the use of the `require()` function,
// as used throughout the rest of CirclesXR
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
if (env.AWS_ACCESS_KEY == undefined || env.AWS_REGION == undefined || env.AWS_SECRET_TOKEN == undefined) {
    throw "Missing AWS credentials. Contact Aaron to retrieve the tokens and paste them in the .env file";
}

// configure aws s3 client using env variables
const aws = require('@aws-sdk/client-s3');
const s3 = new aws.S3Client({
    "region": env.AWS_REGION,
    "accessKeyId": env.AWS_ACCESS_KEY,
    "secretKeyAccess": env.AWS_SECRET_TOKEN,
});

// test to retrieve the s3 bucket
// should return the "circlesxr_objectbucket" bucket
const command = new aws.ListBucketsCommand();
const response = await s3.send(command);
console.log(response);
