"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import { getFileExtension, convertFileToUrl } from "@/lib/utils";
import { Thambnail } from "./Thumbnail";
import { MAX_FILE_SIZE } from "@/constant";
import { toast } from "sonner";
import { uploadFile } from "@/lib/action/file.action";
import { useRouter } from "next/navigation";

export const FileUploader = ({ ...currentUser }) => {
  const [files, setFiles] = useState<File[]>([]);

  const user = { ...currentUser };
  const router = useRouter();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setFiles(acceptedFiles);

      const uploadPromises = acceptedFiles.map(async (file) => {
        if (file.size > MAX_FILE_SIZE) {
          setFiles((prev) => prev.filter((f) => f.name !== file.name));

          return toast("File has been max size");
        }

        try {
          return uploadFile({
            file,
            ownerId: user.$id,
            accountId: user.accountId,
            path: "uploads",
          })
            .then((uploadedFile) => {
              if (uploadedFile) {
                setFiles((prev) => prev.filter((f) => f.name !== file.name));
              }
            })
            .then(() => {
              toast("File uploaded successfully");
              router.refresh();
            });
        } catch (error) {
          console.log("upload failed error: ", error);
          return toast("File Upload Failed");
        }
      });

      await Promise.all(uploadPromises);
    },
    [user]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div>
      <div {...getRootProps()} className="cursor-pointer">
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop here ...</p>
        ) : (
          <Button
            variant={"secondary"}
            className="shadow-2xl bg-sky-200 hover:bg-sky-300"
          >
            File Upload
          </Button>
        )}
      </div>

      {files.length > 0 && (
        <ul className="mt-4 grid gap-4 absolute top-20">
          {files.map((file, index) => {
            const { type, extension } = getFileExtension(file.name);
            return (
              <li
                key={index}
                className="grid grid-cols-[0.5fr_1fr] w-50 bg-sky-100 items-center justify-center py-2 z-50"
              >
                <Thambnail
                  type={type}
                  extension={extension}
                  url={convertFileToUrl(file)}
                />
                <p className="text-sm">{file.name}</p>
                <img
                  src="/icons/file-loader.gif"
                  alt="loader"
                  className="my-2 col-span-2 mx-auto "
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
