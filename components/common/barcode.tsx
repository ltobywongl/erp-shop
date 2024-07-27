"use client";
import Barcode from "react-barcode";

export default function MBarcode({ content }: { content: string }) {
  return (
    <Barcode
      value={content}
      background="rgb(239 68 68 / var(--tw-bg-opacity))"
      className="w-full h-full"
      displayValue={false}
    />
  );
}
