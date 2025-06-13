import { appwrite } from "@/constant/appwriteConstant";
import { createAdminSession } from "../appwriteConfig";
import { Query } from "node-appwrite";

const getUserByEmail = async (email: string) => {
  const { databases } = await createAdminSession();
  const result = await databases.listDocuments(
    appwrite.dbId,
    appwrite.userCollection,
    [Query.equal("email", email)]
  );

  return result.total ? result.documents[0] : null;
};

export const createAccount = async ({
  fullname,
  email,
}: {
  fullname: string;
  email: string;
}) => {
  const existinguser = await getUserByEmail(email);
};
