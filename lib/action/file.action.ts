"use server";

import { InputFile } from "node-appwrite/file";
import { createAdminSession } from "../appwriteConfig";
import { appwrite } from "@/constant/appwriteConstant";
import { ID } from "node-appwrite";
import { constructFileUrl, getFileExtension } from "../utils";

interface uploadFile {
  file: File;
  ownerId: string;
  accountId: string;
  path: string;
}

export const uploadFile = async ({
  file,
  ownerId,
  accountId,
  path,
}: uploadFile) => {
  const { storage, databases } = await createAdminSession();
  let bucketFile;

  try {
    const inputFile = InputFile.fromBuffer(file, file.name);
    bucketFile = await storage.createFile(
      appwrite.bucket,
      ID.unique(),
      inputFile
    );

    const { type, extension } = getFileExtension(bucketFile.name);
    const fileDocument = {
      Name: bucketFile.name,
      url: constructFileUrl(bucketFile.$id),
      type: type,
      BucketField: appwrite.bucket,
      accountId: accountId,
      owner: ownerId,
      extension: extension,
      users: [ownerId],
    };

    await databases.createDocument(
      appwrite.dbId,
      appwrite.fileCollection,
      ID.unique(),
      fileDocument
    );

    return bucketFile;
  } catch (error) {
    console.error("File upload failed:", error);

    if (bucketFile) {
      try {
        await storage.deleteFile(appwrite.bucket, bucketFile.$id);
        console.log(
          "Rollback: Deleted file from storage due to database error"
        );
      } catch (deleteError) {
        console.error("Failed to delete file during rollback:", deleteError);
      }
    }

    throw error;
  }
};
