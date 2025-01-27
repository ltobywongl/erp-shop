"use client";
import Image, { ImageProps } from "next/image";
import { pathToS3Url } from "@/utils/string";
import myImageLoader from "@/utils/loaders/imageLoader";

function MyImage(props: ImageProps & { externalUrl?: boolean }) {
  const {externalUrl, ...imageProps} = props;
  let src = imageProps.src;
  if (props.externalUrl && typeof props.src === "string") {
    src = pathToS3Url(props.src);
    imageProps.unoptimized = true;
  }
  return (
    <Image
      {...imageProps}
      src={src}
      loader={myImageLoader}
      alt={props.alt ?? "image"}
    />
  );
}

export default MyImage;
