import * as AWS from 'aws-sdk';
import { createLogger } from '../../utils/logger';

const logger = createLogger('S3 Attachment')

const s3 = new AWS.S3({
  signatureVersion: 'v4'
});

const bucketName = process.env.ATTACHMENT_S3_BUCKET;
const urlExpiration = process.env.SIGNED_URL_EXPIRATION;

export function createAttachmentPresignedUrl(todoId: string): string {
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: todoId,
    Expires: parseInt(urlExpiration)
  })
}

export async function removeAttachment(id: string): Promise<void> {
  const params = {
    Bucket: bucketName,
    Key: id
  }
  try {
    await s3.headObject(params).promise()
    logger.info("File Found in S3")
    try {
      await s3.deleteObject(params).promise()
      logger.info("file deleted Successfully")
    }
    catch (err) {
      logger.error("ERROR in file Deleting : " + JSON.stringify(err))
    }
  } catch (err) {
    logger.error("File not Found ERROR : " + err.code)
  }
}