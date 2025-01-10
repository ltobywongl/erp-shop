// import { S3 } from "@aws-sdk/client-s3";

// const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
// const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
// const region = process.env.AWS_REGION;
const s3Url = process.env.NEXT_PUBLIC_AWS_S3_URL;

// if (!accessKeyId || !secretAccessKey || !region)
//   throw new Error("S3 Information Missing");

// const client = new S3({
//   region: region,
//   credentials: {
//     accessKeyId,
//     secretAccessKey,
//   },
// });

const imageLoader = ({
  src,
  width,
  quality,
}: {
  src: string;
  width: string;
  quality: string;
}) => {
  if (!s3Url) return src;

  if (src.startsWith(s3Url)) {
    return src;
  } else {
    return `${src}?width=${width}&q=${quality || 75}`;
  }
};

module.exports = imageLoader;
