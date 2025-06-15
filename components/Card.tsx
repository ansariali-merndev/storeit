"use client";
import { getFileIcon } from "@/lib/utils";
import Image from "next/image";
import { Models } from "node-appwrite";

export const Card = ({ file }: { file: Models.Document[] }) => {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      {file.map((item, index) => {
        return (
          <li key={index} className="bg-slate-100 py-6">
            <Image
              src={
                item.type === "image"
                  ? item.url
                  : getFileIcon(item.extension, item.type)
              }
              alt={item.name || ""}
              width={40}
              height={40}
              className="rounded-full w-30 h-30 mx-auto"
            />
            <div className="text-center mt-2">
              <h3 className="text-lg text-zinc-400 font-semibold">
                {item.Name}
              </h3>
              <p className="text-sm text-gray-400">
                {item.type.toUpperCase()} | {item.extension}
              </p>
              <p className="text-xs text-gray-500">
                Owner: {item.owner.fullName}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
};
