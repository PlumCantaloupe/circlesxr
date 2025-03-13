const s3 = require('../aws/aws_config').s3;
const bucketName = require('../aws/aws_config').bucketName;
const aws = require('../aws/aws_config').aws;

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

const retrieveFromS3 = async (request, response) => {
    try {
        const objectKey = request.params.key;
        const getObjectCmd = new aws.GetObjectCommand({
          Bucket: bucketName,
          Key: objectKey,
        });
    
        const cmdResponse = await s3.send(getObjectCmd);
        response.status(200).json({ message: 'Object retrieved successfully!' + cmdResponse });
      } catch (error) {
        response.status(500).json({ message: 'Error retrieving object: '+ error });
      }
}

module.exports = { uploadToS3, retrieveFromS3 };