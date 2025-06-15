"use server";

import { InputFile } from "node-appwrite/file";
import { createAdminSession, createSessionClient } from "../appwriteConfig";
import { appwrite } from "@/constant/appwriteConstant";
import { ID, Permission, Query, Role } from "node-appwrite";
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
      inputFile,
      [Permission.read("any")]
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

export const getUserFiles = async () => {
  const { account, databases } = await createSessionClient();

  try {
    const currentUser = await account.get();

    const userDoc = await databases.listDocuments(
      appwrite.dbId,
      appwrite.userCollection,
      [Query.equal("accountId", currentUser.$id)]
    );

    const result = await databases.listDocuments(
      appwrite.dbId,
      appwrite.fileCollection,
      [Query.equal("owner", userDoc.documents[0].$id)]
    );
    return result.documents;
  } catch (error) {
    console.log("Get user file Error: ", error);
    throw error;
  }
};
