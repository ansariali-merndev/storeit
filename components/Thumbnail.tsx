"use client";

import { getFileIcon } from "@/lib/utils";
import Image from "next/image";

interface ThambnailProps {
  type: string;
  extension: string;
  url: string;
}

export const Thambnail = ({ type, extension, url }: ThambnailProps) => {
  const isImage = type === "image" && extension !== "svg";
  return (
    <figure>
      <Image
        src={isImage ? url : getFileIcon(extension, type)}
        alt=""
        height={20}
        width={20}
        className="rounded-full w-10 h-auto"
      />
    </figure>
  );
};
