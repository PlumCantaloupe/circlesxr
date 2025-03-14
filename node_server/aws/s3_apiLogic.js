const s3 = require('./aws_config').s3;
const bucketName = require('./aws_config').bucketName;
const aws = require('./aws_config').aws;

const uploadToS3 = async (request, response) => {
    try {
        const binaryData = Buffer.from(request.body.binaryData, 'base64');
        
        const addObjectCmd = new aws.PutObjectCommand({
          Bucket: bucketName,
          Key: request.body.objectKey,
          Body: binaryData,
          // TODO => add custom metadata
        });
    
        const cmdResponse = await s3.send(addObjectCmd);
        response.status(200).json({ message: 'Object uploaded successfully! ' + cmdResponse });
      } catch (error) {
        response.status(500).json({ message: 'Error uploading object: ' + error});
      }
}

const retrieveAllObjects = async (request, response) => {
    try {
        const getAllObjectsCmd = new aws.ListObjectsCommand({
          Bucket: bucketName,
        });
    
        const cmdResponse = await s3.send(getAllObjectsCmd);
        response.status(200).json({ message: 'Object retrieved successfully!', data: cmdResponse });
      } catch (error) {
        response.status(500).json({ message: 'Error retrieving object: '+ error });
      }
}

const retrieveObject = async (request, response) => {
    try {
      console.log(request.params.key);
        const getObjectCmd = new aws.GetObjectCommand({
          Bucket: bucketName,
          Key: request.params.key,
        });
    
        const cmdResponse = await s3.send(getObjectCmd);
        console.log(cmdResponse);
        response.status(200).json({ message: 'Objects retrieved successfully!', data: cmdResponse });
      } catch (error) {
        response.status(500).json({ message: 'Error retrieving object: '+ error });
      }
}

module.exports = { uploadToS3, retrieveAllObjects, retrieveObject };