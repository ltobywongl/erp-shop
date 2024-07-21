import { GetObjectCommand, PutObjectCommand, S3 } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Upload } from "@aws-sdk/lib-storage";
import stream, { Stream } from "stream";

const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const region = process.env.AWS_REGION;

if (!accessKeyId || !secretAccessKey || !region)
  throw new Error("S3 Information Missing");

const client = new S3({
  region: region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export async function generatePresignedUrl(bucket: string, path: string) {
  const command = await getSignedUrl(
    client,
    new GetObjectCommand({
      Bucket: bucket,
      Key: path,
      ResponseContentType: path.endsWith(".pdf")
        ? "application/pdf"
        : "image/jpeg",
    })
  );
  return command;
}

export async function generatePresignedUrlForUpload(
  bucket: string,
  path: string
) {
  const command = await getSignedUrl(
    client,
    new PutObjectCommand({
      Bucket: bucket,
      Key: path,
    })
  );
  return command;
}

export async function uploadStream(
  bucket: string,
  key: string,
  readableStream: Stream
) {
  const passThroughStream = new stream.PassThrough();
  let res;
  try {
    const parallelUploads3 = new Upload({
      client,
      params: {
        Bucket: bucket,
        Key: key,
        Body: passThroughStream,
      },
      queueSize: 4,
      partSize: 1024 * 1024 * 5,
      leavePartsOnError: false,
    });

    readableStream.pipe(passThroughStream);
    res = await parallelUploads3.done();
  } catch (e) {
    console.log(e);
  }

  return res;
}

export async function uploadBlob(
  bucket: string,
  key: string,
  blob: Blob,
  contentType?: string
) {
  try {
    const parallelUploads3 = new Upload({
      client: client,
      params: {
        Key: key,
        Bucket: bucket,
        Body: blob,
        ContentType: contentType,
      },
      queueSize: 4,
      partSize: 1024 * 1024 * 5,
      leavePartsOnError: false,
    });
    return await parallelUploads3.done();
  } catch (e) {
    console.log(e);
  }
}
