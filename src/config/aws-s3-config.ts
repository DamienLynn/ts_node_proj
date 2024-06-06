// Set the region and credentials for the AWS SDK
export const S3_CONFIG = Object.freeze({
    region: 'ap-southeast-1',
    accessKeyId: process.env["S3_ACCESS_KEY_ID"],
    secretAccessKey: process.env["S3_SECRET_KEY"],
    bucket: process.env["S3_BUCKET"],
    acl: 'private-read',
});