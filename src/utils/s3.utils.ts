import { S3_CONFIG } from "../config/aws-s3-config";
import { devLog } from "./general-utils";

const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    accessKeyId: S3_CONFIG.accessKeyId,
    secretAccessKey: S3_CONFIG.secretAccessKey,
    region: S3_CONFIG.region
})

export const uploadFile = async (file: any, foldername: string) => {
    const params = {
        Bucket: S3_CONFIG.bucket,
        Key: `${foldername}/image-${Date.now()}-${file.name}`,
        Body: file.data,
        ContentType: "image/jpg, image/png, image/jpeg"
    };

    const res = await s3.upload(params).promise();
    return res.key;
}

export const deleteFile = async (file: any, foldername: string) => {
    const params = {
        Bucket: S3_CONFIG.bucket,
        Key: file
    }

    s3.deleteObject(params, (err: any, data: any) => {
        if (err) {
          devLog('Error deleting image file:', err);
        } else {
          devLog('Image file deleted successfully', '');
        }
  });
};

export const readFile = async (key: string) => {
    const params = {
        Bucket: S3_CONFIG.bucket,
        Key: key,
        Expires: 10800,
    };

    const res = await s3.getSignedUrl('getObject', params);
    return res;
}