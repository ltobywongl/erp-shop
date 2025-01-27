const s3Url = process.env.NEXT_PUBLIC_AWS_S3_URL;

export default function myImageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  if (!s3Url) return src;

  if (src.startsWith(s3Url)) {
    return src;
  } else {
    return `${src}?width=${width}&q=${quality ?? 75}`;
  }
}
